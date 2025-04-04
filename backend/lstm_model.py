import numpy as np
import pandas as pd
import yfinance as yf
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt


# Configuration
MODEL_SAVE_PATH = "model/stock_lstm_model.keras"
SEQUENCE_LENGTH = 60  # Number of days to look back for prediction
FUTURE_DAYS = 1       # Number of days to predict ahead
EPOCHS = 50
BATCH_SIZE = 32
VALIDATION_SPLIT = 0.2

# Create model directory if it doesn't exist
os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)

def download_indian_stock_data(tickers, period="2y"):
    """
    Download historical data for a list of Indian stocks
    """
    all_data = {}
    for ticker in tickers:
        # Add .NS suffix for NSE listed stocks if not already present
        if '.NS' not in ticker:
            ticker_symbol = f"{ticker}.NS"
        else:
            ticker_symbol = ticker
            
        print(f"Downloading data for {ticker_symbol}...")
        
        try:
            stock = yf.Ticker(ticker_symbol)
            hist = stock.history(period=period)
            
            if not hist.empty and len(hist) > 100:
                all_data[ticker_symbol] = hist
                print(f"Successfully downloaded {len(hist)} days of data for {ticker_symbol}")
            else:
                print(f"Insufficient data for {ticker_symbol}")
        except Exception as e:
            print(f"Error downloading {ticker_symbol}: {str(e)}")
    
    return all_data

def create_sequences(data, seq_length=SEQUENCE_LENGTH, future_days=FUTURE_DAYS):
    """
    Create sequences of data for LSTM training
    X: sequence of seq_length days
    y: price after future_days
    """
    X, y = [], []
    
    for i in range(len(data) - seq_length - future_days):
        X.append(data[i:(i + seq_length)])
        y.append(data[i + seq_length + future_days - 1])
    
    return np.array(X), np.array(y)

def build_lstm_model(sequence_length):
    """
    Build and compile LSTM model
    """
    model = keras.Sequential([
        keras.layers.LSTM(units=50, return_sequences=True, input_shape=(sequence_length, 1)),
        keras.layers.Dropout(0.2),
        keras.layers.LSTM(units=50, return_sequences=False),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(units=25),
        keras.layers.Dense(units=1)
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_lstm_model():
    """
    Train LSTM model on Indian stock data
    """
    # List of major Indian stocks for diverse training (Nifty 50 stocks)
    indian_stocks = [
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 
        'HINDUNILVR', 'BHARTIARTL', 'KOTAKBANK', 'ITC', 'LT',
        'AXISBANK', 'SBIN', 'BAJFINANCE', 'ASIANPAINT', 'MARUTI',
        'TITAN', 'SUNPHARMA', 'NESTLEIND', 'BAJAJFINSV', 'WIPRO'
    ]
    
    # Download data
    stock_data = download_indian_stock_data(indian_stocks)
    
    # Prepare data for model
    all_X = []
    all_y = []
    
    # Process each stock
    for ticker, data in stock_data.items():
        print(f"Processing {ticker} for training...")
        
        # Use closing prices
        close_prices = data['Close'].values.reshape(-1, 1)
        
        # Normalize data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(close_prices)
        
        # Create sequences
        X, y = create_sequences(scaled_data)
        
        if len(X) > 0:
            all_X.append(X)
            all_y.append(y)
    
    # Combine data from all stocks
    if not all_X or not all_y:
        raise ValueError("No valid training data was created. Check the stock data.")
    
    X = np.vstack(all_X)
    y = np.vstack(all_y)
    
    print(f"Total training samples: {len(X)}")
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Build model
    model = build_lstm_model(SEQUENCE_LENGTH)
    
    # Add early stopping to prevent overfitting
    early_stopping = keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    )
    
    # Train model
    print("Training model...")
    history = model.fit(
        X_train, y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_split=VALIDATION_SPLIT,
        callbacks=[early_stopping],
        verbose=1
    )
    
    # Evaluate model
    test_loss = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test loss: {test_loss}")
    
    # Save model
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")
    
    # Plot training history
    plt.figure(figsize=(12, 6))
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('Model Loss During Training')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper right')
    plt.savefig('model/training_history.png')
    
    return model

def test_model_prediction(model, ticker="RELIANCE.NS"):
    """
    Test model prediction on a specific stock
    """
    print(f"Testing prediction on {ticker}...")
    
    # Get recent data
    stock = yf.Ticker(ticker)
    hist = stock.history(period="2y")
    
    if hist.empty or len(hist) < SEQUENCE_LENGTH:
        print(f"Insufficient data for {ticker}")
        return
    
    # Prepare data
    close_prices = hist['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)
    
    # Create prediction sequence (last 60 days)
    last_sequence = scaled_data[-SEQUENCE_LENGTH:]
    
    # Reshape for LSTM input [samples, time steps, features]
    current_reshape = last_sequence.reshape((1, last_sequence.shape[0], 1))
    
    # Predict next day
    next_pred = model.predict(current_reshape, verbose=0)[0][0]
    
    # Convert prediction back to original scale
    predicted_price = scaler.inverse_transform(np.array([[next_pred]]))[0][0]
    actual_price = close_prices[-1][0]
    
    print(f"Current price: ₹{actual_price:.2f}")
    print(f"Predicted next price: ₹{predicted_price:.2f}")
    print(f"Predicted change: {((predicted_price/actual_price)-1)*100:.2f}%")

if __name__ == "__main__":
    print("Starting Indian Stock LSTM Model Training...")
    

    
    