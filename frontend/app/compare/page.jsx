"use client"

import React, { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, BarChart3, Loader2, Search, TrendingDown, TrendingUp } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockComparisonCard } from "@/components/stock-comparison-card"
import { StockMetricComparison } from "@/components/stock-metric-comparison"


function ComparePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [comparisonData, setComparisonData] = useState(null)
  const [selectedTab, setSelectedTab] = useState("overview")

  // Get tickers from URL if available
  const tickersParam = searchParams.get("tickers")
  const [tickers, setTickers] = useState(tickersParam ? tickersParam.split(",") : [])

  useEffect(() => {
    if (tickers.length >= 2) {
      fetchComparisonData()
    } else {
      setComparisonData(null)
    }
  }, [tickers])

  const fetchComparisonData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://investezy-backend.onrender.com/api/compare?tickers=${tickers.join(",")}`)
      const data = await response.json()

      if (data.success) {
        setComparisonData(data)
      }
    } catch (error) {
      console.error("Error fetching comparison data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = (e) => {
    e.preventDefault()
    if (!searchTerm || tickers.includes(searchTerm)) return

    // Add .NS suffix if not present
    const formattedTicker = searchTerm.includes(".") ? searchTerm : `${searchTerm}.NS`

    setTickers([...tickers, formattedTicker])
    setSearchTerm("")

    // Update URL
    const newTickersParam = [...tickers, formattedTicker].join(",")
    router.push(`/compare?tickers=${newTickersParam}`)
  }

  const handleRemoveStock = (ticker) => {
    const newTickers = tickers.filter((t) => t !== ticker)
    setTickers(newTickers)

    // Update URL
    if (newTickers.length > 0) {
      router.push(`/compare?tickers=${newTickers.join(",")}`)
    } else {
      router.push("/compare")
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Compare Investments" text="Compare stocks side by side with simple metrics">
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Select Stocks to Compare</CardTitle>
          <CardDescription>Add up to 3 stocks to compare their performance, risk, and other metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStock} className="flex gap-2 mb-6">
            <div className="flex-1">
              <Label htmlFor="search-stock" className="sr-only">
                Search for a stock
              </Label>
              <Input
                id="search-stock"
                placeholder="Enter stock symbol (e.g., TCS, RELIANCE)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={tickers.length >= 3 || !searchTerm}>
              <Search className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>

          {tickers.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <BarChart3 className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Stocks Selected</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Add stocks using the search box above to compare them side by side. Try popular stocks like TCS,
                RELIANCE, or INFY.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tickers.map((ticker) => (
                <StockComparisonCard key={ticker} ticker={ticker} onRemove={() => handleRemoveStock(ticker)} />
              ))}
              {Array(Math.max(0, 3 - tickers.length))
                .fill(0)
                .map((_, i) => (
                  <Card key={`empty-${i}`} className="border-dashed bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center h-[200px] p-6">
                      <p className="text-sm text-muted-foreground text-center">Add another stock to compare</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
            <p className="text-muted-foreground">Loading comparison data...</p>
          </div>
        </div>
      )}

      {!loading && comparisonData && comparisonData.stocks.length >= 2 && (
        <>
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">AI Insights</h3>
                <div className="space-y-1">
                  <p className="text-sm">{comparisonData.comparison.bestPerformer}</p>
                  <p className="text-sm">{comparisonData.comparison.safestOption}</p>
                  <p className="text-sm font-medium mt-2">{comparisonData.comparison.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
              <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="returns.absolute"
                title="Returns (5 Years)"
                formatValue={(value) => `${value}%`}
                higherIsBetter={true}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Higher returns mean better growth over the last 5 years"
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="risk.fluctuation"
                title="Risk Level"
                formatValue={(value) => `${value}%`}
                higherIsBetter={false}
                icon={<TrendingDown className="h-4 w-4" />}
                description="Lower risk means less price fluctuation"
                riskMetric={true}
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="stability.stars"
                title="Reliability Rating"
                formatValue={(value) => "⭐".repeat(value)}
                higherIsBetter={true}
                description="More stars mean better risk-adjusted returns"
              />
            </TabsContent>

            <TabsContent value="returns" className="space-y-4">
              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="returns.absolute"
                title="Total Returns (5 Years)"
                formatValue={(value) => `${value}%`}
                higherIsBetter={true}
                description="Total growth over the last 5 years"
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="returns.cagr"
                title="Annual Growth Rate"
                formatValue={(value) => `${value}%`}
                higherIsBetter={true}
                description="Average yearly growth rate"
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="returns.projection"
                title="₹10,000 would now be worth"
                formatValue={(value) => `₹${value}`}
                higherIsBetter={true}
                description="If you had invested ₹10,000 five years ago"
              />
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="risk.fluctuation"
                title="Price Fluctuation"
                formatValue={(value) => `${value}%`}
                higherIsBetter={false}
                description="How much the price typically moves up and down"
                riskMetric={true}
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="risk.meter"
                title="Risk Category"
                formatValue={(value) => {
                  const emoji = value === "Safe" ? "🟢" : value === "Moderate Risk" ? "🟡" : "🔴"
                  return `${emoji} ${value}`
                }}
                customSort={(a, b) => {
                  const riskOrder = { Safe: 0, "Moderate Risk": 1, "High Risk": 2 }
                  return (
                    riskOrder[a.risk.meter] -
                    riskOrder[b.risk.meter ]
                  )
                }}
                higherIsBetter={false}
                description="Overall risk assessment"
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="stability.score"
                title="Stability Score"
                formatValue={(value) => value.toFixed(2)}
                higherIsBetter={true}
                description="Higher scores mean better returns for the risk taken"
              />
            </TabsContent>

            <TabsContent value="fundamentals" className="space-y-4">
              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="fundamentals.peRatio"
                title="P/E Ratio"
                formatValue={(value) => (value === "N/A" ? "N/A" : value.toString())}
                description="Price relative to earnings (lower can be better value)"
                neutralMetric={true}
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="fundamentals.dividendYield"
                title="Dividend Yield"
                formatValue={(value) => (value === "N/A" ? "N/A" : `${value}%`)}
                higherIsBetter={true}
                description="Annual dividend as percentage of share price"
              />

              <StockMetricComparison
                stocks={comparisonData.stocks}
                metricKey="fundamentals.marketCap"
                title="Market Cap"
                formatValue={(value) => (value === "N/A" ? "N/A" : `₹${value} Cr`)}
                description="Total market value of the company"
                neutralMetric={true}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button onClick={() => router.push("/dashboard")} className="bg-emerald-600 hover:bg-emerald-700">
              Back to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </DashboardShell>
  )
}

// Main component with Suspense boundary
export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  )
}