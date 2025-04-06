"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  PieChart,
  Shield,
  Zap,
  ChevronRight,
  Sparkles,
  LineChart,
  BarChart,
  Wallet,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

// Sample chart data
const chartData = [
  { month: "Jan", value: 1000 },
  { month: "Feb", value: 1200 },
  { month: "Mar", value: 1100 },
  { month: "Apr", value: 1400 },
  { month: "May", value: 1300 },
  { month: "Jun", value: 1500 },
  { month: "Jul", value: 1700 },
  { month: "Aug", value: 1600 },
  { month: "Sep", value: 1800 },
  { month: "Oct", value: 2000 },
  { month: "Nov", value: 2200 },
  { month: "Dec", value: 2400 },
]

// Stock data for the ticker
const stockData = [
  { symbol: "RELIANCE", price: "₹2,856.20", change: "+1.2%" },
  { symbol: "HDFC", price: "₹1,678.45", change: "-0.5%" },
  { symbol: "TCS", price: "₹3,421.90", change: "+0.8%" },
  { symbol: "INFY", price: "₹1,523.75", change: "+1.5%" },
  { symbol: "ICICI", price: "₹945.30", change: "-0.3%" },
]

// Testimonials data


// Investment stats
// const investmentStats = [
//   { label: "Total Users", value: "50,000+", icon: <Wallet className="h-5 w-5" />, growth: "+28%" },
//   { label: "Investments Managed", value: "₹1.2B+", icon: <BarChart className="h-5 w-5" />, growth: "+35%" },
//   { label: "Avg. Returns", value: "18.5%", icon: <LineChart className="h-5 w-5" />, growth: "+5.2%" },
// ]

