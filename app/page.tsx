"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Info, Search, Phone, Database } from "lucide-react"
import type { CountryFAQ } from "@/types/law-abroad"
import { CountrySelector } from "@/components/country-selector"
import { LawCard } from "@/components/law-card"
import { SearchBox } from "@/components/search-box"
import { EmergencyContacts } from "@/components/emergency-contacts"
import { FAQSection } from "@/components/faq-section"

interface Law {
  id: string
  title?: string
  category: string
  summary: string
  severity: "critical" | "high" | "medium" | "low"
  raw_text?: string
  source_name?: string
  source_url?: string
  last_verified?: string
}

interface CountryLawsResponse {
  country: string
  countryCode: string
  laws: Law[]
}

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [countryName, setCountryName] = useState<string>("")
  const [laws, setLaws] = useState<Law[]>([])
  const [faqs, setFAQs] = useState<CountryFAQ[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"laws" | "search" | "emergency">("laws")
  const [seeding, setSeeding] = useState(false)

  const fetchCountryData = async (countryCode: string) => {
    setLoading(true)
    try {
      const [lawsResponse, faqsResponse] = await Promise.all([
        fetch(`/api/laws/${countryCode}`),
        fetch(`/api/countries/${countryCode}/faqs`),
      ])

      if (lawsResponse.ok) {
        const lawsData: CountryLawsResponse = await lawsResponse.json()
        setCountryName(lawsData.country)
        setLaws(lawsData.laws)
      } else {
        console.error("Failed to fetch laws:", lawsResponse.status)
        setLaws([])
        setCountryName("")
      }

      if (faqsResponse.ok) {
        const faqsData = await faqsResponse.json()
        setFAQs(faqsData.faqs || [])
      } else {
        console.error("Failed to fetch FAQs:", faqsResponse.status)
        setFAQs([])
      }
    } catch (error) {
      console.error("Error fetching country data:", error)
      setLaws([])
      setFAQs([])
      setCountryName("")
    } finally {
      setLoading(false)
    }
  }

  const seedNonUSData = async () => {
    setSeeding(true)
    try {
      const response = await fetch("/api/seed-non-us", {
        method: "POST",
      })
      const result = await response.json()
      console.log("[v0] Seed result:", result)

      if (response.ok) {
        alert("Non-US data seeded successfully! Refresh the page to see new countries.")
        setSelectedCountry("")
        window.location.reload()
      } else {
        alert("Failed to seed data: " + result.error)
      }
    } catch (error) {
      console.error("[v0] Seed error:", error)
      alert("Error seeding data: " + error)
    } finally {
      setSeeding(false)
    }
  }

  useEffect(() => {
    if (selectedCountry) {
      fetchCountryData(selectedCountry)
    }
  }, [selectedCountry])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Law Abroad</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Know the laws before you travel. Stay safe, stay informed.
          </p>
          <div className="mt-4">
            <Button
              onClick={seedNonUSData}
              disabled={seeding}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Database className="h-4 w-4" />
              {seeding ? "Seeding..." : "Seed Non-US Data"}
            </Button>
          </div>
        </div>

        {/* Country Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Select Your Destination
            </CardTitle>
            <CardDescription>Choose a country to view local laws and regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <CountrySelector selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
          </CardContent>
        </Card>

        {selectedCountry && (
          <>
            {countryName && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl">{countryName}</CardTitle>
                  <CardDescription>Laws and regulations for travelers</CardDescription>
                </CardHeader>
              </Card>
            )}

            {faqs.length > 0 && <FAQSection faqs={faqs} countryName={countryName || selectedCountry.toUpperCase()} />}

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === "laws" ? "default" : "outline"}
                onClick={() => setActiveTab("laws")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Laws
              </Button>
              <Button
                variant={activeTab === "search" ? "default" : "outline"}
                onClick={() => setActiveTab("search")}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                variant={activeTab === "emergency" ? "default" : "outline"}
                onClick={() => setActiveTab("emergency")}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Emergency
              </Button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "laws" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      Loading laws for {selectedCountry.toUpperCase()}...
                    </div>
                  </div>
                ) : laws.length > 0 ? (
                  laws.map((law) => <LawCard key={law.id} law={law} />)
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-gray-500">No laws available for this country yet.</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "search" && <SearchBox countryCode={selectedCountry} />}

            {activeTab === "emergency" && <EmergencyContacts countryCode={selectedCountry} />}
          </>
        )}

        {/* Legal Disclaimer */}
        <Card className="mt-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Legal Disclaimer:</strong> This information is for general guidance only and should not be
                considered as legal advice. Laws can change frequently and may vary by region. Always consult with local
                authorities or legal professionals for current and specific legal requirements.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
