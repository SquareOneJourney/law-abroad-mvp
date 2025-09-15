"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LawCard } from "@/components/law-card"

interface SearchResult {
  id: string
  title?: string
  category: string
  summary: string
  severity: "critical" | "high" | "medium" | "low"
  region?: string
  raw_text?: string
  source_name?: string
  source_url?: string
  last_verified?: string
  country_code: string
  country_name: string
}

interface SearchResponse {
  query: string
  filters: {
    country?: string
    category?: string
    severity?: string
    region?: string
  }
  results: SearchResult[]
  total: number
}

interface FilterOptions {
  countries: { code: string; name: string }[]
  categories: string[]
  regions: string[]
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ countries: [], categories: [], regions: [] })

  const loadFilterOptions = async (selectedCountry?: string) => {
    try {
      const params = selectedCountry && selectedCountry !== "all" ? `?country=${selectedCountry}` : ""
      const response = await fetch(`/api/search/filters${params}`)
      if (response.ok) {
        const data = await response.json()
        setFilterOptions(data)
      }
    } catch (error) {
      console.error("Failed to load filter options:", error)
    }
  }

  useEffect(() => {
    loadFilterOptions()
  }, [])

  useEffect(() => {
    if (countryFilter !== "all") {
      loadFilterOptions(countryFilter)
      setRegionFilter("all")
    } else {
      setFilterOptions((prev) => ({ ...prev, regions: [] }))
      setRegionFilter("all")
    }
  }, [countryFilter])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      if (query.trim()) params.append("q", query.trim())
      if (countryFilter !== "all") params.append("country", countryFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (severityFilter !== "all") params.append("severity", severityFilter)
      if (regionFilter !== "all") params.append("region", regionFilter)

      const response = await fetch(`/api/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setQuery("")
    setCountryFilter("all")
    setCategoryFilter("all")
    setSeverityFilter("all")
    setRegionFilter("all")
    setResults([])
    setHasSearched(false)
    setError(null)
  }

  useEffect(() => {
    if (hasSearched) {
      handleSearch()
    }
  }, [countryFilter, categoryFilter, severityFilter, regionFilter])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getActiveFilters = () => {
    const filters = []
    if (countryFilter !== "all") {
      const country = filterOptions.countries.find((c) => c.code === countryFilter)
      filters.push(`Country = ${country?.name || countryFilter}`)
    }
    if (regionFilter !== "all") filters.push(`Region = ${regionFilter}`)
    if (categoryFilter !== "all") filters.push(`Category = ${categoryFilter}`)
    if (severityFilter !== "all") filters.push(`Severity = ${severityFilter}`)
    return filters
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Search Laws Globally</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Find laws and regulations across all countries in our database
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search laws by country, category, or keyword…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-base"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="h-12 px-6">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </form>
        </div>

        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Country Filter */}
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {filterOptions.countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Region Filter */}
              <Select
                value={regionFilter}
                onValueChange={setRegionFilter}
                disabled={countryFilter === "all" || filterOptions.regions.length === 0}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {filterOptions.regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {filterOptions.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Severity Filter */}
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-10 bg-transparent"
                disabled={
                  !query &&
                  countryFilter === "all" &&
                  categoryFilter === "all" &&
                  severityFilter === "all" &&
                  regionFilter === "all"
                }
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {getActiveFilters().length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Filters:</span> {getActiveFilters().join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Searching laws...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-medium">Search Error</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No laws found with the selected filters.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Try different keywords or adjust your filters.
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Found {results.length} law{results.length !== 1 ? "s" : ""}
                {query && ` matching "${query}"`}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((law) => (
                <div key={law.id} className="space-y-2">
                  {/* Country header */}
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {law.country_name} ({law.country_code}){law.region && ` — ${law.region}`}
                  </div>

                  {/* Law card */}
                  <LawCard law={law} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
