

import random
from datetime import datetime
import pandas as pd
import numpy as np
import yfinance as yf
from services.stock_data import get_stock_data
from utils.stock_utils import get_stock_metrics

def assess_risk_profile(answers):
    """
    Assess user's risk profile based on questionnaire answers
    
    Args:
        answers: Dictionary with keys like age, income, goals, timeline, experience, etc.
        
    Returns:
        Dictionary with risk profile and investment suggestions
    """
    # Default to moderate if no answers provided
    if not answers:
        return {
            "riskProfile": "moderate",
            "riskScore": 5,
            "maxRiskAllocation": 50,
            "suggestion": "Since we don't have your preferences yet, we're suggesting a balanced approach. Consider taking our quick quiz to get personalized recommendations! 📝"
        }
    
    # Calculate risk score (1-10 scale)
    risk_score = 5  # Start with middle score
    
    # Age factor (-2 to +2)
    if answers.get('age'):
        age = int(answers.get('age', 30))
        if age < 30:
            risk_score += 2  # Younger can take more risk
        elif age < 40:
            risk_score += 1
        elif age < 50:
            risk_score += 0  # Neutral
        elif age < 60:
            risk_score -= 1
        else:
            risk_score -= 2  # Older prefer less risk
    
    # Investment timeline (+2 to -2)
    if answers.get('timeline'):
        timeline = answers.get('timeline')
        if timeline == 'long':
            risk_score += 2  # Long timeline allows more risk
        elif timeline == 'medium':
            risk_score += 0  # Neutral
        else:
            risk_score -= 2  # Short timeline needs lower risk
    
    # Previous experience (+2 to -1)
    if answers.get('experience'):
        experience = answers.get('experience')
        if experience == 'experienced':
            risk_score += 2
        elif experience == 'some':
            risk_score += 1
        elif experience == 'beginner':
            risk_score += 0
        else:
            risk_score -= 1  # Very new, reduce risk
    
    # Risk tolerance question (+2 to -2)
    if answers.get('riskTolerance'):
        tolerance = answers.get('riskTolerance')
        if tolerance == 'high':
            risk_score += 2
        elif tolerance == 'medium':
            risk_score += 0
        else:
            risk_score -= 2
    
    # Investment goal adjustment
    if answers.get('goal'):
        goal = answers.get('goal')
        if goal == 'growth':
            risk_score += 1
        elif goal == 'balanced':
            risk_score += 0
        else:  # income/safety
            risk_score -= 1
    
    # Ensure risk score is between 1-10
    risk_score = max(1, min(10, risk_score))
    
    # Determine risk profile
    if risk_score >= 8:
        profile = "aggressive"
        max_allocation = 80
        emoji = "🚀"
        suggestion = f"{emoji} You seem comfortable with high risk for potentially higher returns. Consider growth-focused stocks, but still maintain some safer options."
    elif risk_score >= 6:
        profile = "growth"
        max_allocation = 70
        emoji = "📈"
        suggestion = f"{emoji} You're growth-oriented with moderate risk tolerance. A mix of stable blue-chips and growing companies might work well for you."
    elif risk_score >= 4:
        profile = "moderate"
        max_allocation = 50
        emoji = "⚖️"
        suggestion = f"{emoji} You prefer a balanced approach with moderate risk. Consider a mix of stable stocks with some growth potential."
    elif risk_score >= 2:
        profile = "conservative"
        max_allocation = 30
        emoji = "🛡️"
        suggestion = f"{emoji} You're more careful with investments. Focus on stable blue-chip stocks with good dividends and lower volatility."
    else:
        profile = "very_conservative"
        max_allocation = 20
        emoji = "🏦"
        suggestion = f"{emoji} Capital preservation seems important to you. Consider very stable stocks with dividends and lower volatility."
    
    return {
        "riskProfile": profile,
        "riskScore": risk_score,
        "maxRiskAllocation": max_allocation,
        "suggestion": suggestion
    }

