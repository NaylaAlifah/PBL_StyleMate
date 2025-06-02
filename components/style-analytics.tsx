"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Palette } from "lucide-react"

interface ModelInfo {
  version: string
  trainedOn: string
  accuracy: string
  lastUpdated: string
}

interface StyleAnalytics {
  totalRecommendations: number
  userSatisfaction: number
  popularStyles: string[]
  modelPerformance: ModelInfo
}

export function StyleAnalytics() {
  const [analytics, setAnalytics] = useState<StyleAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Simulate fetching analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAnalytics({
        totalRecommendations: 1247,
        userSatisfaction: 87,
        popularStyles: ["Classic", "Casual", "Business", "Trendy"],
        modelPerformance: {
          version: "1.0.0",
          trainedOn: "5000 style samples",
          accuracy: "87%",
          lastUpdated: "2024-01-15",
        },
      })
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalRecommendations.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.userSatisfaction}%</div>
          <Progress value={analytics.userSatisfaction} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.modelPerformance.accuracy}</div>
          <p className="text-xs text-muted-foreground">Version {analytics.modelPerformance.version}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Popular Styles</CardTitle>
          <Palette className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {analytics.popularStyles.map((style, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {style}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
