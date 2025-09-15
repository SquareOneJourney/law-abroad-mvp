"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import type { SearchResult } from "@/types/law-abroad"
import { LawCard } from "./law-card"

interface SearchBoxProps {
  countryCode: string
}

export function SearchBox({ countryCode }: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          countryCode,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      }
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Legal Question Search
          </CardTitle>
          <CardDescription>Ask a natural language question about laws in this country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Can I drink alcohol in public? Is photography allowed in temples?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Result</CardTitle>
            <CardDescription>Question: "{result.query}"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={`px-3 py-1 ${
                    result.answer.includes("NO") || result.answer.includes("HIGH RISK")
                      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200"
                      : result.answer.includes("CAUTION")
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200"
                  }`}
                >
                  {result.answer}
                </Badge>
              </div>

              <p className="text-gray-900 dark:text-gray-100">{result.explanation}</p>

              {result.relatedLaws.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Related Laws</h4>
                  <div className="space-y-2">
                    {result.relatedLaws.map((law) => (
                      <LawCard key={law.id} law={law} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
