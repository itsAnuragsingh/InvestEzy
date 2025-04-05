import yfinance as yf
import pandas as pd
import time
from utils.stock_utils import get_stock_metrics

def get_stock_data(ticker, years=5, retries=3, with_metrics=False):
    """
    Get stock data with improved error handling and retries
    
    Args:
        ticker: Stock symbol (with or without .NS suffix)
        years: Years of historical data to fetch
        retries: Number of retry attempts
        with_metrics: Whether to calculate metrics or just return raw data
    
    Returns:
        If with_metrics=True: Dictionary with stock metrics
        If with_metrics=False: DataFrame with stock data
    """
    # Ensure proper suffix for Indian stocks
    if '.' not in ticker:
        ticker = f"{ticker}.NS"
    
    # Try multiple times to account for network issues
    for attempt in range(retries):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period=f"{years+1}y")
            
            # Check if we got valid data
            if hist.empty:
                if attempt < retries-1:
                    time.sleep(1)  # Wait before retry
                    continue
                return {"error": f"No data available for {ticker}", "success": False}
                
            if len(hist) < 252:  # Less than a year of trading days
                return {"error": f"Insufficient data for {ticker}", "success": False}
            
            # Return metrics if requested
            if with_metrics:
                return get_stock_metrics(hist, ticker, years)
                
            # Return only Close price, renamed to the ticker
            return hist[['Close']].rename(columns={'Close': ticker})
            
        except Exception as e:
            if attempt < retries-1:
                time.sleep(1)  # Wait before retry
                continue
            return {"error": str(e), "success": False}
            
    return {"error": "Data fetch failed after retries", "success": False}  # If all retries failed