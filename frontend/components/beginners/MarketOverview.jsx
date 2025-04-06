// components/beginners/MarketOverview.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketOverview = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/beginner/market-overview');
        const data = await response.json();
        
        if (data.success) {
          setMarketData(data);
        } else {
          setError(data.error || 'Failed to load market overview');
        }
      } catch (err) {
        setError('Could not connect to server. Please try again later.');
        console.error('Market overview fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketOverview();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>{error}</p>
            <p className="mt-2">Please check back later or refresh the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📊</span> Today's Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Market mood */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-lg">{marketData?.marketMood}</p>
            <p className="text-sm text-blue-600 mt-2">{marketData?.beginnerTip}</p>
          </div>

          {/* Market summary */}
          <div>
            <h3 className="font-medium text-lg mb-3">Major Indices</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketData?.marketSummary?.map((index, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className={`p-4 ${parseFloat(index.change) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{index.name}</h4>
                      <span className="text-xl">{index.emoji}</span>
                    </div>
                    <p className="text-sm text-gray-500">{index.description}</p>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-xl font-bold">{index.value.toLocaleString()}</span>
                      <span className={`${parseFloat(index.change) >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        {index.change > 0 ? '+' : ''}{index.change}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending sectors */}
          <div>
            <h3 className="font-medium text-lg mb-3">Beginner-Friendly Sectors</h3>
            <div className="space-y-3">
              {marketData?.trendingSectors?.map((sector, i) => (
                <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium flex items-center gap-2">
                      <span>{sector.emoji}</span>
                      <span>{sector.name}</span>
                    </h4>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Beginner Score: {sector.beginner_friendliness}/5
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{sector.description}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Example stocks:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sector.example_stocks.map((stock, j) => (
                        <span key={j} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                          {stock.replace('.NS', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;