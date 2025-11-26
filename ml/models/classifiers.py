import torch
import torch.nn as nn

class CNNTextClassifier(nn.Module):
    """
    CNN for text classification with multiple filter sizes.
    Detects local patterns like "me siento", "estoy hasta"
    """
    def __init__(self, vocab_size, embedding_dim=300, num_classes=4, max_seq_len=50):
        super(CNNTextClassifier, self).__init__()
        
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        
        # Multiple filter sizes to capture different n-grams
        self.conv1 = nn.Conv1d(embedding_dim, 128, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(embedding_dim, 128, kernel_size=4, padding=2)
        self.conv3 = nn.Conv1d(embedding_dim, 128, kernel_size=5, padding=2)
        
        self.relu = nn.ReLU()
        self.dropout1 = nn.Dropout(0.3)
        
        # Global max pooling will reduce to fixed size
        self.fc1 = nn.Linear(128 * 3, 128)  # 3 conv layers
        self.dropout2 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(128, num_classes)
        
    def forward(self, x):
        # x shape: (batch_size, seq_len)
        embedded = self.embedding(x)  # (batch_size, seq_len, embedding_dim)
        embedded = embedded.permute(0, 2, 1)  # (batch_size, embedding_dim, seq_len)
        
        # Apply convolutions
        conv1_out = self.relu(self.conv1(embedded))  # (batch_size, 128, seq_len)
        conv2_out = self.relu(self.conv2(embedded))
        conv3_out = self.relu(self.conv3(embedded))
        
        # Global max pooling
        pool1 = torch.max(conv1_out, dim=2)[0]  # (batch_size, 128)
        pool2 = torch.max(conv2_out, dim=2)[0]
        pool3 = torch.max(conv3_out, dim=2)[0]
        
        # Concatenate
        pooled = torch.cat([pool1, pool2, pool3], dim=1)  # (batch_size, 384)
        pooled = self.dropout1(pooled)
        
        # Fully connected layers
        fc1_out = self.relu(self.fc1(pooled))
        fc1_out = self.dropout2(fc1_out)
        output = self.fc2(fc1_out)
        
        return output

class LSTMTextClassifier(nn.Module):
    """
    Bidirectional LSTM for text classification.
    Captures long-range dependencies and context.
    """
    def __init__(self, vocab_size, embedding_dim=300, hidden_dim=128, num_classes=4, num_layers=2):
        super(LSTMTextClassifier, self).__init__()
        
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        
        self.lstm = nn.LSTM(
            embedding_dim,
            hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=0.3 if num_layers > 1 else 0
        )
        
        self.dropout = nn.Dropout(0.3)
        
        # *2 because bidirectional
        self.fc1 = nn.Linear(hidden_dim * 2, 64)
        self.relu = nn.ReLU()
        self.dropout2 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(64, num_classes)
        
    def forward(self, x):
        # x shape: (batch_size, seq_len)
        embedded = self.embedding(x)  # (batch_size, seq_len, embedding_dim)
        
        # LSTM
        lstm_out, (hidden, cell) = self.lstm(embedded)
        
        # Take the output from the last time step
        # For bidirectional, concatenate forward and backward final hidden states
        # hidden shape: (num_layers * 2, batch_size, hidden_dim)
        forward_hidden = hidden[-2, :, :]  # (batch_size, hidden_dim)
        backward_hidden = hidden[-1, :, :]
        final_hidden = torch.cat([forward_hidden, backward_hidden], dim=1)  # (batch_size, hidden_dim*2)
        
        final_hidden = self.dropout(final_hidden)
        
        # Fully connected
        fc1_out = self.relu(self.fc1(final_hidden))
        fc1_out = self.dropout2(fc1_out)
        output = self.fc2(fc1_out)
        
        return output

if __name__ == "__main__":
    # Test models
    vocab_size = 10000
    batch_size = 16
    seq_len = 50
    
    # Dummy input
    x = torch.randint(0, vocab_size, (batch_size, seq_len))
    
    # Test CNN
    cnn_model = CNNTextClassifier(vocab_size)
    cnn_out = cnn_model(x)
    print(f"CNN output shape: {cnn_out.shape}")  # Should be (16, 4)
    
    # Test LSTM
    lstm_model = LSTMTextClassifier(vocab_size)
    lstm_out = lstm_model(x)
    print(f"LSTM output shape: {lstm_out.shape}")  # Should be (16, 4)
    
    print("✓ Models initialized successfully")