def get_beginner_recommendations(risk_profile="moderate", budget=None):
    """
    Get stock recommendations for beginners based on their risk profile
    
    Args:
        risk_profile: 'very_conservative', 'conservative', 'moderate', 'growth', 'aggressive'
        budget: Optional budget amount to consider (in rupees)
        
    Returns:
        Dictionary with recommendations categorized by risk levels
    """
    # Map of profiles to risk allocation percentages (safe/moderate/growth)
    profile_allocations = {
        "very_conservative": [70, 30, 0],
        "conservative": [60, 30, 10],
        "moderate": [40, 40, 20],
        "growth": [20, 50, 30],
        "aggressive": [10, 40, 50]
    }
    
    # Get allocation for the given profile (default to moderate)
    allocation = profile_allocations.get(risk_profile, profile_allocations["moderate"])
    
    # Popular Indian stocks by category
    safe_stocks = ["HDFCBANK.NS", "HINDUNILVR.NS", "NESTLEIND.NS", "BAJAJ-AUTO.NS", "ITC.NS"]
    moderate_stocks = ["TCS.NS", "INFY.NS", "ICICIBANK.NS", "AXISBANK.NS", "RELIANCE.NS"]
    growth_stocks = ["TATAMOTORS.NS", "TATASTEEL.NS", "ADANIENT.NS", "BHARTIARTL.NS", "ZOMATO.NS"]
    
    # Get additional stock metrics for better recommendations
    # We'll fetch at least 3 from each category to have enough choices
    stocks_to_analyze = safe_stocks[:3] + moderate_stocks[:3] + growth_stocks[:3]
    analyzed_stocks = {}
    
    for ticker in stocks_to_analyze:
        try:
            data = get_stock_data(ticker, 2, with_metrics=True)
            if data and "error" not in data:
                analyzed_stocks[ticker] = data
        except Exception:
            continue
    
    # If we don't have enough stocks, use our default lists
    if len(analyzed_stocks) < 5:
        return {
            "success": True,
            "riskProfile": risk_profile,
            "allocation": {
                "safe": allocation[0],
                "moderate": allocation[1],
                "growth": allocation[2]
            },
            "recommendations": {
                "safe": [{"ticker": s, "message": "Stable blue-chip stock 🛡️"} for s in safe_stocks[:2]],
                "moderate": [{"ticker": s, "message": "Balanced risk-reward ⚖️"} for s in moderate_stocks[:2]],
                "growth": [{"ticker": s, "message": "Higher growth potential 🚀"} for s in growth_stocks[:2]]
            },
            "note": "These are starter recommendations based on your profile. As you learn more, you can diversify your portfolio! 📚"
        }
    
    # Sort stocks by different metrics
    safe_choices = sorted(analyzed_stocks.values(), key=lambda x: x["risk"]["fluctuation"])
    growth_choices = sorted(analyzed_stocks.values(), key=lambda x: x["returns"]["absolute"], reverse=True)
    
    # Create recommendations
    safe_recs = []
    moderate_recs = []
    growth_recs = []
    
    # Add safe recommendations
    for stock in safe_choices[:3]:
        if stock["risk"]["meter"] == "Safe" or stock["risk"]["meter"] == "Moderate Risk":
            message = f"Low volatility stock with {stock['stability']['stars']}⭐ stability"
            if stock["fundamentals"]["dividendYield"] not in ["N/A", 0]:
                message += f" and {stock['fundamentals']['dividendYield']}% dividend 💰"
            safe_recs.append({"ticker": stock["ticker"], "message": message})
            
    # Add growth recommendations
    for stock in growth_choices[:3]:
        if stock["returns"]["absolute"] > 20:
            message = f"Grew {stock['returns']['absolute']}% over 5 years 📈"
            growth_recs.append({"ticker": stock["ticker"], "message": message})
    
    # Add moderate recommendations (mix of safe and growth)
    moderate_candidates = [s for s in analyzed_stocks.values() 
                          if s["ticker"] not in [x["ticker"] for x in safe_recs] 
                          and s["ticker"] not in [x["ticker"] for x in growth_recs]]
    
    for stock in moderate_candidates[:3]:
        message = f"Balanced stock with {stock['stability']['stars']}⭐ reliability"
        moderate_recs.append({"ticker": stock["ticker"], "message": message})
    
    # Ensure we have at least some recs in each category
    if not safe_recs:
        safe_recs = [{"ticker": s, "message": "Traditionally stable stock 🛡️"} for s in safe_stocks[:2]]
    if not moderate_recs:
        moderate_recs = [{"ticker": s, "message": "Balanced risk-reward ⚖️"} for s in moderate_stocks[:2]]
    if not growth_recs:
        growth_recs = [{"ticker": s, "message": "Higher growth potential 🚀"} for s in growth_stocks[:2]]
    
    # Calculate budget allocation if provided
    budget_allocation = None
    if budget:
        try:
            budget = float(budget)
            budget_allocation = {
                "safe": round((budget * allocation[0]) / 100),
                "moderate": round((budget * allocation[1]) / 100),
                "growth": round((budget * allocation[2]) / 100)
            }
        except:
            pass
    
    return {
        "success": True,
        "riskProfile": risk_profile,
        "allocation": {
            "safe": allocation[0],
            "moderate": allocation[1],
            "growth": allocation[2]
        },
        "budgetAllocation": budget_allocation,
        "recommendations": {
            "safe": safe_recs[:2],
            "moderate": moderate_recs[:2],
            "growth": growth_recs[:2]
        },
        "note": "These stocks match your risk profile. Start with what feels comfortable and gradually expand your portfolio! 🌱"
    }

