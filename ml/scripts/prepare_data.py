import json
import torch
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from collections import Counter
import pickle

class TextPreprocessor:
    """Preprocessor for text data: tokenization, vocabulary, encoding"""
    
    def __init__(self, vocab_size=10000, max_seq_len=50):
        self.vocab_size = vocab_size
        self.max_seq_len = max_seq_len
        self.word2idx = {"<PAD>": 0, "<UNK>": 1}
        self.idx2word = {0: "<PAD>", 1: "<UNK>"}
        self.label2idx = {"alegria": 0, "tristeza": 1, "ira": 2, "miedo": 3}
        self.idx2label = {0: "alegria", 1: "tristeza", 2: "ira", 3: "miedo"}
        
    def build_vocab(self, texts):
        """Build vocabulary from texts"""
        all_words = []
        for text in texts:
            words = text.lower().split()
            all_words.extend(words)
        
        # Count and get most common
        word_counts = Counter(all_words)
        most_common = word_counts.most_common(self.vocab_size - 2)  # -2 for PAD and UNK
        
        # Build vocab
        for idx, (word, _) in enumerate(most_common, start=2):
            self.word2idx[word] = idx
            self.idx2word[idx] = word
        
        print(f"✓ Built vocabulary with {len(self.word2idx)} words")
    
    def text_to_sequence(self, text):
        """Convert text to sequence of indices"""
        words = text.lower().split()
        sequence = [self.word2idx.get(word, 1) for word in words]  # 1 is UNK
        
        # Pad or truncate
        if len(sequence) < self.max_seq_len:
            sequence += [0] * (self.max_seq_len - len(sequence))
        else:
            sequence = sequence[:self.max_seq_len]
        
        return sequence
    
    def save(self, path):
        """Save preprocessor"""
        data = {
            'vocab_size': self.vocab_size,
            'max_seq_len': self.max_seq_len,
            'word2idx': self.word2idx,
            'idx2word': self.idx2word,
            'label2idx': self.label2idx,
            'idx2label': self.idx2label
        }
        with open(path, 'wb') as f:
            pickle.dump(data, f)
        print(f"✓ Saved preprocessor to {path}")
    
    @classmethod
    def load(cls, path):
        """Load preprocessor"""
        with open(path, 'rb') as f:
            data = pickle.load(f)
        
        preprocessor = cls(data['vocab_size'], data['max_seq_len'])
        preprocessor.word2idx = data['word2idx']
        preprocessor.idx2word = data['idx2word']
        preprocessor.label2idx = data['label2idx']
        preprocessor.idx2label = data['idx2label']
        
        return preprocessor

def load_and_prepare_data():
    """Load dataset and prepare train/val/test splits"""
    
    # Load synthetic dataset
    data_path = Path(__file__).parent.parent / "data" / "raw" / "synthetic_dataset.json"
    
    if not data_path.exists():
        print(f"ERROR: Dataset not found at {data_path}")
        return None
    
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✓ Loaded {len(data)} samples")
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Check distribution
    print("\nEmotion distribution:")
    print(df['emotion'].value_counts())
    
    # Train/Val/Test split
    train_val, test = train_test_split(df, test_size=0.15, stratify=df['emotion'], random_state=42)
    train, val = train_test_split(train_val, test_size=0.176, stratify=train_val['emotion'], random_state=42)  # 0.176 * 0.85 ≈ 0.15
    
    print(f"\nSplits:")
    print(f"  Train: {len(train)} ({len(train)/len(df)*100:.1f}%)")
    print(f"  Val:   {len(val)} ({len(val)/len(df)*100:.1f}%)")
    print(f"  Test:  {len(test)} ({len(test)/len(df)*100:.1f}%)")
    
    # Build preprocessor
    preprocessor = TextPreprocessor(vocab_size=10000, max_seq_len=50)
    preprocessor.build_vocab(train['text'].tolist())
    
    # Encode data
    def encode_data(df_split):
        X = [preprocessor.text_to_sequence(text) for text in df_split['text']]
        y = [preprocessor.label2idx[label] for label in df_split['emotion']]
        return torch.tensor(X, dtype=torch.long), torch.tensor(y, dtype=torch.long)
    
    X_train, y_train = encode_data(train)
    X_val, y_val = encode_data(val)
    X_test, y_test = encode_data(test)
    
    # Save
    processed_dir = Path(__file__).parent.parent / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    torch.save({
        'X_train': X_train,
        'y_train': y_train,
        'X_val': X_val,
        'y_val': y_val,
        'X_test': X_test,
        'y_test': y_test
    }, processed_dir / "datasets.pt")
    
    preprocessor.save(processed_dir / "preprocessor.pkl")
    
    print(f"\n✓ Saved processed data to {processed_dir}")
    
    return preprocessor

if __name__ == "__main__":
    load_and_prepare_data()
