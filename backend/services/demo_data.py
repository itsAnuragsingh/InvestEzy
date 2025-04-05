# Demo portfolios for the hackathon
demo_portfolios = {
    "user1@example.com": {
        "zerodha": ["TCS.NS", "INFY.NS", "HDFCBANK.NS"],
        "angel_one": ["RELIANCE.NS", "ICICIBANK.NS"],
        "mf_central": ["KOTAKBANK.NS", "SBIN.NS"]  # Replaced mutual funds with stocks for simplicity
    },
    "user2@example.com": {
        "zerodha": ["WIPRO.NS", "HDFCBANK.NS"],
        "angel_one": ["TATAMOTORS.NS"],
        "mf_central": ["AXISBANK.NS", "BHARTIARTL.NS"] 
    },
    "demo@stockai.com": {
        "zerodha": ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS"],
        "angel_one": ["ICICIBANK.NS", "SBIN.NS", "WIPRO.NS"],
        "mf_central": ["BHARTIARTL.NS", "ADANIENT.NS", "LT.NS"]
    },
    "test@example.com": {
        "zerodha": ["HINDUNILVR.NS", "ITC.NS"],
        "angel_one": ["BAJFINANCE.NS", "MARUTI.NS"],
        "mf_central": ["ASIANPAINT.NS"]
    }
}

def get_demo_portfolio(email):
    """Get a user's portfolio or return empty portfolio if user not found"""
    return demo_portfolios.get(email, {"zerodha": [], "angel_one": [], "mf_central": []})