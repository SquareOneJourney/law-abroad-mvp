"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SummarizeTestPage() {
  const [lawId, setLawId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")

  const handleSummarize = async () => {
    if (!lawId.trim()) {
      setError("Please enter a law ID")
      return
    }

    setIsLoading(true)
    setError("")
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: lawId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to summarize law")
        return
      }

      setSummary(data.summary)
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Law Summarizer Test</h1>
          <p className="text-gray-600 mt-2">Enter a law ID to test the summarize API</p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter law ID (UUID)"
            value={lawId}
            onChange={(e) => setLawId(e.target.value)}
            className="border border-gray-300 px-3 py-2"
          />

          <Button
            onClick={handleSummarize}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Summarizing..." : "Summarize Law"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {summary && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}
