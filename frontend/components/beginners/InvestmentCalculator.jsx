// components/beginners/InvestmentCalculator.jsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InvestmentCalculator = () => {
  const [formData, setFormData] = useState({
    amount: 10000,
    monthly: 1000,
    years: 5,
    return: 12
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value[0]
    });
  };

  const calculateInvestment = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        amount: formData.amount,
        monthly: formData.monthly,
        years: formData.years,
        return: formData.return
      });

      const response = await fetch(`http://localhost:5000/api/beginner/calculator?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (err) {
      setError('Could not connect to server. Please try again.');
      console.error('Investment calculator error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return `₹${parseInt(value).toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🧮</span> Investment Growth Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Initial Investment Amount (₹)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  name="amount"
                  min={1000}
                  max={1000000}
                  step={1000}
                  value={[formData.amount]}
                  onValueChange={(value) => handleSliderChange('amount', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Monthly Investment (₹)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  name="monthly"
                  min={0}
                  max={50000}
                  step={500}
                  value={[formData.monthly]}
                  onValueChange={(value) => handleSliderChange('monthly', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  name="monthly"
                  value={formData.monthly}
                  onChange={handleInputChange}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Investment Period (Years)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  name="years"
                  min={1}
                  max={30}
                  step={1}
                  value={[formData.years]}
                  onValueChange={(value) => handleSliderChange('years', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  name="years"
                  value={formData.years}
                  onChange={handleInputChange}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Expected Annual Return (%)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  name="return"
                  min={1}
                  max={30}
                  step={0.5}
                  value={[formData.return]}
                  onValueChange={(value) => handleSliderChange('return', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  name="return"
                  value={formData.return}
                  onChange={handleInputChange}
                  className="w-24"
                />
              </div>
            </div>

            <Button 
              onClick={calculateInvestment}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Calculating...' : 'Calculate Growth'}
            </Button>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <div>
            {results && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-lg mb-2">Your Growth Projection</h3>
                  <p className="text-green-800">{results.friendlyExplanation}</p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={results.journey}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Years', position: 'bottom' }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `₹${(value/1000)}K`}
                      />
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                        labelFormatter={(value) => `Year ${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        activeDot={{ r: 8 }} 
                        name="Investment Value"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalInvested" 
                        stroke="#6366f1" 
                        name="Amount Invested"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Total Investment</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(results.totalInvested)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600">Final Value</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(results.finalValue)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-600">Growth Amount</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(results.totalGrowth)}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-sm text-amber-600">Growth Percentage</p>
                    <p className="text-xl font-bold">
                      {results.growthPercentage}%
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 italic">
                  {results.note}
                </div>
              </div>
            )}
            
            {!results && !loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <div className="text-5xl mb-4">🧮</div>
                  <h3 className="text-lg font-medium mb-2">See How Your Money Can Grow</h3>
                  <p className="text-gray-500">
                    Adjust the sliders and click Calculate to see your potential investment growth over time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;