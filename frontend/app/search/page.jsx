"use client";
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StockSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');
  const [popularStocks, setPopularStocks] = useState([
    { name: 'Reliance', ticker: 'RELIANCE' },
    { name: 'TCS', ticker: 'TCS' },
    { name: 'HDFC Bank', ticker: 'HDFCBANK' },
    { name: 'Infosys', ticker: 'INFY' },
    { name: 'ITC', ticker: 'ITC' }
  ]);


  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/stock/${searchTerm.trim()}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setStockData(null);
      } else {
        setStockData(data);
      }
    } catch (err) {
      setError('Sorry, we had trouble finding that stock. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRiskEmoji = (riskMeter) => {
    if (!riskMeter) return '⚪';
    if (riskMeter === 'Safe') return '🟢';
    if (riskMeter === 'Moderate Risk') return '🟡';
    return '🔴';
  };

  const getRecommendation = (data) => {
    if (!data) return '';
    
    const { returns, risk, stability } = data;
    
    if (returns.absolute > 40 && stability.stars >= 4 && risk.meter === 'Safe') {
      return "✅ Great for beginners! This stock has shown strong returns with low risk.";
    } else if (returns.absolute > 20 && stability.stars >= 3 && risk.meter !== 'High Risk') {
      return "👍 Good option for beginners with decent returns and manageable risk.";
    } else if (returns.absolute > 0 && stability.stars >= 2) {
      return "⚖️ Consider this stock, but don't invest too much as a beginner.";
    } else if (risk.meter === 'High Risk') {
      return "⚠️ Too risky for beginners. Look for safer options when starting out.";
    } else {
      return "🤔 This stock requires more research. Maybe consult with an advisor.";
    }
  };

  const getInvestmentExplanation = (data) => {
    if (!data) return '';
    
    const { returns, risk, stability } = data;
    
    if (returns.absolute <= 0) {
      return "This stock hasn't grown over the last few years. Not a good sign for beginners.";
    } else if (risk.meter === 'High Risk') {
      return "While this might give high returns, it's very unpredictable - not ideal when you're starting out.";
    } else if (stability.stars <= 2) {
      return "This stock isn't very stable, which means it could be hard to predict how it'll perform.";
    } else if (stability.stars >= 4 && risk.meter === 'Safe') {
      return "This stock has shown steady growth with low ups and downs - perfect for beginners!";
    } else {
      return "This stock has a balanced mix of growth and stability - a reasonable choice for new investors.";
    }
  };

  // Prepare chart data
  const prepareChartData = (data) => {
    if (!data || !data.chartData || !data.chartData.dates || !data.chartData.prices) {
      return [];
    }

    return data.chartData.dates.map((date, index) => ({
      date: date.split('-')[2] + '/' + date.split('-')[1], // Format as DD/MM for cleaner display
      price: data.chartData.prices[index]
    }));
  };

  // Determine chart color based on performance
  const getChartColor = (data) => {
    if (!data) return "#8884d8"; // Default purple
    
    // If last 30 days trend is positive (last price > first price)
    if (data.chartData.prices[data.chartData.prices.length - 1] > data.chartData.prices[0]) {
      return "#4caf50"; // Green for positive trend
    } else {
      return "#f44336"; // Red for negative trend
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">🔍 Smart Stock Search</h1>
      
      {/* Search Bar */}
      <div className="flex items-center border-2 rounded-lg p-2 mb-8 shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a stock (e.g., RELIANCE)"
          className="flex-grow outline-none text-lg p-2"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-lg flex items-center"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : (
            <>
              <Search className="mr-2" size={20} />
              Search
            </>
          )}
        </button>
      </div>
      
      {/* Popular Stocks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">🌟 Popular Stocks</h2>
        <div className="flex flex-wrap gap-3">
          {popularStocks.map((stock) => (
            <button
              key={stock.ticker}
              onClick={() => {
                setSearchTerm(stock.ticker);
                setTimeout(() => handleSearch(), 100); // Auto-search after setting
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
            >
              {stock.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Stock Results */}
      {stockData && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
          <h2 className="text-2xl font-bold mb-4">
            {stockData.companyName} ({stockData.ticker.replace('.NS', '')})
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Price and Returns */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">📈 Price & Returns</h3>
              <p className="text-2xl font-bold mb-2">₹{stockData.latestPrice}</p>
              
              <div className="flex items-center mb-1">
                <span className="mr-2">Growth (5 Years):</span>
                <span className={`font-bold ${stockData.returns.absolute > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stockData.returns.absolute > 0 ? '↗️' : '↘️'} {stockData.returns.absolute}%
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                ₹10,000 invested 5 years ago would be ₹{stockData.returns.projection} today
              </div>
            </div>
            
            {/* Risk Assessment */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">🛡️ Risk & Stability</h3>
              
              <div className="flex items-center mb-2">
                <span className="mr-2">Risk Level:</span>
                <span className="font-bold">
                  {getRiskEmoji(stockData.risk.meter)} {stockData.risk.meter}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2">Reliability Rating:</span>
                <span className="font-bold">
                  {'⭐'.repeat(stockData.stability.stars)}
                  {'☆'.repeat(5 - stockData.stability.stars)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stock Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2">📊 Recent Performance (30 Days)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareChartData(stockData)}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickCount={5} 
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={getChartColor(stockData)} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-center text-gray-600">
              <span className="inline-block mx-2">⚪ Start: ₹{stockData.chartData.prices[0]?.toFixed(2)}</span>
              <span className="inline-block mx-2">⚫ End: ₹{stockData.chartData.prices[stockData.chartData.prices.length - 1]?.toFixed(2)}</span>
              {stockData.chartData.prices[stockData.chartData.prices.length - 1] > stockData.chartData.prices[0] ? (
                <span className="text-green-600">📈 Up in last 30 days</span>
              ) : (
                <span className="text-red-600">📉 Down in last 30 days</span>
              )}
            </div>
          </div>
          
          {/* Beginner Recommendation */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
            <h3 className="text-lg font-semibold mb-2">🔰 Beginner's Recommendation</h3>
            <p className="text-lg mb-2">{getRecommendation(stockData)}</p>
            <p>{getInvestmentExplanation(stockData)}</p>
          </div>
          
          {/* Learning Tips */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Info size={20} className="mr-2" />
              Tips for Understanding This Stock
            </h3>
            <ul className="space-y-2">
              <li>
                <strong>P/E Ratio:</strong> {stockData.fundamentals.peRatio} 
                {stockData.fundamentals.peRatio !== 'N/A' && stockData.fundamentals.peRatio < 25 ? 
                  " (👍 Generally considered reasonable)" : 
                  stockData.fundamentals.peRatio !== 'N/A' ? " (⚠️ On the higher side)" : ""}
              </li>
              <li>
                <strong>Dividend Yield:</strong> {stockData.fundamentals.dividendYield !== 'N/A' ? 
                  `${stockData.fundamentals.dividendYield}% ${stockData.fundamentals.dividendYield > 2 ? "🎁 (Good passive income)" : ""}` : 
                  "N/A"}
              </li>
              <li>
                <strong>Market Cap:</strong> {stockData.fundamentals.marketCap !== 'N/A' ? 
                  `₹${stockData.fundamentals.marketCap} Cr` : 
                  "N/A"}
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Beginner Tips */}
      {!stockData && !isLoading && !error && (
        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-100 mt-8">
          <h2 className="text-xl font-semibold mb-3">💡 Tips for Beginners</h2>
          <ul className="space-y-3">
            <li>✅ Look for stocks with at least 3-4 stars for reliability</li>
            <li>✅ Start with stocks marked as "Safe" (green) for lower risk</li>
            <li>✅ Consider companies you know and use in your daily life</li>
            <li>✅ Diversify by investing in different types of companies</li>
            <li>⚠️ Avoid stocks with high risk (red) when starting out</li>
          </ul>
        </div>
      )}
      <div className='w-full flex justify-center mt-6'>

      <Link href='/'>
      <Button>Home</Button>
      </Link>
      </div>
    </div>
  );
}