import torch
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from pathlib import Path
import sys
import json

sys.path.append(str(Path(__file__).parent.parent))
from models.classifiers import CNNTextClassifier
from scripts.prepare_data import TextPreprocessor

def evaluate_model():
    """Evaluate model and generate detailed metrics"""
    
    device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
    
    # Load test data
    data_path = Path(__file__).parent.parent / "data" / "processed" / "datasets.pt"
    data = torch.load(data_path)
    X_test, y_test = data['X_test'], data['y_test']
    
    # Load preprocessor
    preprocessor_path = Path(__file__).parent.parent / "data" / "processed" / "preprocessor.pkl"
    preprocessor = TextPreprocessor.load(preprocessor_path)
    
    # Load model
    vocab_size = len(preprocessor.word2idx)
    model = CNNTextClassifier(vocab_size=vocab_size, embedding_dim=100, num_classes=4)
    model_path = Path(__file__).parent.parent / "exports" / "best_CNNTextClassifier.pth"
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    
    # Predictions
    all_predictions = []
    all_labels = []
    
    with torch.no_grad():
        X_test = X_test.to(device)
        outputs = model(X_test)
        _, predicted = torch.max(outputs, 1)
        
        all_predictions = predicted.cpu().numpy()
        all_labels = y_test.numpy()
    
    # Calculate metrics
    accuracy = accuracy_score(all_labels, all_predictions)
    
    # Classification report
    target_names = ['Alegría', 'Tristeza', 'Ira', 'Miedo']
    report = classification_report(
        all_labels, 
        all_predictions, 
        target_names=target_names,
        output_dict=True
    )
    
    # Confusion matrix
    cm = confusion_matrix(all_labels, all_predictions)
    
    # Format results
    metrics = {
        'overall': {
            'accuracy': float(accuracy),
            'test_samples': len(y_test)
        },
        'per_class': {
            'Alegría': {
                'precision': report['Alegría']['precision'],
                'recall': report['Alegría']['recall'],
                'f1-score': report['Alegría']['f1-score'],
                'support': int(report['Alegría']['support'])
            },
            'Tristeza': {
                'precision': report['Tristeza']['precision'],
                'recall': report['Tristeza']['recall'],
                'f1-score': report['Tristeza']['f1-score'],
                'support': int(report['Tristeza']['support'])
            },
            'Ira': {
                'precision': report['Ira']['precision'],
                'recall': report['Ira']['recall'],
                'f1-score': report['Ira']['f1-score'],
                'support': int(report['Ira']['support'])
            },
            'Miedo': {
                'precision': report['Miedo']['precision'],
                'recall': report['Miedo']['recall'],
                'f1-score': report['Miedo']['f1-score'],
                'support': int(report['Miedo']['support'])
            }
        },
        'confusion_matrix': cm.tolist()
    }
    
    # Save to file
    output_path = Path(__file__).parent.parent / "exports" / "model_metrics.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*70)
    print("MÉTRICAS DEL MODELO CNN")
    print("="*70)
    print(f"\nAccuracy Global: {accuracy*100:.2f}%")
    print(f"Muestras de Prueba: {len(y_test)}")
    
    print("\n" + "-"*70)
    print("Métricas por Clase:")
    print("-"*70)
    for emotion in target_names:
        m = metrics['per_class'][emotion]
        print(f"\n{emotion}:")
        print(f"  Precision: {m['precision']*100:.2f}%")
        print(f"  Recall:    {m['recall']*100:.2f}%")
        print(f"  F1-Score:  {m['f1-score']*100:.2f}%")
        print(f"  Support:   {m['support']} muestras")
    
    print("\n" + "-"*70)
    print("Matriz de Confusión:")
    print("-"*70)
    print("        ", "  ".join([f"{e:^10}" for e in target_names]))
    for i, row in enumerate(cm):
        print(f"{target_names[i]:10}", "  ".join([f"{val:^10}" for val in row]))
    
    print("\n✓ Métricas guardadas en:", output_path)
    
    return metrics

if __name__ == "__main__":
    evaluate_model()
