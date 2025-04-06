import pandas as pd
import numpy as np
from services.stock_data import get_stock_data
import random

def get_recommendations(user_portfolio, max_recommendations=3):
    """
    Get stock recommendations based on portfolio correlation with beginner-friendly explanations
    
    Returns similar stocks not already in the portfolio with detailed, easy-to-understand explanations
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
    
    # Map tickers to company names and industry sectors
    company_data = {
        "RELIANCE.NS": {"name": "Reliance Industries", "sector": "Oil & Gas", "stability": "high", "growth": "moderate", "dividend": "good", "risk": "low"},
        "TCS.NS": {"name": "Tata Consultancy Services", "sector": "IT", "stability": "very high", "growth": "steady", "dividend": "excellent", "risk": "very low"},
        "INFY.NS": {"name": "Infosys", "sector": "IT", "stability": "high", "growth": "steady", "dividend": "good", "risk": "low"},
        "HDFCBANK.NS": {"name": "HDFC Bank", "sector": "Banking", "stability": "high", "growth": "good", "dividend": "moderate", "risk": "low"},
        "ICICIBANK.NS": {"name": "ICICI Bank", "sector": "Banking", "stability": "high", "growth": "good", "dividend": "moderate", "risk": "low-moderate"},
        "SBIN.NS": {"name": "State Bank of India", "sector": "Banking", "stability": "moderate", "growth": "good", "dividend": "moderate", "risk": "moderate"},
        "BHARTIARTL.NS": {"name": "Bharti Airtel", "sector": "Telecom", "stability": "moderate", "growth": "good", "dividend": "moderate", "risk": "moderate"},
        "WIPRO.NS": {"name": "Wipro", "sector": "IT", "stability": "high", "growth": "moderate", "dividend": "good", "risk": "low"},
        "BAJFINANCE.NS": {"name": "Bajaj Finance", "sector": "Financial Services", "stability": "moderate", "growth": "high", "dividend": "low", "risk": "moderate-high"},
        "ITC.NS": {"name": "ITC Limited", "sector": "FMCG", "stability": "very high", "growth": "moderate", "dividend": "excellent", "risk": "very low"},
        "TATAMOTORS.NS": {"name": "Tata Motors", "sector": "Automotive", "stability": "moderate", "growth": "high", "dividend": "low", "risk": "moderate-high"},
        "MARUTI.NS": {"name": "Maruti Suzuki", "sector": "Automotive", "stability": "high", "growth": "moderate", "dividend": "good", "risk": "low-moderate"},
        "HINDUNILVR.NS": {"name": "Hindustan Unilever", "sector": "FMCG", "stability": "very high", "growth": "steady", "dividend": "good", "risk": "very low"},
        "ASIANPAINT.NS": {"name": "Asian Paints", "sector": "Paints", "stability": "high", "growth": "good", "dividend": "moderate", "risk": "low"},
        "AXISBANK.NS": {"name": "Axis Bank", "sector": "Banking", "stability": "moderate", "growth": "good", "dividend": "moderate", "risk": "moderate"}
    }
    
    # Beginner-friendly explanations for different types of stocks
    beginner_explanations = {
        "blue_chip": [
            "Perfect for beginners: This is a well-established company with a history of reliable performance 🏆",
            "A 'blue-chip' stock that's considered very stable and suitable for new investors 🔵",
            "Historically stable with consistent performance - an excellent foundation for any portfolio 🏛️"
        ],
        "dividend": [
            "Pays regular dividends, giving you income while you hold the stock 💰",
            "Known for returning profits to shareholders through dividends - extra cash in your pocket! 💸",
            "Regular dividend payments make this an income-generating investment 📈"
        ],
        "growth": [
            "Shows strong growth potential that could increase your investment value over time 🚀",
            "Growing faster than many similar companies, with potential for higher returns 📈",
            "Has momentum in a growing sector, offering good potential for investment gains 🌱"
        ],
        "defensive": [
            "A more stable option that typically weathers market downturns better than others ⛈️",
            "Tends to remain stable even when markets are volatile - good for peace of mind 🛡️",
            "Less affected by economic cycles, providing stability when markets get rough 🧱"
        ],
        "sector_diversification": [
            "Helps diversify your portfolio by adding exposure to a new industry sector 🧩",
            "Adds balance to your investments by introducing a different business sector 🔄",
            "Reduces overall portfolio risk by spreading investments across different industries 🌐"
        ]
    }
    
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
        fallbacks = []
        for s in popular_stocks:
            if s not in valid_portfolio and len(fallbacks) < max_recommendations:
                stock_info = company_data.get(s, {"name": s.replace(".NS", ""), "sector": "Unknown"})
                
                # Choose appropriate explanation type based on stock characteristics
                if stock_info.get("stability") in ["high", "very high"]:
                    explanation_type = "blue_chip"
                elif stock_info.get("dividend") in ["good", "excellent"]:
                    explanation_type = "dividend"
                elif stock_info.get("growth") in ["good", "high"]:
                    explanation_type = "growth"
                else:
                    explanation_type = "blue_chip"
                
                reason = random.choice(beginner_explanations[explanation_type])
                
                fallbacks.append({
                    "ticker": s,
                    "hint": f"Top {stock_info.get('sector')} company",
                    "reason": f"{reason} • {stock_info.get('name')}"
                })
        
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
        
        # Identify portfolio sectors to suggest diversification
        portfolio_sectors = set()
        for stock in valid_portfolio:
            if stock in company_data:
                portfolio_sectors.add(company_data[stock]["sector"])
        
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
                        
                        for similar_stock, correlation in top_similar.items():
                            similar_stock_info = company_data.get(similar_stock, {"name": similar_stock.replace(".NS", ""), "sector": "Unknown"})
                            portfolio_stock_info = company_data.get(stock, {"name": stock.replace(".NS", ""), "sector": "Unknown"})
                            
                            # Choose explanation type based on stock characteristics and portfolio context
                            if similar_stock_info.get("sector") not in portfolio_sectors:
                                explanation_type = "sector_diversification"
                                reason_prefix = f"Adds a new sector ({similar_stock_info.get('sector')}) to your portfolio: "
                            elif similar_stock_info.get("stability") in ["high", "very high"]:
                                explanation_type = "blue_chip"
                                reason_prefix = ""
                            elif similar_stock_info.get("dividend") in ["good", "excellent"]:
                                explanation_type = "dividend"
                                reason_prefix = ""
                            elif similar_stock_info.get("growth") in ["good", "high"]:
                                explanation_type = "growth"
                                reason_prefix = ""
                            elif similar_stock_info.get("risk") in ["low", "very low"]:
                                explanation_type = "defensive"
                                reason_prefix = ""
                            else:
                                explanation_type = "growth"
                                reason_prefix = ""
                            
                            reason = reason_prefix + random.choice(beginner_explanations[explanation_type])
                            
                            # Add specific details about the relationship with existing stocks
                            if correlation > 0.6:
                                relationship = f"Similar performance patterns to {portfolio_stock_info.get('name')} in your portfolio, but may offer different advantages"
                            else:
                                relationship = f"Performs differently than {portfolio_stock_info.get('name')}, adding valuable diversity to your investments"
                            
                            recommendations.append({
                                "ticker": similar_stock,
                                "hint": f"{similar_stock_info.get('sector')} sector",
                                "reason": f"{reason} • {relationship}",
                                "correlation": correlation,
                                "relatedTo": stock,
                                "sector": similar_stock_info.get("sector")
                            })
            
            # Get unique recommendations (by ticker) and ensure sector diversity
            unique_tickers = set()
            unique_sectors = set()
            unique_recommendations = []
            
            # First pass: get high-quality diverse recommendations
            for rec in sorted(recommendations, key=lambda x: x['correlation'], reverse=True):
                if rec['ticker'] not in unique_tickers and len(unique_recommendations) < max_recommendations:
                    # Prioritize sector diversity
                    if rec['sector'] not in unique_sectors or len(unique_sectors) >= 3:
                        unique_tickers.add(rec['ticker'])
                        unique_sectors.add(rec['sector'])
                        unique_recommendations.append(rec)
            
            # Second pass: fill any remaining slots
            if len(unique_recommendations) < max_recommendations:
                for rec in sorted(recommendations, key=lambda x: x['correlation'], reverse=True):
                    if rec['ticker'] not in unique_tickers and len(unique_recommendations) < max_recommendations:
                        unique_tickers.add(rec['ticker'])
                        unique_recommendations.append(rec)
            
            if unique_recommendations:
                return {
                    "portfolio": valid_portfolio,
                    "recommendations": unique_recommendations,
                    "success": True,
                    "note": "Based on your investment profile 🔍"
                }
        
        # Fallback to popular stocks if correlation didn't work
        fallbacks = []
        for s in popular_stocks:
            if s not in valid_portfolio and len(fallbacks) < max_recommendations:
                stock_info = company_data.get(s, {"name": s.replace(".NS", ""), "sector": "Unknown"})
                
                if stock_info.get("sector") not in portfolio_sectors and len(portfolio_sectors) > 0:
                    explanation_type = "sector_diversification"
                    reason_prefix = f"Adds a new sector ({stock_info.get('sector')}) to your portfolio: "
                elif stock_info.get("stability") in ["high", "very high"]:
                    explanation_type = "blue_chip"
                    reason_prefix = ""
                elif stock_info.get("dividend") in ["good", "excellent"]:
                    explanation_type = "dividend"
                    reason_prefix = ""
                else:
                    explanation_type = "growth"
                    reason_prefix = ""
                
                reason = reason_prefix + random.choice(beginner_explanations[explanation_type])
                
                fallbacks.append({
                    "ticker": s,
                    "hint": f"{stock_info.get('sector')} sector",
                    "reason": reason
                })
        
        return {
            "portfolio": valid_portfolio,
            "recommendations": fallbacks,
            "success": True,
            "note": "Based on popular Indian stocks 🇮🇳"
        }
    
    except Exception as e:
        # Return fallback recommendations on error
        fallbacks = []
        for s in popular_stocks:
            if s not in valid_portfolio and len(fallbacks) < max_recommendations:
                stock_info = company_data.get(s, {"name": s.replace(".NS", ""), "sector": "Unknown"})
                
                # Choose explanation for this fallback
                if stock_info.get("stability") in ["high", "very high"]:
                    explanation = "A safe, established company that's perfect for beginners 🔵"
                elif stock_info.get("dividend") in ["good", "excellent"]:
                    explanation = "Provides regular income through dividend payments 💰"
                elif stock_info.get("growth") in ["good", "high"]:
                    explanation = "Shows strong growth potential for long-term investors 📈"
                else:
                    explanation = "A well-regarded company that's suitable for new investors 👍"
                
                fallbacks.append({
                    "ticker": s,
                    "hint": f"{stock_info.get('sector')} stock",
                    "reason": explanation
                })
        
        return {
            "portfolio": valid_portfolio,
            "recommendations": fallbacks,
            "success": True,
            "note": "Based on beginner-friendly stocks 🔍"
        }