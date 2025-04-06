// components/beginners/LearningResources.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LearningResources = () => {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/beginner/learn');
        const data = await response.json();
        
        if (data.success) {
          setResources(data);
        } else {
          setError(data.error || 'Failed to load learning resources');
        }
      } catch (err) {
        setError('Could not connect to server. Please try again later.');
        console.error('Learning resources fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningResources();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
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
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Basics Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span className="text-blue-500">🧩</span> Stock Market Basics
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources?.basics?.map((item, i) => (
                <Card key={i} className="border-2 hover:border-blue-200 transition">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Tips Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span className="text-green-500">💡</span> Beginner Tips
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources?.tips?.map((item, i) => (
                <Card key={i} className="border-2 hover:border-green-200 transition">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Common Terms Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span className="text-purple-500">📝</span> Common Terms
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {resources?.commonTerms?.map((item, i) => (
                <AccordionItem key={i} value={`term-${i}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>{item.term}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 bg-gray-50 rounded-md">
                      {item.meaning}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningResources;