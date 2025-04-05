import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta

# Default model path - should be trained separately
MODEL_PATH = "model/stock_lstm_model.keras"

def load_lstm_model():
    """Load the pre-trained LSTM model"""
    try:
        return keras.models.load_model(MODEL_PATH)
    except:
        # Return a simple linear model as fallback if LSTM model is not available
        print("LSTM model not found, using fallback model")
        return None

def predict_stock(ticker, days=30):
    """
    Predict stock prices for the next [days] using LSTM model
    or fallback to a simple moving average if model not available
    """
    try:
        # Ensure proper ticker format for Indian stocks
        if '.' not in ticker:
            ticker = f"{ticker}.NS"
            
        # Get historical data
        stock = yf.Ticker(ticker)
        hist = stock.history(period="2y")
        
        if hist.empty or len(hist) < 100:
            return {
                "error": f"Insufficient historical data for {ticker}",
                "success": False
            }
        
        # Get company name
        company_name = stock.info.get('longName', ticker)
        
        # Current price and dates
        current_price = hist['Close'].iloc[-1]
        last_date = hist.index[-1]
        
        # Try to use LSTM model
        model = load_lstm_model()
        
        if model:
            # LSTM based prediction
            return predict_with_lstm(model, hist, ticker, company_name, days, current_price, last_date)
        else:
            # Fallback to simple moving average
            return predict_with_moving_average(hist, ticker, company_name, days, current_price, last_date)
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return {
            "error": f"Could not generate prediction: {str(e)}",
            "success": False
        }

def predict_with_lstm(model, hist, ticker, company_name, days, current_price, last_date):
    """Generate predictions using LSTM model"""
    # Prepare data
    close_prices = hist['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)
    
    # Create prediction sequence (last 60 days)
    seq_length = 60
    last_sequence = scaled_data[-seq_length:]
    
    # Generate predictions
    future_prices = []
    current_sequence = last_sequence.copy()
    
    for _ in range(days):
        # Reshape for LSTM input [samples, time steps, features]
        current_reshape = current_sequence.reshape((1, current_sequence.shape[0], 1))
        next_pred = model.predict(current_reshape, verbose=0)[0][0]
        future_prices.append(next_pred)
        # Update sequence (remove oldest, add new prediction)
        current_sequence = np.append(current_sequence[1:], [[next_pred]], axis=0)
    
    # Convert predictions back to original scale
    future_prices = scaler.inverse_transform(np.array(future_prices).reshape(-1, 1))
    future_prices = [float(p[0]) for p in future_prices]
    
    # Generate dates for predictions
    prediction_dates = []
    for i in range(1, days + 1):
        prediction_dates.append((last_date + timedelta(days=i)).strftime('%Y-%m-%d'))
    
    # Calculate expected growth
    expected_change = ((future_prices[-1] / current_price) - 1) * 100
    trend = "up 📈" if expected_change > 0 else "down 📉"
    
    return {
        "ticker": ticker,
        "companyName": company_name,
        "currentPrice": float(current_price),
        "predictions": [
            {"date": date, "price": round(price, 2)} 
            for date, price in zip(prediction_dates, future_prices)
        ],
        "summary": {
            "expectedChange": round(expected_change, 2),
            "trend": trend,
            "message": f"Our AI model predicts {company_name} will go {trend} by {abs(round(expected_change, 2))}% in the next {days} days."
        },
        "method": "LSTM Neural Network",
        "success": True
    }

def predict_with_moving_average(hist, ticker, company_name, days, current_price, last_date):
    """Generate predictions using simple moving average as fallback"""
    # Simple moving average
    ma_window = min(30, len(hist) // 4)
    daily_returns = hist['Close'].pct_change().dropna()
    avg_daily_return = daily_returns[-ma_window:].mean()
    
    # Generate future prices
    future_prices = []
    next_price = current_price
    
    for _ in range(days):
        next_price = next_price * (1 + avg_daily_return)
        future_prices.append(next_price)
    
    # Generate dates for predictions
    prediction_dates = []
    for i in range(1, days + 1):
        prediction_dates.append((last_date + timedelta(days=i)).strftime('%Y-%m-%d'))
    
    # Calculate expected growth
    expected_change = ((future_prices[-1] / current_price) - 1) * 100
    trend = "up 📈" if expected_change > 0 else "down 📉"
    
    return {
        "ticker": ticker,
        "companyName": company_name,
        "currentPrice": float(current_price),
        "predictions": [
            {"date": date, "price": round(price, 2)} 
            for date, price in zip(prediction_dates, future_prices)
        ],
        "summary": {
            "expectedChange": round(expected_change, 2),
            "trend": trend,
            "message": f"Based on recent trends, {company_name} may go {trend} by {abs(round(expected_change, 2))}% in the next {days} days."
        },
        "method": "Moving Average Trend",
        "success": True
    }