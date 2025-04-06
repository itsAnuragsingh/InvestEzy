import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Info, TrendingUp, BookOpen } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RecommendationCard({ recommendation }) {
  // Handle both object format and string-only format for backward compatibility
  const ticker = typeof recommendation === 'object' ? recommendation.ticker || "" : recommendation || "";
  const hint = typeof recommendation === 'object' ? recommendation.hint || null : null;
  const reason = typeof recommendation === 'object' ? recommendation.reason || null : null;
  
  // Extract company name from ticker
  const companyName = ticker.replace(".NS", "");
  
  // Simple emoji mapping for different recommendation types
  const getIconForHint = (hint) => {
    if (!hint) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    
    if (hint.includes("IT") || hint.includes("Technology"))
      return <span className="text-lg">💻</span>;
    if (hint.includes("Banking") || hint.includes("Financial"))
      return <span className="text-lg">🏦</span>;
    if (hint.includes("Oil") || hint.includes("Gas") || hint.includes("Energy"))
      return <span className="text-lg">⚡</span>;
    if (hint.includes("FMCG"))
      return <span className="text-lg">🛒</span>;
    if (hint.includes("Telecom"))
      return <span className="text-lg">📱</span>;
    if (hint.includes("Auto"))
      return <span className="text-lg">🚗</span>;
    if (hint.includes("Pharma") || hint.includes("Healthcare"))
      return <span className="text-lg">💊</span>;
      
    return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                {getIconForHint(hint)}
              </div>
              <p className="font-medium">{companyName}</p>
            </div>
            {hint && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                      <Info className="h-3.5 w-3.5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{hint}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {/* Industry sector indicator */}
          <div className="flex items-center">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {hint || "Recommended Stock"}
            </span>
          </div>
          
          {/* Recommendation reason - the key improvement */}
          {reason && (
            <div className="mt-2 p-3 bg-emerald-50 rounded-md text-sm border border-emerald-100">
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 leading-relaxed">
                  {reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between mt-auto">
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <span>Learn More</span>
        </Button>
        <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700">
          <span>Invest</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}