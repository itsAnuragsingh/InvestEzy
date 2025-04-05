import pandas as pd
import numpy as np
from services.stock_data import get_stock_data

def get_recommendations(user_portfolio, max_recommendations=3):
    """
    Get stock recommendations based on portfolio correlation
    
    Returns similar stocks not already in the portfolio
    """
    if not user_portfolio:
        return {"error": "No stocks in portfolio", "success": False}
    
    # Clean portfolio data
    valid_portfolio = [stock.strip() for stock in user_portfolio if stock and stock.strip()]
    
    # Popular Indian stocks for fallback
    popular_stocks = [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS", 
        "SBIN.NS", "BHARTIARTL.NS", "WIPRO.NS", "BAJFINANCE.NS", "ITC.NS",
        "TATAMOTORS.NS", "MARUTI.NS", "HINDUNILVR.NS", "ASIANPAINT.NS", "AXISBANK.NS"
    ]
    
    # Fetch stock data
    stock_data = {}
    
    # First fetch portfolio stocks
    for stock in valid_portfolio:
        try:
            df = get_stock_data(stock)
            if df is not None and not isinstance(df, dict) and not df.empty:
                stock_data[stock] = df
        except Exception:
            pass
    
    # Add popular stocks if needed
    if len(stock_data) < 2:
        for stock in popular_stocks:
            if stock not in stock_data and stock not in valid_portfolio:
                try:
                    df = get_stock_data(stock)
                    if df is not None and not isinstance(df, dict) and not df.empty:
                        stock_data[stock] = df
                        if len(stock_data) >= 5:  # Stop after we have enough
                            break
                except Exception:
                    pass
    
    # Use fallback if not enough data
    if len(stock_data) < 2:
        fallbacks = [s for s in popular_stocks if s not in valid_portfolio][:max_recommendations]
        return {
            "portfolio": valid_portfolio,
            "recommendations": fallbacks,
            "success": True,
            "note": "Based on popular Indian stocks 🇮🇳"
        }
    
    try:
        # Align data to common dates
        all_data = pd.concat([df for df in stock_data.values()], axis=1)
        all_data = all_data.dropna()
        
        # Compute correlation if we have enough data
        if all_data.shape[0] > 30 and all_data.shape[1] >= 2:
            correlation_matrix = all_data.corr()
            
            # Find recommendations based on correlation
            recommendations = []
            
            for stock in valid_portfolio:
                if stock in correlation_matrix.columns:
                    # Find correlated stocks not in portfolio
                    correlations = correlation_matrix[stock].drop(stock, errors='ignore')
                    
                    # Only consider stocks not in the portfolio
                    external_correlations = correlations[~correlations.index.isin(valid_portfolio)]
                    
                    if not external_correlations.empty:
                        top_similar = external_correlations.sort_values(ascending=False).head(2)
                        recommendations.extend(top_similar.index.tolist())
            
            # Get unique recommendations
            unique_recommendations = list(set(recommendations))[:max_recommendations]
            
            if unique_recommendations:
                # Add emoji hints based on correlation
                recommendations_with_hint = []
                for rec in unique_recommendations:
                    # Get highest correlation stock in portfolio
                    max_corr = 0
                    for stock in valid_portfolio:
                        if stock in correlation_matrix.columns and rec in correlation_matrix.index:
                            corr = correlation_matrix.loc[rec, stock]
                            max_corr = max(max_corr, corr)
                    
                    # Add emoji hint
                    if max_corr > 0.8:
                        hint = "👯‍♂ Very similar movement"
                    elif max_corr > 0.5:
                        hint = "🤝 Similar trend"
                    elif max_corr > 0.2:
                        hint = "📊 Some similarity"
                    else:
                        hint = "🧩 Diversification option"
                    
                    recommendations_with_hint.append({
                        "ticker": rec,
                        "hint": hint
                    })
                
                return {
                    "portfolio": valid_portfolio,
                    "recommendations": recommendations_with_hint,
                    "success": True,
                    "note": "Based on price correlation analysis 🔍"
                }
        
        # Fallback to popular stocks if correlation didn't work
        fallbacks = [s for s in popular_stocks if s not in valid_portfolio][:max_recommendations]
        return {
            "portfolio": valid_portfolio,
            "recommendations": fallbacks,
            "success": True,
            "note": "Based on popular Indian stocks 🇮🇳"
        }
    
    except Exception as e:
        # Return fallback recommendations on error
        fallbacks = [s for s in popular_stocks if s not in valid_portfolio][:max_recommendations]
        
        return {
            "portfolio": valid_portfolio,
            "recommendations": fallbacks,
            "success": True,
            "note": "Based on trending stocks 📈"
        }