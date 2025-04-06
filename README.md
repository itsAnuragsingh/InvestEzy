# InvestEzy

A smart investment portfolio manager focused on making stock investing accessible to beginners in the Indian market.


## Overview

InvestEzy is a comprehensive platform designed to simplify stock investing for beginners in the Indian market. The application provides personalized stock recommendations, predictive analytics using LSTM neural networks, risk assessment, and educational resources to help users make informed investment decisions.
Live Demo(For demo login, use this email :- user2@example.com) :- https://investezy.vercel.app/

## Features

### User Experience
- **Seamless Onboarding**
  - New user registration with personalized profile setup
  - Quick sign-in for existing users via email
  - Guided tour for first-time users

### Stock Recommendations
- Personalized recommendations based on user portfolio
- Correlation-based analysis to suggest similar stocks
- Diversification suggestions for better portfolio balance
- Beginner-friendly explanations for each recommendation

### AI-Powered Stock Prediction
- Price predictions using LSTM neural networks
- 30-day price forecasts with growth trends
- Visual representation of predicted price movements
- Fallback to moving average trends when needed

### Beginner Support
- Risk profile assessment for new investors
- Market overviews in simple language
- Investment calculator to visualize potential growth
- Comprehensive glossary of financial terms
- Curated learning resources for beginners

### Portfolio Management
- Multi-platform portfolio tracking
- Performance comparison between stocks
- Detailed metrics with beginner-friendly explanations
- Visual risk and stability indicators
- Data visualization for all stocks

### Interactive Tools
- Stock comparison tool with visual analytics
- Investment calculator with projections
- Custom watchlists for tracking potential investments

## Tech Stack

### Frontend
- **Next.js**: React framework for building the user interface
- **Tailwind CSS**: For responsive design
- **Recharts**: For data visualization

### Backend
- **Flask**: API framework
- **TensorFlow**: LSTM model for stock predictions
- **NumPy/Pandas**: Data processing and analysis
- **yfinance**: Yahoo Finance API integration for stock data

### Machine Learning
- LSTM (Long Short-Term Memory) neural network model for price prediction
- Correlation-based recommendation system
- Moving average trend analysis as fallback prediction method

## API Endpoints

### Authentication & User Management
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login existing user
- `GET /api/user/<email>`: Get user profile

### Portfolio and Recommendations
- `GET /api/portfolio/<email>`: Get portfolio for a user
- `POST /api/portfolio/update`: Update user portfolio
- `GET /api/recommend/<email>`: Get stock recommendations based on user portfolio

### Stock Information
- `GET /api/stock/<ticker>`: Get detailed information for a single stock
- `GET /api/compare?tickers=<tickers>`: Compare multiple stocks with explanations
- `GET /api/predict/<ticker>`: Predict future prices for a stock

### Beginner Features
- `GET /api/beginner/market-overview`: Get simple market overview for beginners
- `GET /api/beginner/calculator`: Calculate potential investment growth
- `GET /api/beginner/glossary`: Get glossary of stock market terms
- `POST /api/beginner/assess`: Assess a beginner's risk profile
- `GET /api/beginner/recommend`: Get beginner-friendly stock recommendations
- `GET /api/beginner/learn`: Get learning resources for beginners

### System
- `GET /api/health`: API health check endpoint

## ML Models

### LSTM Prediction Model
The system uses a trained LSTM neural network model to predict stock prices:
- Trained on historical data from major Indian stocks (Nifty 50)
- 60-day lookback period for predictions
- Features engineering for improved accuracy
- Fallback to moving average when neural network predictions are unavailable

### Recommendation System
- Portfolio correlation analysis
- Sector-based diversification
- Risk and stability-based recommendations
- Beginner-friendly explanations with emoji indicators

## Screenshots
![WhatsApp Image 2025-04-06 at 11 45 53_7fb3d4c9](https://github.com/user-attachments/assets/e55dad49-3b36-4f7c-8a80-19b7f87066b4)
![WhatsApp Image 2025-04-06 at 11 45 55_1f714e21](https://github.com/user-attachments/assets/8117b437-765d-4c88-a62a-2c4b7bccd6a6)
![WhatsApp Image 2025-04-06 at 11 45 54_c1ddb9cb](https://github.com/user-attachments/assets/3063464b-ca88-4ac4-8b66-2d3d73e4a98f) 
![WhatsApp Image 2025-04-06 at 11 45 53_1dca08bb](https://github.com/user-attachments/assets/92ac93b5-7e0b-49dc-b2d0-80dcac94319f)


## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/investezy.git
cd investezy
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Train the LSTM model (optional):
```bash
python lstm_model.py
```

4. Run the Flask server:
```bash
python app.py
```

5. Install frontend dependencies:
```bash
cd frontend
npm install
```

6. Run the Next.js development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

- The LSTM model path is configured in `prediction.py`
- Default model parameters are set in `lstm_model.py`
- Stock data services can be configured in the services directory
- Environment variables can be set in `.env` file (create from `.env.example`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE) 
