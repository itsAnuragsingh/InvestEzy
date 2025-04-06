from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from datetime import datetime

from services.stock_data import get_stock_data
from models.recommendation import get_recommendations
from services.demo_data import get_demo_portfolio
from services.prediction import predict_stock
from services.beginner_service import (
    assess_risk_profile, 
    get_beginner_recommendations, 
    get_learning_resources,
    get_market_overview,
    get_investment_calculator,
    get_beginner_glossary
)
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

@app.route('/api/portfolio/<email>', methods=['GET'])
def get_portfolio(email):
    """Get demo portfolio for a user by email"""
    portfolio = get_demo_portfolio(email)
    return jsonify(portfolio)

@app.route('/api/recommend/<email>', methods=['GET'])
def recommend(email):
    """Get stock recommendations based on user portfolio"""
    try:
        portfolio = get_demo_portfolio(email)
        
        # Flatten portfolio data from all platforms
        all_stocks = []
        for platform, stocks in portfolio.items():
            all_stocks.extend([s.strip() for s in stocks if s and s.strip()])
        
        if not all_stocks:
            return jsonify({"error": "No stocks found in portfolio 😕", "success": False}), 404
            
        # Get recommendations
        recommendations = get_recommendations(all_stocks)
        return jsonify(recommendations)
        
    except Exception as e:
        print(f"Error in recommend endpoint: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}", "success": False}), 500

@app.route('/api/stock/<ticker>', methods=['GET'])
def stock_info(ticker):
    """Get detailed information for a single stock"""
    years = request.args.get('years', default=5, type=int)
    data = get_stock_data(ticker, years, with_metrics=True)
    
    if data and "error" not in data:
        # Add friendly message
        friendly_message = generate_friendly_message(data)
        data["friendlyMessage"] = friendly_message
        
    return jsonify(data)

@app.route('/api/compare', methods=['GET'])
def compare_stocks():
    """Compare multiple stocks with simple explanations"""
    tickers = request.args.get('tickers', '')
    if not tickers:
        return jsonify({"error": "No tickers provided 😕", "success": False})
    
    ticker_list = [t.strip() for t in tickers.split(',')]
    years = request.args.get('years', default=5, type=int)
    
    results = []
    for ticker in ticker_list:
        data = get_stock_data(ticker, years, with_metrics=True)
        if data and "error" not in data:
            results.append(data)
    
    # Add comparison insights
    comparison = {}
    if len(results) >= 2:
        comparison = generate_comparison_insights(results)
    
    return jsonify({
        "stocks": results,
        "count": len(results),
        "comparison": comparison,
        "success": True
    })

@app.route('/api/predict/<ticker>', methods=['GET'])
def predict_price(ticker):
    """Predict future prices for a stock"""
    days = request.args.get('days', default=30, type=int)
    try:
        prediction = predict_stock(ticker, days)
        return jsonify(prediction)
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Prediction failed: {str(e)}",
            "success": False
        }), 500

# NEW ENDPOINTS FOR BEGINNERS
# Add these routes to your app.py file

@app.route('/api/beginner/market-overview', methods=['GET'])
def market_overview():
    """Get simple market overview for beginners"""
    try:
        overview = get_market_overview()
        return jsonify(overview)
    except Exception as e:
        print(f"Error in market overview: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Failed to get market overview: {str(e)}",
            "success": False
        }), 500

@app.route('/api/beginner/calculator', methods=['GET'])
def investment_calculator():
    """Calculate potential investment growth"""
    try:
        amount = request.args.get('amount', 10000, type=float)
        monthly = request.args.get('monthly', 0, type=float)
        years = request.args.get('years', 5, type=int)
        return_rate = request.args.get('return', 12, type=float)
        
        results = get_investment_calculator(amount, monthly, years, return_rate)
        return jsonify(results)
    except Exception as e:
        print(f"Error in investment calculator: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Calculation failed: {str(e)}",
            "success": False
        }), 500

@app.route('/api/beginner/glossary', methods=['GET'])
def beginner_glossary():
    """Get glossary of stock market terms for beginners"""
    try:
        glossary = get_beginner_glossary()
        return jsonify(glossary)
    except Exception as e:
        print(f"Error in glossary: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Failed to get glossary: {str(e)}",
            "success": False
        }), 500

@app.route('/api/beginner/assess', methods=['POST'])
def assess_beginner():
    """Assess a beginner's risk profile based on questionnaire"""
    try:
        data = request.json or {}
        profile = assess_risk_profile(data)
        return jsonify({
            "success": True,
            "profile": profile
        })
    except Exception as e:
        print(f"Error in beginner assessment: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Assessment failed: {str(e)}",
            "success": False
        }), 500

@app.route('/api/beginner/recommend', methods=['GET'])
def beginner_recommend():
    """Get beginner-friendly stock recommendations"""
    try:
        risk_profile = request.args.get('profile', 'moderate')
        budget = request.args.get('budget')
        
        recommendations = get_beginner_recommendations(risk_profile, budget)
        return jsonify(recommendations)
    except Exception as e:
        print(f"Error in beginner recommendations: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Recommendation failed: {str(e)}",
            "success": False
        }), 500

@app.route('/api/beginner/learn', methods=['GET'])
def beginner_learn():
    """Get learning resources for beginners"""
    try:
        resources = get_learning_resources()
        return jsonify(resources)
    except Exception as e:
        print(f"Error in learning resources: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Failed to get resources: {str(e)}",
            "success": False
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

def generate_friendly_message(stock_data):
    """Generate a friendly message about the stock performance"""
    try:
        name = stock_data["companyName"]
        returns = stock_data["returns"]["absolute"]
        risk = stock_data["risk"]["meter"]
        stars = stock_data["stability"]["stars"]
        
        # Emoji based on returns
        emoji = "🚀" if returns > 50 else "📈" if returns > 0 else "📉"
        
        # Star emoji based on reliability
        star_emojis = "⭐" * stars
        
        # Risk emoji
        risk_emoji = "🟢" if risk == "Safe" else "🟡" if risk == "Moderate Risk" else "🔴"
        
        message = f"{emoji} {name} has {returns}% returns over 5 years. {risk_emoji} Risk level: {risk}. Reliability: {star_emojis}"
        return message
    except:
        return "Check out the detailed metrics for this stock! 📊"

def generate_comparison_insights(stocks):
    """Generate simple comparison insights between stocks"""
    try:
        # Sort stocks by returns
        sorted_by_returns = sorted(stocks, key=lambda x: x["returns"]["absolute"], reverse=True)
        best_stock = sorted_by_returns[0]["companyName"]
        best_return = sorted_by_returns[0]["returns"]["absolute"]
        
        # Sort by risk (lower is better)
        sorted_by_risk = sorted(stocks, key=lambda x: x["risk"]["fluctuation"])
        safest_stock = sorted_by_risk[0]["companyName"]
        safest_risk = sorted_by_risk[0]["risk"]["meter"]
        
        insights = {
            "bestPerformer": f"🏆 {best_stock} had the best returns at {best_return}%",
            "safestOption": f"🛡 {safest_stock} is the safest option with {safest_risk} risk",
            "summary": f"If you want growth, consider {best_stock}. If you prefer safety, look at {safest_stock}."
        }
        return insights
    except:
        return {"summary": "Compare the metrics to see which stock suits your investment style! 📊"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)