def get_learning_resources():
    """Provide beginner-friendly learning resources"""
    return {
        "success": True,
        "basics": [
            {
                "title": "What is a stock? 🧩",
                "description": "A stock represents ownership in a company. When you buy shares, you own a tiny piece of that business!"
            },
            {
                "title": "What is NSE? 🏢",
                "description": "NSE (National Stock Exchange) is India's largest stock exchange where most Indian companies are listed."
            },
            {
                "title": "What is a Demat account? 💼",
                "description": "A Demat account holds your stocks electronically, like a digital locker for your investments."
            }
        ],
        "tips": [
            {
                "title": "Start small 🐣",
                "description": "Begin with a small amount you're comfortable risking - even ₹5,000 is enough to start!"
            },
            {
                "title": "Think long-term 📆",
                "description": "The stock market rewards patience. Think in years, not days or weeks."
            },
            {
                "title": "Diversify 🧺",
                "description": "Don't put all your money in one stock! Spread it across different companies and sectors."
            }
        ],
        "commonTerms": [
            {
                "term": "Dividend 💰",
                "meaning": "Money paid by companies to shareholders from their profits"
            },
            {
                "term": "P/E Ratio 🔢",
                "meaning": "Price-to-Earnings ratio - helps determine if a stock is expensive or cheap"
            },
            {
                "term": "Market Cap 📏",
                "meaning": "Total value of a company (share price × number of shares)"
            }
        ]
    }


#update

# Add this to your beginner_service.py file

def get_market_overview():
    """
    Provides a simple market overview for beginners with key indices and trending sectors
    
    Returns:
        Dictionary with market summary and trending sectors
    """
    try:
        # Get major Indian indices
        indices = {
            "NIFTY 50": {"ticker": "^NSEI", "nickname": "Main Indian Index"},
            "SENSEX": {"ticker": "^BSESN", "nickname": "Bombay Stock Exchange Index"},
            "NIFTY BANK": {"ticker": "NIFTY_BANK.NS", "nickname": "Banking Sector Index"}
        }
        
        # Fetch latest data for each index
        market_summary = []
        for name, data in indices.items():
            try:
                index_data = yf.Ticker(data["ticker"]).history(period="5d")
                if not index_data.empty:
                    latest = index_data.iloc[-1]
                    previous = index_data.iloc[-2]
                    change_pct = ((latest['Close'] - previous['Close']) / previous['Close']) * 100
                    
                    # Determine emoji based on performance
                    emoji = "🟢" if change_pct > 0 else "🔴"
                    
                    market_summary.append({
                        "name": name,
                        "description": data["nickname"],
                        "value": round(latest['Close'], 2),
                        "change": round(change_pct, 2),
                        "emoji": emoji
                    })
            except Exception as e:
                print(f"Error fetching index {name}: {str(e)}")
        
        # Create a list of trending sectors with simple explanations
        # This would ideally come from actual sector performance data
        # For now, we'll use a few key sectors with simplified explanations
        trending_sectors = [
            {
                "name": "IT/Technology",
                "description": "Companies that make software or provide tech services",
                "beginner_friendliness": 4,
                "example_stocks": ["TCS.NS", "INFY.NS", "WIPRO.NS"],
                "emoji": "💻"
            },
            {
                "name": "Banking & Finance",
                "description": "Banks and financial service companies",
                "beginner_friendliness": 3,
                "example_stocks": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS"],
                "emoji": "🏦"
            },
            {
                "name": "Consumer Goods",
                "description": "Companies that make everyday products",
                "beginner_friendliness": 5,
                "example_stocks": ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS"],
                "emoji": "🛒"
            },
            {
                "name": "Pharma & Healthcare",
                "description": "Medicine and healthcare companies",
                "beginner_friendliness": 3,
                "example_stocks": ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS"],
                "emoji": "💊"
            }
        ]
        
        # Add helpful messages about market conditions for beginners
        if len(market_summary) > 0:
            avg_change = sum(item["change"] for item in market_summary) / len(market_summary)
            if avg_change > 1:
                market_mood = "The market seems to be in a positive mood today! 🎉"
            elif avg_change > 0:
                market_mood = "The market is slightly up today. Steady as she goes! ⛵"
            elif avg_change > -1:
                market_mood = "The market is slightly down today. No need to worry - normal fluctuations! 🧘‍♀️"
            else:
                market_mood = "The market is down today. Remember, for beginners, these dips can be normal! 📉➡️📈"
        else:
            market_mood = "Market data currently unavailable. Check back soon! ⏳"
        
        return {
            "success": True,
            "marketSummary": market_summary,
            "trendingSectors": trending_sectors,
            "marketMood": market_mood,
            "beginnerTip": "Don't worry too much about daily market movements. Focus on learning and long-term growth! 🌱"
        }
    except Exception as e:
        print(f"Error in market overview: {str(e)}")
        return {
            "success": False,
            "error": "Unable to fetch market overview"
        }

