"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"



export function PortfolioOverview({ portfolio, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </CardContent>
      </Card>
    )
  }

  if (!portfolio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>No portfolio data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Connect a platform to view your portfolio</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for pie chart
  const data = [
    {
      name: "Zerodha",
      value: portfolio.zerodha.length,
      color: "#10b981",
    },
    {
      name: "Angel One",
      value: portfolio.angel_one.length,
      color: "#3b82f6",
    },
    {
      name: "MF Central",
      value: portfolio.mf_central.length,
      color: "#8b5cf6",
    },
  ].filter((item) => item.value > 0)

  // Mock allocation data
  const allocationData = [
    { name: "Stocks", value: 65, color: "#10b981" },
    { name: "Mutual Funds", value: 25, color: "#3b82f6" },
    { name: "ETFs", value: 10, color: "#8b5cf6" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Distribution across platformsatforms</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} stocks`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Distribution by investment type</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

