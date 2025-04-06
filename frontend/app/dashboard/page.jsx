"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, BarChart3, LineChart, RefreshCcw, TrendingUp, User } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { StockCard } from "@/components/stock-card"
import { PlatformConnectCard } from "@/components/platform-connect-card"
import { RecommendationCard } from "@/components/recommendation-card"
import { useUser } from "@clerk/nextjs"
 import { useRouter } from ""




export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  const {user} =useUser()
  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("userEmail")
    if (!user) {
      router.push("/login")
      return
    }

    setUserEmail(user.emailAddresses[0].emailAddress)

    // Mark user as onboarded
    localStorage.setItem(`${email}_onboarded`, "true")

    // Fetch portfolio data
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/portfolio/${email}`)
        const data = await response.json()
        setPortfolio(data)

        // Fetch recommendations
        const recResponse = await fetch(`http://localhost:5000/api/recommend/${email}`)
        const recData = await recResponse.json()
        if (recData.success && recData.recommendations) {
          setRecommendations(recData.recommendations)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [router])

  // Count total stocks
  const totalStocks = portfolio ? Object.values(portfolio).reduce((acc, stocks) => acc + stocks.length, 0) : 0

  // For demo purposes, we'll use mock data for connected platforms
  const connectedPlatforms = portfolio
    ? Object.entries(portfolio)
        .filter(([_, stocks]) => stocks.length > 0)
        .map(([platform]) => platform)
    : []

  const handleCompareStocks = () => {
    // Get first two stocks from portfolio for comparison
    const allStocks = portfolio ? Object.values(portfolio).flat().slice(0, 2) : []

    if (allStocks.length >= 2) {
      router.push(`/compare?tickers=${allStocks.join(",")}`)
    } else {
      router.push("/compare")
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Investment Dashboard" text={userEmail ? `Welcome back, ${userEmail}` : "Loading..."}>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <RefreshCcw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹10,45,230</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">+15.4%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stocks & Funds</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStocks}</div>
            <p className="text-xs text-muted-foreground">Across {connectedPlatforms.length} platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Returns</CardTitle>
            <LineChart className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500">+2.5%</span> from previous month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <div className="text-lg">🟢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Low</div>
            <p className="text-xs text-muted-foreground">Portfolio Stability: ⭐⭐⭐⭐</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCompareStocks} variant="outline" size="sm" className="h-8 gap-1">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Compare Stocks</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <PortfolioOverview portfolio={portfolio} loading={loading} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => <Card key={i} className="h-[180px] animate-pulse bg-muted" />)
              : portfolio &&
                Object.entries(portfolio).flatMap(([platform, stocks]) =>
                  stocks
                    .slice(0, 3)
                    .map((stock, index) => (
                      <StockCard key={`${platform}-${index}`} ticker={stock} platform={platform} />
                    )),
                )}
          </div>

          {!loading && recommendations.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recommended for You</h3>
                <Button variant="link" size="sm" className="gap-1 text-emerald-600">
                  <span>View All</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PlatformConnectCard
              platform="zerodha"
              name="Zerodha"
              description="Connect your Zerodha account to view and manage your stocks."
              connected={connectedPlatforms.includes("zerodha")}
              stockCount={portfolio?.zerodha.length || 0}
            />
            <PlatformConnectCard
              platform="angel_one"
              name="Angel One"
              description="Connect your Angel One account to view and manage your stocks."
              connected={connectedPlatforms.includes("angel_one")}
              stockCount={portfolio?.angel_one.length || 0}
            />
            <PlatformConnectCard
              platform="mf_central"
              name="MF Central"
              description="Connect your MF Central account to view and manage your mutual funds."
              connected={connectedPlatforms.includes("mf_central")}
              stockCount={portfolio?.mf_central.length || 0}
            />
          </div>

          {portfolio && (
            <div className="mt-8 space-y-4">
              {Object.entries(portfolio).map(
                ([platform, stocks]) =>
                  stocks.length > 0 && (
                    <Card key={platform}>
                      <CardHeader>
                        <CardTitle className="capitalize">{platform.replace("_", " ")}</CardTitle>
                        <CardDescription>{stocks.length} stocks connected</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {stocks.map((stock, index) => (
                            <StockCard key={`${platform}-${index}`} ticker={stock} platform={platform} compact />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ),
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="h-[180px] animate-pulse bg-muted" />
                ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Recommendations</CardTitle>
                <CardDescription>
                  Connect more platforms or add more stocks to get personalized recommendations.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