def get_investment_calculator(amount, monthly_addition=0, years=5, expected_return=12):
    """
    Calculate potential investment growth for beginners
    
    Args:
        amount: Initial investment amount
        monthly_addition: Monthly contribution amount
        years: Investment time horizon in years
        expected_return: Expected annual return percentage
        
    Returns:
        Dictionary with investment growth projections
    """
    try:
        # Convert to float/int
        amount = float(amount)
        monthly_addition = float(monthly_addition)
        years = int(years)
        expected_return = float(expected_return)
        
        # Ensure reasonable values
        if amount < 0 or monthly_addition < 0 or years < 1 or years > 40 or expected_return < 0 or expected_return > 30:
            return {
                "success": False,
                "error": "Please enter reasonable values for your calculation."
            }
        
        # Calculate monthly rate
        monthly_rate = expected_return / 100 / 12
        
        # Calculate growth month by month
        months = years * 12
        investment_journey = []
        current_amount = amount
        total_invested = amount
        
        for month in range(1, months + 1):
            # Add monthly contribution
            current_amount += monthly_addition
            if monthly_addition > 0:
                total_invested += monthly_addition
            
            # Add monthly growth
            growth = current_amount * monthly_rate
            current_amount += growth
            
            # Add key points to the journey (beginning, end, and yearly points)
            if month == 1 or month == months or month % 12 == 0:
                investment_journey.append({
                    "month": month,
                    "year": month / 12,
                    "value": round(current_amount, 2),
                    "totalInvested": round(total_invested, 2),
                    "growth": round(current_amount - total_invested, 2)
                })
        
        # Calculate final results
        final_value = current_amount
        total_growth = final_value - total_invested
        growth_percentage = (total_growth / total_invested) * 100
        
        # Create friendly explanation
        if monthly_addition > 0:
            explanation = f"Starting with ₹{amount:,.2f} and adding ₹{monthly_addition:,.2f} monthly for {years} years could grow to approximately ₹{final_value:,.2f}! 🌱💰"
        else:
            explanation = f"Your ₹{amount:,.2f} investment could grow to approximately ₹{final_value:,.2f} after {years} years! 🌱💰"
        
        return {
            "success": True,
            "initialInvestment": amount,
            "monthlyContribution": monthly_addition,
            "years": years,
            "expectedReturn": expected_return,
            "finalValue": round(final_value, 2),
            "totalInvested": round(total_invested, 2),
            "totalGrowth": round(total_growth, 2),
            "growthPercentage": round(growth_percentage, 2),
            "journey": investment_journey,
            "friendlyExplanation": explanation,
            "note": "Remember, this is just an estimate. Actual returns may vary! Past performance doesn't guarantee future results. 📊"
        }
    except Exception as e:
        print(f"Error in investment calculator: {str(e)}")
        return {
            "success": False,
            "error": "Calculation failed. Please check your inputs."
        }

