"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



export function StockCard({ ticker, platform, compact = false }) {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/stock/${ticker}`)
        const data = await response.json()

        if (data.success) {
          setStockData(data)
        } else {
          setError(data.error || "Failed to load stock data")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [ticker])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-4 w-[180px]" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-8 w-[60px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stockData) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="font-medium">{ticker}</p>
            <p className="text-sm text-red-500">{error || "Failed to load data"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { companyName, latestPrice, returns, risk, stability } = stockData
  const isPositive = returns.absolute > 0

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{companyName}</p>
              <p className="text-sm text-muted-foreground">{ticker}</p>
            </div>
            <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">{returns.absolute}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{companyName}</p>
                <p className="text-sm text-muted-foreground">{ticker}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-lg cursor-help">
                    {risk.meter === "Safe" ? "🟢" : risk.meter === "Moderate Risk" ? "🟡" : "🔴"}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Risk Level: {risk.meter}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-2xl font-bold">₹{latestPrice}</p>
                <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">{returns.absolute}%</span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm cursor-help">
                    <p>₹10,000 →</p>
                    <p className="font-medium">₹{returns.projection}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>If you invested ₹10,000 five years ago</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <p className="text-sm text-muted-foreground">Reliability:</p>
                    <p className="text-sm font-medium">{"⭐".repeat(stability.stars)}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on risk-adjusted returns</p>
                  <p>More stars = Better reliability</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => window.open(`/compare?tickers=${ticker}`, "_blank")}
          >
            <span>Compare</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700">
            <span>Trade</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}

