// components/beginners/StockRecommendations.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StockRecommendations = ({ riskProfile }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budget, setBudget] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [riskProfile]);

  const fetchRecommendations = async (budgetAmount = null) => {
    setLoading(true);
    setError(null);

    try {
      let url = `http://localhost:5000/api/beginner/recommend?profile=${riskProfile}`;
      if (budgetAmount) {
        url += `&budget=${budgetAmount}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRecommendations(data);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    if (budget && !isNaN(budget) && parseFloat(budget) > 0) {
      fetchRecommendations(budget);
      setShowBudgetForm(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  const formatRiskProfile = (profile) => {
    return profile
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finding Your Stock Matches...</CardTitle>
          <CardDescription>We're looking for stocks that match your investment style</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
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
          <CardTitle>Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button onClick={() => fetchRecommendations()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading recommendations...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={() => fetchRecommendations()}>Refresh</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allocationData = [
    { name: 'Safe Stocks', value: recommendations.allocation.safe },
    { name: 'Moderate Risk', value: recommendations.allocation.moderate },
    { name: 'Growth Stocks', value: recommendations.allocation.growth }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">💡</span> Your Personalized Stock Ideas
        </CardTitle>
        <CardDescription>
          Based on your {formatRiskProfile(recommendations.riskProfile)} investor profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Allocation chart */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-medium mb-2">Your Recommended Mix 📊</h3>
              <p className="text-gray-600 mb-4">
                Here's how you might divide your investment based on your profile:
              </p>
              {recommendations.budgetAllocation ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Safe Stocks (🛡️)</span>
                    <span>₹{recommendations.budgetAllocation.safe.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Moderate Risk (⚖️)</span>
                    <span>₹{recommendations.budgetAllocation.moderate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Growth Stocks (📈)</span>
                    <span>₹{recommendations.budgetAllocation.growth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">₹{budget.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>{recommendations.allocation.safe}% Safe Stocks (🛡️)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>{recommendations.allocation.moderate}% Moderate Risk (⚖️)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span>{recommendations.allocation.growth}% Growth Stocks (📈)</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Budget input option */}
          {!recommendations.budgetAllocation && (
            <div className="flex justify-center mt-2 mb-4">
              {showBudgetForm ? (
                <form onSubmit={handleBudgetSubmit} className="flex items-end gap-4 w-full max-w-md">
                  <div className="flex-1">
                    <Label htmlFor="budget">Your investment budget (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="1000"
                      placeholder="e.g. 50000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Calculate</Button>
                </form>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowBudgetForm(true)}
                >
                  I want to see allocation for my budget 💰
                </Button>
              )}
            </div>
          )}
          
          {/* Stock recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recommended Stocks for You</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Safe stocks */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Safe Stocks 🛡️</CardTitle>
                  <CardDescription className="text-xs">
                    Lower risk, more stability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recommendations.recommendations.safe.map((stock, index) => (
                      <li key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium">{stock.ticker}</div>
                        <div className="text-sm text-gray-600">{stock.message}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Moderate stocks */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Moderate Picks ⚖️</CardTitle>
                  <CardDescription className="text-xs">
                    Balanced risk and reward
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recommendations.recommendations.moderate.map((stock, index) => (
                      <li key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium">{stock.ticker}</div>
                        <div className="text-sm text-gray-600">{stock.message}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Growth stocks */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Growth Opportunities 📈</CardTitle>
                  <CardDescription className="text-xs">
                    Higher risk, higher potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recommendations.recommendations.growth.map((stock, index) => (
                      <li key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium">{stock.ticker}</div>
                        <div className="text-sm text-gray-600">{stock.message}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
              <p className="text-blue-800">
                <span className="font-bold">Note:</span> {recommendations.note}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockRecommendations;