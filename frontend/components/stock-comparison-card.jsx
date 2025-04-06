"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, TrendingDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"



export function StockComparisonCard({ ticker, onRemove }) {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`https://investezy-backend.onrender.com/api/stock/${ticker}`)
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
        <CardFooter className="p-4 pt-0 flex justify-end">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardFooter>
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
        <CardFooter className="p-4 pt-0 flex justify-end">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const { companyName, latestPrice, returns, risk } = stockData
  const isPositive = returns.absolute > 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{companyName}</p>
              <p className="text-sm text-muted-foreground">{ticker}</p>
            </div>
            <div className="text-lg">{risk.meter === "Safe" ? "🟢" : risk.meter === "Moderate Risk" ? "🟡" : "🔴"}</div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <p className="text-2xl font-bold">₹{latestPrice}</p>
              <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-medium">{returns.absolute}%</span>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Reliability:</p>
              <p className="font-medium">{"⭐".repeat(stockData.stability.stars)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

