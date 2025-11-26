from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from pathlib import Path
import sys
import base64
import io
from PIL import Image

# Add models to path
sys.path.append(str(Path(__file__).parent))
from models.classifiers import CNNTextClassifier
from scripts.prepare_data import TextPreprocessor

app = FastAPI(title="Emotion Classification API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load text model on startup
device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
preprocessor = None
model = None

@app.on_event("startup")
async def load_model():
    global preprocessor, model
    
    # Load preprocessor
    preprocessor_path = Path(__file__).parent / "data" / "processed" / "preprocessor.pkl"
    preprocessor = TextPreprocessor.load(preprocessor_path)
    
    # Load CNN model
    vocab_size = len(preprocessor.word2idx)
    model = CNNTextClassifier(vocab_size=vocab_size, embedding_dim=100, num_classes=4)
    model_path = Path(__file__).parent / "exports" / "best_CNNTextClassifier.pth"
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    
    print(f"✓ Text model loaded on {device}")

# ============= TEXT EMOTION ENDPOINTS =============

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    probabilities: dict

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Predict emotion from text"""
    try:
        sequence = preprocessor.text_to_sequence(request.text)
        X = torch.tensor([sequence], dtype=torch.long).to(device)
        
        with torch.no_grad():
            outputs = model(X)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        emotion = preprocessor.idx2label[predicted.item()]
        conf = confidence.item()
        
        all_probs = {
            preprocessor.idx2label[i]: float(probabilities[0][i].item())
            for i in range(4)
        }
        
        return PredictionResponse(
            emotion=emotion,
            confidence=conf,
            probabilities=all_probs
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= FACIAL EMOTION ENDPOINTS =============

@app.post("/analyze-face")
async def analyze_face(file: UploadFile = File(...)):
    """Analyze facial emotions using Roboflow"""
    try:
        from inference_sdk import InferenceHTTPClient
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Save temporarily
        temp_path = Path(__file__).parent / "temp_face.jpg"
        image.save(temp_path)
        
        # Call Roboflow API
        client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key="zA35KvKxCXsd3865CBnl"
        )
        
        result = client.infer(str(temp_path), model_id="human-face-emotions/28")
        
        # Clean up
        temp_path.unlink()
        
        # Process predictions
        predictions = []
        if 'predictions' in result:
            for pred in result['predictions']:
                predictions.append({
                    'emotion': pred.get('class', 'unknown'),
                    'confidence': pred.get('confidence', 0),
                    'bbox': {
                        'x': pred.get('x', 0),
                        'y': pred.get('y', 0),
                        'width': pred.get('width', 0),
                        'height': pred.get('height', 0)
                    }
                })
        
        return {
            'predictions': predictions,
            'num_faces': len(predictions),
            'image_width': result.get('image', {}).get('width', 0),
            'image_height': result.get('image', {}).get('height', 0)
        }
    
    except Exception as e:
        print(f"Error in analyze_face: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= UTILITY ENDPOINTS =============

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "model_loaded": model is not None}

@app.get("/metrics")
async def get_metrics():
    """Get model training metrics"""
    try:
        metrics_path = Path(__file__).parent / "exports" / "model_metrics.json"
        if not metrics_path.exists():
            raise HTTPException(status_code=404, detail="Metrics not found")
        
        import json
        with open(metrics_path, 'r', encoding='utf-8') as f:
            metrics = json.load(f)
        
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