def get_beginner_glossary():
    """
    Provides a beginner-friendly glossary of common stock market terms
    
    Returns:
        Dictionary with categorized terms and simple explanations
    """
    return {
        "success": True,
        "categories": [
            {
                "name": "Stock Basics",
                "emoji": "🧩",
                "terms": [
                    {
                        "term": "Stock",
                        "definition": "A tiny piece of ownership in a company. When you buy stocks, you become a part-owner!",
                        "example": "If you buy 10 Reliance stocks, you own a very small part of Reliance Industries."
                    },
                    {
                        "term": "Share",
                        "definition": "Another word for stock - one unit of ownership in a company.",
                        "example": "\"I bought 5 shares of TCS yesterday.\""
                    },
                    {
                        "term": "Dividend",
                        "definition": "Money paid by a company to its shareholders, usually from profits.",
                        "example": "ITC pays around 5% dividend yearly, meaning you get ₹5 for every ₹100 invested."
                    },
                    {
                        "term": "IPO",
                        "definition": "Initial Public Offering - when a company first sells its shares to the public.",
                        "example": "Zomato's IPO in 2021 was very popular and many new investors participated."
                    }
                ]
            },
            {
                "name": "Market Concepts",
                "emoji": "📈",
                "terms": [
                    {
                        "term": "Bull Market",
                        "definition": "When stock prices are rising and people are optimistic about the market.",
                        "example": "During a bull market, most stocks tend to go up in value."
                    },
                    {
                        "term": "Bear Market",
                        "definition": "When stock prices are falling and people are pessimistic.",
                        "example": "During COVID-19, there was a brief bear market when prices fell sharply."
                    },
                    {
                        "term": "Market Cap",
                        "definition": "The total value of a company (stock price × total number of shares).",
                        "example": "Reliance Industries has one of the largest market caps in India."
                    },
                    {
                        "term": "Index",
                        "definition": "A group of stocks that represents a section of the stock market.",
                        "example": "Nifty 50 is an index of 50 major Indian companies."
                    }
                ]
            },
            {
                "name": "Trading Terms",
                "emoji": "💼",
                "terms": [
                    {
                        "term": "Limit Order",
                        "definition": "An order to buy/sell a stock at a specific price or better.",
                        "example": "Setting a limit buy order for TCS at ₹3,000 means you'll only buy if the price is ₹3,000 or lower."
                    },
                    {
                        "term": "Market Order",
                        "definition": "An order to buy/sell a stock immediately at the current market price.",
                        "example": "If TCS is trading at ₹3,100 and you place a market buy order, you'll buy at approximately ₹3,100."
                    },
                    {
                        "term": "Demat Account",
                        "definition": "An account that holds your stocks electronically (like a digital locker).",
                        "example": "You need a demat account with brokers like Zerodha or Groww to buy stocks in India."
                    },
                    {
                        "term": "Brokerage",
                        "definition": "Fee charged by your broker for buying or selling stocks.",
                        "example": "Discount brokers like Zerodha charge very low brokerage fees compared to traditional brokers."
                    }
                ]
            },
            {
                "name": "Analysis Terms",
                "emoji": "🔍",
                "terms": [
                    {
                        "term": "P/E Ratio",
                        "definition": "Price-to-Earnings ratio - shows if a stock is expensive or cheap compared to its earnings.",
                        "example": "A P/E of 20 means investors are willing to pay ₹20 for every ₹1 of company earnings."
                    },
                    {
                        "term": "EPS",
                        "definition": "Earnings Per Share - a company's profit divided by its number of shares.",
                        "example": "If a company earns ₹100 crore and has 10 crore shares, its EPS is ₹10."
                    },
                    {
                        "term": "Dividend Yield",
                        "definition": "Annual dividend divided by share price, shown as a percentage.",
                        "example": "If a ₹100 stock pays ₹5 as annual dividend, the dividend yield is 5%."
                    },
                    {
                        "term": "Volume",
                        "definition": "The number of shares bought and sold during a specific time period.",
                        "example": "High trading volume often indicates strong interest in a stock."
                    }
                ]
            }
        ],
        "note": "Don't worry about memorizing all these terms! Just refer back to this glossary whenever you need a reminder. 📚"
    }