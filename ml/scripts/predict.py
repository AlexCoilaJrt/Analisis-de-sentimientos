import torch
import sys
from pathlib import Path

# Add paths
sys.path.append(str(Path(__file__).parent.parent))
from models.classifiers import CNNTextClassifier, LSTMTextClassifier
from scripts.prepare_data import TextPreprocessor

def predict(text, model_type='cnn'):
    """Predict emotion from text"""
    device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
    
    # Load preprocessor
    preprocessor_path = Path(__file__).parent.parent / "data" / "processed" / "preprocessor.pkl"
    preprocessor = TextPreprocessor.load(preprocessor_path)
    
    # Load model
    vocab_size = len(preprocessor.word2idx)
    
    if model_type == 'cnn':
        model = CNNTextClassifier(vocab_size=vocab_size, embedding_dim=100, num_classes=4)
        model_path = Path(__file__).parent.parent / "exports" / "best_CNNTextClassifier.pth"
    else:
        model = LSTMTextClassifier(vocab_size=vocab_size, embedding_dim=100, hidden_dim=64, num_classes=4)
        model_path = Path(__file__).parent.parent / "exports" / "best_LSTMTextClassifier.pth"
    
    model.load_state_dict(torch.load(model_path))
    model = model.to(device)
    model.eval()
    
    # Preprocess
    sequence = preprocessor.text_to_sequence(text)
    X = torch.tensor([sequence], dtype=torch.long).to(device)
    
    # Predict
    with torch.no_grad():
        outputs = model(X)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)
    
    emotion = preprocessor.idx2label[predicted.item()]
    conf = confidence.item() * 100
    
    # Get all probabilities
    all_probs = {preprocessor.idx2label[i]: probabilities[0][i].item() * 100 for i in range(4)}
    
    return emotion, conf, all_probs

if __name__ == "__main__":
    # Test sentences
    test_sentences = [
        "Estoy muy feliz con esta noticia",
        "Me siento triste y solo",
        "Estoy furioso, me da mucha rabia",
        "Tengo mucho miedo y ansiedad",
        "Qué alegría me da esto",
        "Estoy de bajón, no tengo ánimo",
        "Me saca de quicio esta situación",
        "Estoy aterrorizado"
    ]
    
    print("\\n" + "="*70)
    print("PREDICCIONES CON CNN")
    print("="*70 + "\\n")
    
    for sentence in test_sentences:
        emotion, conf, probs = predict(sentence, 'cnn')
        print(f"Texto: '{sentence}'")
        print(f"  → Emoción: {emotion.upper()} (confianza: {conf:.1f}%)")
        print(f"  → Probabilidades: {', '.join([f'{k}: {v:.1f}%' for k, v in probs.items()])}")
        print()
