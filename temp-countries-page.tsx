Fix
Countries
Page + API

Goal:
\
Make /countries show correct country cards (name + law count), sourced from /api/countries. Ensure /api/countries always returns
{
  country_code, country_name, law_count
}
. Clicking a card should go to /countries/[code], which already renders the summaries.

1. Update app/countries/page.tsx
\
Replace the entire file
with
:

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Country {
  country_code: string
  country_name: string
  law_count: number
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/countries")
        if (!res.ok) throw new Error(`Failed to load countries: ${res.status}`)
        const raw = await res.json()

        if (!Array.isArray(raw)) throw new Error("Unexpected response from /api/countries")

        setCountries(raw)
      } catch (err: any) {
        console.error("Error loading countries list:", err)
        setError("Failed to load countries. Try again later.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Countries</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Countries</h1>
        <div className="text-sm text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Countries</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {countries.map((country) => {
          const code = country.country_code.toLowerCase()
          return (
            <Link key={country.country_code} href={`/countries/${code}`} className="no-underline">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{country.country_name || country.country_code}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {country.law_count} law{country.law_count !== 1 ? "s" : ""}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="w-full text-right text-sm text-blue-600">View laws →</div>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
\
2. Update app/api/countries/route.ts
\
Replace
with
:\

import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        country_code, 
        MAX(country_name) as country_name,
        COUNT(*)::int as law_count
      FROM laws
      GROUP BY country_code
      ORDER BY country_name;
    `

    return NextResponse.json(rows)
  } catch (err) {
    console.error("Error in /api/countries:", err)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
\
3. Verify existing app/countries/[code]/page.tsx

No changes needed — this already fetches laws by country and displays summary, source_name, last_verified.

✅ Expected Behavior After Fix
\
/countries loads
with proper country
cards (from /api/countries).
\
Each card shows country_name and number of laws.

Example: Japan — 12 laws.

Clicking a card navigates to /countries/[code].
\
This page lists the actual law summaries
with source + last verified.
\
