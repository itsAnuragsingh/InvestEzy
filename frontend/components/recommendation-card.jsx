import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



export function RecommendationCard({ recommendation }) {
    const { ticker = "", hint } = recommendation || {}; // Add fallback for recommendation and ticker
  
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">{ticker.replace(".NS", "")}</p>
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
            <p className="text-sm text-muted-foreground">Recommended based on your portfolio</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <span>Details</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700">
            <span>Invest</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    );
  }
