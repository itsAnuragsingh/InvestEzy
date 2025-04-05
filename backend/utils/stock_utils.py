import numpy as np
import pandas as pd
import yfinance as yf

def get_stock_metrics(hist, ticker, years=5):
    """
    Calculate key stock metrics from historical data
    
    Returns a dictionary with growth, risk, and stability metrics
    """
    try:
        # Get basic info
        latest_price = hist['Close'].iloc[-1]
        years_ago_index = max(0, int(len(hist) - 252*years))
        years_ago_price = hist['Close'].iloc[years_ago_index]
        
        # Calculate Growth metrics
        growth_in_years = ((latest_price / years_ago_price) - 1) * 100
        cagr = (((latest_price / years_ago_price) ** (1/years)) - 1) * 100
        
        # Calculate Risk metrics
        daily_returns = hist['Close'].pct_change().dropna()
        fluctuation = np.std(daily_returns) * np.sqrt(252) * 100  # Annualized volatility
        
        # Calculate Stability Score (modified Sharpe ratio)
        risk_free_rate = 6  # Current risk-free rate in India (approx.)
        avg_annual_return = daily_returns.mean() * 252 * 100
        stability_score = (avg_annual_return - risk_free_rate) / (np.std(daily_returns) * np.sqrt(252))
        
        # Get company info
        stock = yf.Ticker(ticker)
        try:
            info = stock.info
            company_name = info.get('longName', ticker.replace('.NS', ''))
            pe_ratio = info.get('trailingPE', 'N/A')
            if pe_ratio != 'N/A':
                pe_ratio = round(pe_ratio, 2)
            
            dividend_yield = info.get('dividendYield', 0)
            if dividend_yield:
                dividend_yield = round(dividend_yield * 100, 2)
            
            market_cap = info.get('marketCap', 0)
            if market_cap:
                market_cap = round(market_cap / 10000000, 2)  # Convert to Cr
            else:
                market_cap = "N/A"
        except:
            company_name = ticker.replace('.NS', '')
            pe_ratio = "N/A"
            dividend_yield = "N/A"
            market_cap = "N/A"
        
        # Determine Reliability Stars
        if stability_score > 1.5 and fluctuation < 15:
            reliability_stars = 5
        elif 1.0 <= stability_score <= 1.5:
            reliability_stars = 4
        elif 0.5 <= stability_score <= 1.0:
            reliability_stars = 3
        elif 0 <= stability_score <= 0.5:
            reliability_stars = 2
        else:
            reliability_stars = 1
        
        # Determine Risk Level
        if fluctuation < 15:
            risk_level = "Low"
            risk_meter = "Safe"
        elif 15 <= fluctuation <= 30:
            risk_level = "Medium"
            risk_meter = "Moderate Risk"
        else:
            risk_level = "High"
            risk_meter = "High Risk"
            
        # Get chart data (last 30 days)
        recent_data = hist[-30:]['Close'].tolist()
        dates = [d.strftime('%Y-%m-%d') for d in hist[-30:].index.tolist()]
        
        return {
            "ticker": ticker,
            "companyName": company_name,
            "latestPrice": round(latest_price, 2),
            "returns": {
                "absolute": round(growth_in_years, 2),
                "projection": round(10000 * (1 + growth_in_years / 100), 2),
                "cagr": round(cagr, 2)
            },
            "risk": {
                "fluctuation": round(fluctuation, 2),
                "level": risk_level,
                "meter": risk_meter
            },
            "stability": {
                "score": round(stability_score, 2),
                "stars": reliability_stars
            },
            "fundamentals": {
                "peRatio": pe_ratio,
                "dividendYield": dividend_yield,
                "marketCap": market_cap
            },
            "chartData": {
                "dates": dates,
                "prices": recent_data
            },
            "success": True
        }
    except Exception as e:
        return {"error": str(e), "success": False}