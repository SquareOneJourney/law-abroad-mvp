"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, ExternalLink, ChevronDown, ChevronUp, MapPin } from "lucide-react"

interface LawCardProps {
  law: {
    id: string
    title?: string
    category: string
    summary: string
    severity: "critical" | "high" | "medium" | "low"
    region?: string
    country_code?: string
    country_name?: string
    raw_text?: string
    source_name?: string
    source_url?: string
    last_verified?: string
  }
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
    badgeColor: "bg-red-500 text-white",
  },
  high: {
    icon: AlertCircle,
    color:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
    badgeColor: "bg-orange-500 text-white",
  },
  medium: {
    icon: Info,
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
    badgeColor: "bg-yellow-500 text-white",
  },
  low: {
    icon: Info,
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
    badgeColor: "bg-green-500 text-white",
  },
}

export function LawCard({ law }: LawCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!law) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Error: Law data not available</div>
        </CardContent>
      </Card>
    )
  }

  const config = severityConfig[law.severity] || severityConfig.low
  const Icon = config.icon

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getLocationText = () => {
    if (law.country_name && law.region) {
      return `${law.country_name} (${law.region})`
    }
    if (law.country_name) {
      return law.country_name
    }
    if (law.country_code && law.region) {
      return `${law.country_code} (${law.region})`
    }
    if (law.country_code) {
      return law.country_code
    }
    return null
  }

  const locationText = getLocationText()

  return (
    <Card className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">{law.category}</CardTitle>
            {locationText && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{locationText}</span>
              </div>
            )}
          </div>
          <Badge className={`${config.badgeColor} flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`}>
            <Icon className="h-3 w-3" />
            {law.severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{law.summary}</p>
          </div>

          {law.raw_text && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>

              {showDetails && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Full Legal Text</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{law.raw_text}</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              {/* Source link */}
              {law.source_url && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Source:</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => window.open(law.source_url, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {law.source_name || "Official Source"}
                  </Button>
                </div>
              )}

              {/* Last verified date */}
              {law.last_verified && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last Verified: {formatDate(law.last_verified)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
