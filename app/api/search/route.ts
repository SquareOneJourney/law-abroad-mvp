import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query, countryCode } = await request.json()

    if (!query || !countryCode) {
      return NextResponse.json({ error: "Query and country code are required" }, { status: 400 })
    }

    // Simple keyword-based search in law summaries and details
    const searchResults = await sql`
      SELECT 
        cl.id,
        cl.summary,
        cl.severity,
        cl.details,
        lc.name as category_name,
        c.name as country_name,
        c.code as country_code
      FROM country_laws cl
      JOIN countries c ON cl.country_id = c.id
      JOIN law_categories lc ON cl.category_id = lc.id
      WHERE c.code = ${countryCode.toUpperCase()}
      AND (
        cl.summary ILIKE ${`%${query}%`} OR
        cl.details ILIKE ${`%${query}%`} OR
        lc.name ILIKE ${`%${query}%`}
      )
      ORDER BY 
        CASE cl.severity 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END
      LIMIT 5
    `

    // Generate a simple YES/NO answer based on severity
    let answer = "UNCLEAR"
    let explanation = "No specific information found for your query."

    if (searchResults.length > 0) {
      const highestSeverity = searchResults[0].severity

      if (highestSeverity === "critical" || highestSeverity === "high") {
        answer = "NO - HIGH RISK"
        explanation = `This activity may be illegal or highly restricted in ${searchResults[0].country_name}. ${searchResults[0].summary}`
      } else if (highestSeverity === "medium") {
        answer = "CAUTION REQUIRED"
        explanation = `This activity has restrictions in ${searchResults[0].country_name}. ${searchResults[0].summary}`
      } else {
        answer = "GENERALLY ALLOWED"
        explanation = `This activity appears to be allowed with normal precautions in ${searchResults[0].country_name}. ${searchResults[0].summary}`
      }
    }

    return NextResponse.json({
      query,
      country: searchResults[0]?.country_name || "Unknown",
      countryCode: countryCode.toUpperCase(),
      answer,
      explanation,
      relatedLaws: searchResults.map((law) => ({
        id: law.id,
        category: law.category_name,
        summary: law.summary,
        severity: law.severity,
        details: law.details,
      })),
    })
  } catch (error) {
    console.error("Error processing search:", error)
    return NextResponse.json({ error: "Failed to process search query" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const country = searchParams.get("country")
    const category = searchParams.get("category")
    const severity = searchParams.get("severity")
    const region = searchParams.get("region")

    const searchResults = await sql`
      SELECT 
        l.id,
        l.title,
        l.category,
        l.summary,
        l.severity,
        l.raw_text,
        l.source_name,
        l.source_url,
        l.last_verified,
        l.country_code,
        l.region,
        c.name as country_name
      FROM laws l
      JOIN countries c ON l.country_code = c.code
      WHERE 
        (${country}::text IS NULL OR l.country_code = ${country})
        AND (${category}::text IS NULL OR l.category = ${category})
        AND (${severity}::text IS NULL OR l.severity = ${severity})
        AND (${region}::text IS NULL OR ${region} = 'all' OR l.region = ${region})
        AND (
          ${query} = '' OR
          l.country_code ILIKE ${`%${query}%`} OR
          l.category ILIKE ${`%${query}%`} OR
          l.title ILIKE ${`%${query}%`} OR
          l.summary ILIKE ${`%${query}%`} OR
          l.raw_text ILIKE ${`%${query}%`} OR
          l.region ILIKE ${`%${query}%`}
        )
      ORDER BY l.last_verified DESC
      LIMIT 50
    `

    return NextResponse.json({
      query,
      filters: { country, category, severity, region },
      results: searchResults.map((law) => ({
        id: law.id,
        title: law.title,
        category: law.category,
        summary: law.summary,
        severity: law.severity,
        region: law.region,
        raw_text: law.raw_text,
        source_name: law.source_name,
        source_url: law.source_url,
        last_verified: law.last_verified,
        country_code: law.country_code,
        country_name: law.country_name,
      })),
      total: searchResults.length,
    })
  } catch (error) {
    console.error("Error processing global search:", error)
    return NextResponse.json({ error: "Failed to process search query" }, { status: 500 })
  }
}
