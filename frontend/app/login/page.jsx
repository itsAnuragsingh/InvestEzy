"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // For demo purposes, we'll just check if the email exists in our demo data
      // In a real app, this would be a proper authentication flow
      if (email.trim() === "") {
        throw new Error("Please enter an email address")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store email in localStorage for demo purposes
      localStorage.setItem("userEmail", email)

      // Redirect to onboarding for new users, dashboard for existing
      const isNewUser = !localStorage.getItem(`${email}_onboarded`)

      if (isNewUser) {
        router.push("/onboarding")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl">
        <TrendingUp className="h-6 w-6 text-emerald-500" />
        <span>InvestEzy</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email to access your investment dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="text-xs text-gray-500">For demo, try: demo@stockai.com or user1@example.com</div>
            </div>
            {error && <div className="text-sm font-medium text-red-500">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline text-emerald-600">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
