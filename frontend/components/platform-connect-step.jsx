"use client"

import  React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2 } from "lucide-react"



export function PlatformConnectStep({ platform, onConnect, onSkip, loading, isConnected }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onConnect()
  }

  if (isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{platform.icon}</span> {platform.name}
            <span className="ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 border-emerald-200">
              <Check className="mr-1 h-3 w-3" />
              Connected
            </span>
          </CardTitle>
          <CardDescription>{platform.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Successfully connected to {platform.name}!
            </p>
            <p className="text-xs text-muted-foreground mt-1">Your investments will now appear in your dashboard.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onSkip}>Continue</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{platform.icon}</span> {platform.name}
        </CardTitle>
        <CardDescription>{platform.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Client ID</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Your ${platform.name} username`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-muted-foreground">For demo purposes, any credentials will work.</p>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Why connect {platform.name}?</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">•</span> View all your {platform.name} investments in one place
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">•</span> Get personalized recommendations based on your portfolio
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">•</span> Track performance with simple, easy-to-understand metrics
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm">
                <span className="font-medium">🔒 Secure Connection:</span> We use bank-level encryption and never store
                your passwords.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        {showForm ? (
          <Button onClick={onConnect} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        ) : (
          <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

