import Link from "next/link"
import { Button } from "@/components/ui/button"

import { ArrowRight, BarChart3, LineChart, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span>InvestEzy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 pr-2">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Smarter Investing with AI
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Compare funds like you compare smartphones. Get AI-powered recommendations and manage all your
                    investments in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/new">
                    <Button size="lg" variant="outline">
                      New to Investing?
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border bg-white p-2 shadow-xl dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 opacity-50"></div>
                  <div className="relative h-full w-full rounded-lg bg-white p-4 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        <span className="font-medium">Portfolio Overview</span>
                      </div>
                      <div className="text-sm text-gray-500">April 2025</div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Total Value</div>
                          <div className="font-bold text-lg">₹10,45,230</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                          <div className="h-full w-[85%] rounded-full bg-emerald-500"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-800">
                          <div className="text-sm text-gray-500">Returns</div>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-bold">+15.4%</span>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-800">
                          <div className="text-sm text-gray-500">Risk Level</div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg">🟢</span>
                            <span className="font-medium">Low</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="mb-2 text-sm font-medium">Performance</div>
                        <div className="h-24 w-full">
                          <LineChart className="h-full w-full text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simplifying Investments</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform makes investing as easy as ordering food online. Compare, analyze, and execute all in one
                  place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <BarChart3 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Comparisons</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Compare funds like smartphones with trust scores, safety meters, and clear return metrics.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <LineChart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Unified Dashboard</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track all your investments across Zerodha, Angel One, and MF Central in one place.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">Simple Execution</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Buy and sell with one click without leaving the app. No more juggling between platforms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">InvestAI</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Terms
            </Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
          <div className="flex-1 text-sm text-gray-500 text-center md:text-right">
            © 2025 InvestAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

