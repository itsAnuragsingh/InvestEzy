"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import RiskAssessment from './RiskAssessment';
import StockRecommendations from './StockRecommendations';
import MarketOverview from './MarketOverview';
import InvestmentCalculator from './InvestmentCalculator';
import LearningResources from './LearningResources';
import Glossary from './Glossary';

const BeginnersDashboard = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [riskProfile, setRiskProfile] = useState(null);

  // When risk profile is set, automatically show recommendations
  useEffect(() => {
    if (riskProfile) {
      setActiveTab('recommendations');
    }
  }, [riskProfile]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">New to Stock Market? 🌱</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We'll help you understand investing in simple terms and guide you to stocks that match your comfort level!
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="welcome">👋 Welcome</TabsTrigger>
          <TabsTrigger value="assessment">🧐 Profile</TabsTrigger>
          <TabsTrigger value="recommendations">💡 Stock Ideas</TabsTrigger>
          <TabsTrigger value="market">📊 Market</TabsTrigger>
          <TabsTrigger value="calculator">🧮 Calculator</TabsTrigger>
          <TabsTrigger value="learn">📚 Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="welcome" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">👋</span> Welcome to Stock Investing!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Stock investing doesn't have to be complicated! We've simplified everything to help you get started.</p>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">How to use this dashboard:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">1.</span> 
                      <span>Take our quick <strong>Profile Quiz</strong> to discover your investment style 🧐</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">2.</span> 
                      <span>Get personalized <strong>Stock Ideas</strong> that match your style 💡</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">3.</span> 
                      <span>Check the <strong>Market</strong> tab for a simple overview of what's happening 📊</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">4.</span> 
                      <span>Use our <strong>Calculator</strong> to see how your money could grow 🧮</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">5.</span> 
                      <span>Visit the <strong>Learn</strong> tab for beginner-friendly resources 📚</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center mt-6">
                  <Button onClick={() => setActiveTab('assessment')} className="px-8 py-6 text-lg">
                    Let's Get Started! 🚀
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="mt-6">
          <RiskAssessment onProfileDetermined={setRiskProfile} />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <StockRecommendations riskProfile={riskProfile?.riskProfile || 'moderate'} />
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <MarketOverview />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <InvestmentCalculator />
        </TabsContent>

        <TabsContent value="learn" className="mt-6">
          <Tabs defaultValue="basics">
            <TabsList>
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="glossary">Glossary</TabsTrigger>
            </TabsList>
            <TabsContent value="basics" className="mt-4">
              <LearningResources />
            </TabsContent>
            <TabsContent value="glossary" className="mt-4">
              <Glossary />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeginnersDashboard;