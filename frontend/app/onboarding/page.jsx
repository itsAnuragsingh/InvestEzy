"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowRight, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { PlatformConnectStep } from "@/components/platform-connect-step"


export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [connectedPlatforms, setConnectedPlatforms] = useState([])
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("userEmail")
    if (!email) {
      router.push("/login")
      return
    }

    setUserEmail(email)
  }, [router])

  const platforms = [
    {
      id: "zerodha",
      name: "Zerodha",
      description: "India's largest stock broker offering the lowest, most transparent pricing on all products",
      icon: "💹",
    },
    {
      id: "angel_one",
      name: "Angel One",
      description: "Trade in stocks, derivatives, currencies, and commodities with Angel One",
      icon: "📊",
    },
    {
      id: "mf_central",
      name: "MF Central",
      description: "One-stop solution for all your mutual fund investments",
      icon: "💰",
    },
  ]

  const handleConnectPlatform = async (platformId) => {
    setLoading(true)

    // Simulate API call to connect platform
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setConnectedPlatforms((prev) => [...prev, platformId])
    setLoading(false)

    // Move to next step
    if (step < platforms.length) {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    if (step < platforms.length) {
      setStep(step + 1)
    }
  }

  const handleFinish = () => {
    router.push("/dashboard")
  }

  // Calculate progress percentage
  const progress = (step / platforms.length) * 100

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl">
        <TrendingUp className="h-6 w-6 text-emerald-500" />
        <span>InvestEzy</span>
      </Link>

      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Connect Your Platforms</h2>
          <span className="text-sm text-muted-foreground">
            {step}/{platforms.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {step < platforms.length ? (
        <PlatformConnectStep
          platform={platforms[step]}
          onConnect={() => handleConnectPlatform(platforms[step].id)}
          onSkip={handleSkip}
          loading={loading}
          isConnected={connectedPlatforms.includes(platforms[step].id)}
        />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎉</span> You're All Set!
            </CardTitle>
            <CardDescription>
              {connectedPlatforms.length > 0
                ? `You've successfully connected ${connectedPlatforms.length} platform${connectedPlatforms.length !== 1 ? "s" : ""}.`
                : "You can always connect your platforms later from the dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedPlatforms.length > 0 ? (
                <div className="rounded-lg border p-4 bg-emerald-50 dark:bg-emerald-900/20">
                  <h3 className="font-medium mb-2">Connected Platforms:</h3>
                  <ul className="space-y-2">
                    {connectedPlatforms.map((platformId) => {
                      const platform = platforms.find((p) => p.id === platformId)
                      return (
                        <li key={platformId} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>
                            {platform?.icon} {platform?.name}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : (
                <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-sm">
                    You haven't connected any platforms yet. You can do this anytime from your dashboard.
                  </p>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">What's Next?</h3>
                <p className="text-sm text-muted-foreground mb-2">Your personalized dashboard is ready. You can:</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span> View your portfolio across platforms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span> Get AI-powered investment recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">•</span> Compare stocks with simple metrics
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinish} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

