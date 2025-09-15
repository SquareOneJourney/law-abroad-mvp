"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Law {
  id: number
  title: string
  category: string
  summary: string
  severity: "critical" | "high" | "medium" | "low"
  region?: string
  raw_text: string
  source_name: string
  source_url: string
  last_verified: string
}

interface CountryLawsResponse {
  country: string
  countryCode: string
  hasRegions: boolean
  regions: string[]
  currentRegion: string
  laws: Law[]
}

const severityConfig = {
  critical: { color: "bg-red-500", label: "Critical" },
  high: { color: "bg-orange-500", label: "High" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  low: { color: "bg-green-500", label: "Low" },
}

export default function CountryDetailPage() {
  const params = useParams()
  const code = params.code as string
  const [data, setData] = useState<CountryLawsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  const fetchCountryLaws = async (region = "all") => {
    try {
      setLoading(true)
      const url = region === "all" ? `/api/laws/${code}` : `/api/laws/${code}?region=${region}`

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch laws")
      }

      const result = await response.json()
      setData(result)
      setSelectedRegion(result.currentRegion)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (code) {
      fetchCountryLaws()
    }
  }, [code])

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    fetchCountryLaws(region)
  }

  const toggleExpanded = (lawId: number) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(lawId)) {
      newExpanded.delete(lawId)
    } else {
      newExpanded.add(lawId)
    }
    setExpandedCards(newExpanded)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDisplayTitle = () => {
    if (!data) return code.toUpperCase()
    if (!data.hasRegions || selectedRegion === "all") {
      return data.country
    }
    return `${data.country} — ${selectedRegion}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/countries" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Countries Overview
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/countries" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Countries Overview
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="text-red-600 font-medium mb-2">Error</div>
                <div className="text-red-800">{error}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.laws.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/countries" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Countries Overview
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getDisplayTitle()}</h1>
            <p className="text-lg text-gray-600">
              Legal essentials for travelers to {data?.country || code.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-gray-600">No laws available for this country yet.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/countries" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Countries Overview
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getDisplayTitle()}</h1>
          <p className="text-lg text-gray-600">Legal essentials for travelers to {data.country}</p>

          {data.hasRegions && (
            <div className="mt-4">
              <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Region:
              </label>
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {data.regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {data.laws.map((law) => {
            const isExpanded = expandedCards.has(law.id)
            const severityStyle = severityConfig[law.severity]

            return (
              <Card key={law.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{law.category}</CardTitle>
                      {law.region && (
                        <p className="text-sm text-gray-600 mt-1">
                          {data.country} ({law.region})
                        </p>
                      )}
                    </div>
                    <Badge className={`${severityStyle.color} text-white`}>{severityStyle.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{law.summary}</p>

                    <Button
                      variant="ghost"
                      onClick={() => toggleExpanded(law.id)}
                      className="flex items-center gap-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Hide details
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4" />
                          View details
                        </>
                      )}
                    </Button>

                    {isExpanded && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">Full Details:</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{law.raw_text}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <a
                          href={law.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {law.source_name}
                        </a>
                      </div>
                      <div className="text-sm text-gray-500">Verified on {formatDate(law.last_verified)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
