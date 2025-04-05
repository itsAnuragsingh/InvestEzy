// components/beginners/RiskAssessment.jsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RiskAssessment = ({ onProfileDetermined }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: 30,
    timeline: 'medium',
    experience: 'beginner',
    riskTolerance: 'medium',
    goal: 'balanced'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const updateAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/beginner/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        onProfileDetermined(data.profile);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit your answers. Please try again later.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧐</span> Find Your Investor Profile
        </CardTitle>
        <CardDescription>
          Answer a few simple questions to discover your investment style
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {profile ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Your Profile: {profile.riskProfile.charAt(0).toUpperCase() + profile.riskProfile.slice(1)} Investor {getProfileEmoji(profile.riskProfile)}
              </h3>
              <div className="text-lg mb-4">Risk Score: {profile.riskScore}/10</div>
              <p className="text-gray-700">{profile.suggestion}</p>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button onClick={() => onProfileDetermined(profile)} className="px-6 py-2">
                See Stock Recommendations 💡
              </Button>
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">What's your age? 🎂</h3>
                  <p className="text-gray-500 text-sm mb-4">Age can be a factor in how much risk might be suitable for you</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">20</span>
                    <Slider 
                      defaultValue={[answers.age]} 
                      min={20} 
                      max={70} 
                      step={1} 
                      onValueChange={(value) => updateAnswer('age', value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm">70+</span>
                  </div>
                  <div className="text-center mt-2 font-medium">{answers.age} years</div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">How much investing experience do you have? 📚</h3>
                  <RadioGroup 
                    defaultValue={answers.experience}
                    onValueChange={(value) => updateAnswer('experience', value)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="none" id="exp-none" />
                      <Label htmlFor="exp-none">None (I'm completely new)</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="beginner" id="exp-beginner" />
                      <Label htmlFor="exp-beginner">Beginner (I know a little bit)</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="some" id="exp-some" />
                      <Label htmlFor="exp-some">Some experience (I've invested before)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="experienced" id="exp-experienced" />
                      <Label htmlFor="exp-experienced">Experienced (I invest regularly)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <div></div>
                  <Button onClick={() => setStep(2)}>
                    Next Question →
                  </Button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">How long do you plan to invest for? ⏱️</h3>
                  <RadioGroup 
                    defaultValue={answers.timeline}
                    onValueChange={(value) => updateAnswer('timeline', value)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="short" id="time-short" />
                      <Label htmlFor="time-short">Short-term (1-2 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="medium" id="time-medium" />
                      <Label htmlFor="time-medium">Medium-term (3-5 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="time-long" />
                      <Label htmlFor="time-long">Long-term (6+ years)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">What's your main investment goal? 🎯</h3>
                  <RadioGroup 
                    defaultValue={answers.goal}
                    onValueChange={(value) => updateAnswer('goal', value)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="safety" id="goal-safety" />
                      <Label htmlFor="goal-safety">Safety (protect my money, minimal risk)</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="balanced" id="goal-balanced" />
                      <Label htmlFor="goal-balanced">Balanced (moderate growth with reasonable risk)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="growth" id="goal-growth" />
                      <Label htmlFor="goal-growth">Growth (maximize returns, willing to take more risk)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    ← Previous
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Next Question →
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">How would you react if your investment dropped 15% in value? 😬</h3>
                  <RadioGroup 
                    defaultValue={answers.riskTolerance}
                    onValueChange={(value) => updateAnswer('riskTolerance', value)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="low" id="risk-low" />
                      <Label htmlFor="risk-low">I'd panic and sell immediately!</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="medium" id="risk-medium" />
                      <Label htmlFor="risk-medium">I'd be concerned but would probably wait it out</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="risk-high" />
                      <Label htmlFor="risk-high">I understand markets fluctuate and would stay invested</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    <span className="font-bold">Tip:</span> Your answers help us understand your comfort level with risk. There's no right or wrong profile - we'll recommend stocks that match your style! 🌱
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    ← Previous
                  </Button>
                  <Button onClick={submitAssessment} disabled={isSubmitting}>
                    {isSubmitting ? 'Analyzing...' : 'Find My Profile!'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get emoji based on risk profile
function getProfileEmoji(profile) {
  switch (profile) {
    case 'very_conservative':
      return '🏦';
    case 'conservative':
      return '🛡️';
    case 'moderate':
      return '⚖️';
    case 'growth':
      return '📈';
    case 'aggressive':
      return '🚀';
    default:
      return '⚖️';
  }
}

export default RiskAssessment;