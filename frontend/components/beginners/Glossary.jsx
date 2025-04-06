// components/beginners/Glossary.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';

const Glossary = () => {
  const [glossary, setGlossary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGlossary = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/beginner/glossary');
        const data = await response.json();
        
        if (data.success) {
          setGlossary(data);
        } else {
          setError(data.error || 'Failed to load glossary');
        }
      } catch (err) {
        setError('Could not connect to server. Please try again later.');
        console.error('Glossary fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlossary();
  }, []);

  const filterTerms = (category) => {
    if (!searchTerm) return category.terms;
    
    return category.terms.filter(term => 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
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
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search terms..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          {glossary?.categories?.map((category, i) => {
            const filteredTerms = filterTerms(category);
            
            if (filteredTerms.length === 0) return null;
            
            return (
              <div key={i} className="mb-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <span>{category.emoji}</span> {category.name}
                </h3>
                
                <Accordion type="single" collapsible className="w-full">
                  {filteredTerms.map((term, j) => (
                    <AccordionItem key={j} value={`term-${i}-${j}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="text-left">
                          <span className="font-medium">{term.term}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="bg-gray-50 p-3 rounded-md">
                            {term.definition}
                          </div>
                          {term.example && (
                            <div className="bg-blue-50 p-3 rounded-md text-sm">
                              <span className="font-medium">Example:</span> {term.example}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
          
          {/* Note */}
          <div className="bg-gray-50 p-4 rounded-lg text-center italic text-gray-600">
            {glossary?.note}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Glossary;