export default function Home() {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [chartVisible, setChartVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const tickerRef = useRef(null)

  // Animate the portfolio value counter
  useEffect(() => {
    const targetValue = 1045230
    const duration = 2000 // 2 seconds
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)
    const valueIncrement = targetValue / totalFrames

    let currentFrame = 0

    const counter = setInterval(() => {
      currentFrame++
      const newValue = Math.min(Math.floor(valueIncrement * currentFrame), targetValue)
      setAnimatedValue(newValue)

      if (currentFrame === totalFrames) {
        clearInterval(counter)
      }
    }, frameDuration)

    // Show chart after counter animation
    setTimeout(() => {
      setChartVisible(true)
    }, duration)

    return () => clearInterval(counter)
  }, [])

  // Ticker animation
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      if (tickerRef.current) {
        if (activeTestimonial < testimonials.length - 1) {
          setActiveTestimonial(activeTestimonial + 1)
        } else {
          setActiveTestimonial(0)
        }
      }
    }, 5000)

    return () => clearInterval(tickerInterval)
  }, [activeTestimonial])

  // Format the animated value as currency
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(animatedValue)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
      {/* Stock Ticker */}
      <div className="w-full bg-emerald-600 dark:bg-emerald-800 text-white py-1 overflow-hidden">
        <div className="flex items-center animate-marquee">
          {stockData.map((stock, index) => (
            <div key={index} className="flex items-center mx-4 whitespace-nowrap">
              <span className="font-medium">{stock.symbol}</span>
              <span className="mx-2">{stock.price}</span>
              <span className={stock.change.startsWith("+") ? "text-green-300" : "text-red-300"}>{stock.change}</span>
            </div>
          ))}
          {stockData.map((stock, index) => (
            <div key={`repeat-${index}`} className="flex items-center mx-4 whitespace-nowrap">
              <span className="font-medium">{stock.symbol}</span>
              <span className="mx-2">{stock.price}</span>
              <span className={stock.change.startsWith("+") ? "text-green-300" : "text-red-300"}>{stock.change}</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span>InvestEzy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors">
                Login
              </Button>
            </Link>

            <Link href="/search">
              <Button className="bg-emerald-600 hover:bg-emerald-700 transition-all hover:shadow-lg">
                Search Stocks
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 dark:bg-emerald-900/30 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute top-60 -left-20 w-60 h-60 bg-teal-200 dark:bg-teal-900/30 rounded-full filter blur-3xl opacity-30"></div>
          </div>

          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center ml-8">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="space-y-2">
                  <motion.div
                    className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-300 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI-Powered Investing
                    </span>
                  </motion.div>
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                      Smarter Investing
                    </span>{" "}
                    <br />
                    <span>with AI</span>
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Compare funds like you compare smartphones. Get AI-powered recommendations and manage all your
                    investments in one place.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all shadow-md hover:shadow-xl"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/new">
                    <Button
                      size="lg"
                      variant="outline"
                      className="hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all"
                    >
                      New to Investing?
                    </Button>
                  </Link>
                </motion.div>

                {/* Stats Row */}
                {/* <motion.div
                  className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {investmentStats.map((stat, index) => (
                    <motion.div key={index} className="flex flex-col" variants={fadeIn}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                          {stat.icon}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 pb-1">
                          {stat.growth}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div> */}
              </motion.div>

              <motion.div
                className="flex justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border bg-white p-2 shadow-xl dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 opacity-50"></div>
                  <div className="relative h-full w-full rounded-lg bg-white p-4 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        <span className="font-medium">Portfolio Overview</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      >
                        April 2025
                      </Badge>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Total Value</div>
                          <motion.div
                            className="font-bold text-lg"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                          >
                            {formattedValue}
                          </motion.div>
                        </div>
                        <motion.div
                          className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        >
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ delay: 1, duration: 1.5 }}
                          ></motion.div>
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-800 hover:shadow-md transition-all"
                          whileHover={{ y: -5 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <div className="text-sm text-gray-500">Returns</div>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-bold">+15.4%</span>
                          </div>
                        </motion.div>
                        <motion.div
                          className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-800 hover:shadow-md transition-all"
                          whileHover={{ y: -5 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                        >
                          <div className="text-sm text-gray-500">Risk Level</div>
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span className="font-medium">Low</span>
                          </div>
                        </motion.div>
                      </div>
                      <motion.div
                        className="rounded-lg border p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: chartVisible ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="mb-2 text-sm font-medium">Performance</div>
                        <div className="h-24 w-full">
                          {chartVisible && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="rounded-lg border bg-white p-2 shadow-md dark:bg-gray-800 text-xs">
                                          <p className="font-medium">{`${payload[0].payload.month}: ₹${payload[0].value}`}</p>
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#10b981"
                                  fillOpacity={1}
                                  fill="url(#colorValue)"
                                  animationDuration={1500}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 -right-20 w-80 h-80 bg-emerald-100 dark:bg-emerald-900/20 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 dark:bg-teal-900/20 rounded-full filter blur-3xl opacity-30"></div>
          </div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Simplifying Investments
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform makes investing as easy as ordering food online. Compare, analyze, and execute all in one
                  place.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div
                className="flex flex-col items-center space-y-4 text-center group"
                variants={fadeIn}
                whileHover={{ y: -10 }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg group-hover:shadow-xl transition-all">
                  <PieChart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Comparisons</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Compare funds like smartphones with trust scores, safety meters, and clear return metrics.
                </p>
                <Link
                  href="/features"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium flex items-center"
                >
                  Learn more <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-col items-center space-y-4 text-center group"
                variants={fadeIn}
                whileHover={{ y: -10 }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg group-hover:shadow-xl transition-all">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">Unified Dashboard</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track all your investments across Zerodha, Angel One, and MF Central in one place.
                </p>
                <Link
                  href="/features"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium flex items-center"
                >
                  Learn more <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-col items-center space-y-4 text-center group"
                variants={fadeIn}
                whileHover={{ y: -10 }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg group-hover:shadow-xl transition-all">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">Simple Execution</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Buy and sell with one click without leaving the app. No more juggling between platforms.
                </p>
                <Link
                  href="/features"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium flex items-center"
                >
                  Learn more <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Tabs */}
            <motion.div
              className="mt-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
            >
              <Tabs defaultValue="compare" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                  <TabsTrigger value="compare">Compare</TabsTrigger>
                  <TabsTrigger value="analyze">Analyze</TabsTrigger>
                  <TabsTrigger value="execute">Execute</TabsTrigger>
                </TabsList>
                <TabsContent value="compare">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Compare Investments Side by Side</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Our intuitive comparison tools let you evaluate multiple investment options with clear metrics
                        and visualizations. See risk profiles, historical performance, and projected returns at a
                        glance.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Side-by-side visual comparisons</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Risk-adjusted return metrics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>AI-powered investment recommendations</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src="/compare.png"
                        alt="Investment comparison interface"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analyze">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Deep Portfolio Analysis</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get comprehensive insights into your portfolio performance with advanced analytics tools.
                        Understand asset allocation, sector exposure, and identify optimization opportunities.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Real-time performance tracking</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Diversification scoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Tax optimization suggestions</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src="/dashboard.png"
                        alt="Portfolio analysis dashboard"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="execute">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Smart Stock Discovery</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Discover and analyze stocks effortlessly with InvestEzy's intelligent stock search features. Designed for both beginners and seasoned traders, our tools offer data-driven suggestions and visual insights — all in one place.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Smart Stock Search</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Rating-Based Suggestions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>Chart Visualization</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src="/search.png"
                        alt="Trade execution interface"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="rgba(255, 255, 255, 0.05)"
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              className="flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Transform Your Investment Journey?
              </h2>
              <p className="max-w-[600px] text-emerald-100 md:text-xl/relaxed">
                Join thousands of investors who have already simplified their investment process.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-gray-100 hover:scale-105 transition-all shadow-md"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-emerald-700 transition-all"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 md:py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="font-bold text-lg">InvestEzy</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Making investing simple, transparent, and accessible for everyone.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 3.808 0 2.43-.013 2.784-.06 3.808-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-3.808.06-2.43 0-2.784-.013-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-3.808 0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.465c.636-.247 1.363-.416 2.427-.465.048 0 .097-.001.146-.002zm-.092 1.802h-.146c-2.387 0-2.718.011-3.71.058-.895.041-1.38.19-1.704.316-.43.167-.736.367-1.057.687-.32.32-.52.627-.687 1.057-.126.324-.275.809-.316 1.704-.047.992-.058 1.323-.058 3.71s.011 2.718.058 3.71c.041.895.19 1.38.316 1.704.167.43.367.736.687 1.057.32.32.627.52 1.057.687.324.126.809.275 1.704.316.992.047 1.323.058 3.71.058s2.718-.011 3.71-.058c.895-.041 1.38-.19 1.704-.316.43-.167.736-.367 1.057-.687.32-.32.52-.627.687-1.057.126-.324.275-.809.316-1.704.047-.992.058-1.323.058-3.71s-.011-2.718-.058-3.71c-.041-.895-.19-1.38-.316-1.704a2.89 2.89 0 00-.687-1.057 2.89 2.89 0 00-1.057-.687c-.324-.126-.809-.275-1.704-.316-.992-.047-1.323-.058-3.71-.058z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
                Products
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Stock Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Mutual Funds
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Portfolio Analyzer
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Tax Optimizer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Learning Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Market News
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Investment Guides
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © 2025 InvestEzy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

