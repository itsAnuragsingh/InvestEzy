"use client"

import  React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"



export function StockMetricComparison({
  stocks,
  metricKey,
  title,
  formatValue,
  higherIsBetter = true,
  neutralMetric = false,
  riskMetric = false,
  icon,
  description,
  customSort,
}) {
  // Get the nested property value using the dot notation in metricKey
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : null
    }, obj)
  }

  // Sort stocks based on the metric
  const sortedStocks = [...stocks].sort((a, b) => {
    if (customSort) {
      return customSort(a, b)
    }

    const aValue = getNestedValue(a, metricKey)
    const bValue = getNestedValue(b, metricKey)

    if (aValue === null || bValue === null) return 0

    return higherIsBetter ? bValue - aValue : aValue - bValue
  })

  // Find the max value for calculating percentages
  const values = stocks.map((stock) => getNestedValue(stock, metricKey))
  const maxValue = Math.max(...values.filter((v) => v !== null && v !== "N/A"))
  const minValue = Math.min(...values.filter((v) => v !== null && v !== "N/A"))
  const range = maxValue - minValue

  // Calculate progress percentage
  const getProgressPercentage = (value) => {
    if (value === null || value === "N/A") return 0

    if (neutralMetric) {
      // For neutral metrics, we'll center them
      const midPoint = (maxValue + minValue) / 2
      const deviation = Math.abs(value - midPoint)
      const maxDeviation = Math.max(maxValue - midPoint, midPoint - minValue)
      return 50 - (deviation / maxDeviation) * 50
    }

    if (range === 0) return 100 // If all values are the same

    return higherIsBetter ? ((value - minValue) / range) * 100 : ((maxValue - value) / range) * 100
  }

  // Get color based on value
  const getColorClass = (stock, index) => {
    const value = getNestedValue(stock, metricKey)

    if (value === null || value === "N/A") return "bg-gray-300"

    if (neutralMetric) return "bg-blue-500"

    if (riskMetric) {
      // For risk metrics
      if (index === 0) return "bg-emerald-500" // Best (lowest risk)
      if (index === stocks.length - 1) return "bg-red-500" // Worst (highest risk)
      return "bg-amber-500" // Middle
    }

    // For regular metrics
    if (index === 0) return "bg-emerald-500" // Best
    if (index === stocks.length - 1) return "bg-amber-500" // Worst
    return "bg-blue-500" // Middle
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon && icon}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedStocks.map((stock, index) => {
            const value = getNestedValue(stock, metricKey)
            const formattedValue = value !== null ? formatValue(value) : "N/A"
            const progressPercentage = getProgressPercentage(value)

            return (
              <div key={stock.ticker} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{stock.companyName}</div>
                  <div className="font-medium">{formattedValue}</div>
                </div>
                <Progress value={progressPercentage} className="h-2" indicatorClassName={getColorClass(stock, index)} />
                {index === 0 && !neutralMetric && (
                  <div className="text-xs text-emerald-600 font-medium">
                    {riskMetric ? "Lowest Risk" : "Best Performer"}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

