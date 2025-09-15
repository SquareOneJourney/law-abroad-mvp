import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country")

    // Get distinct countries
    const countries = await sql`
      SELECT DISTINCT c.code, c.name
      FROM countries c
      JOIN laws l ON c.code = l.country_code
      ORDER BY c.name
    `

    // Get distinct categories
    const categories = await sql`
      SELECT DISTINCT category
      FROM laws
      WHERE category IS NOT NULL AND category != ''
      ORDER BY category
    `

    let regions: any[] = []
    if (country && country !== "all") {
      const regionResults = await sql`
        SELECT DISTINCT region
        FROM laws
        WHERE country_code = ${country.toUpperCase()}
        AND region IS NOT NULL AND region != ''
        ORDER BY region
      `
      regions = regionResults.map((r) => r.region)
    }

    return NextResponse.json({
      countries: countries.map((c) => ({ code: c.code, name: c.name })),
      categories: categories.map((c) => c.category),
      regions,
    })
  } catch (error) {
    console.error("Error fetching filter options:", error)
    return NextResponse.json({ error: "Failed to fetch filter options" }, { status: 500 })
  }
}
