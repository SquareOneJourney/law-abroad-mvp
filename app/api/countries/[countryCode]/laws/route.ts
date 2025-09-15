import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { countryCode: string } }) {
  try {
    const { countryCode } = params

    const laws = await sql`
      SELECT 
        cl.id,
        cl.summary,
        cl.severity,
        cl.details,
        lc.name as category_name,
        lc.description as category_description,
        c.name as country_name
      FROM country_laws cl
      JOIN countries c ON cl.country_id = c.id
      JOIN law_categories lc ON cl.category_id = lc.id
      WHERE c.code = ${countryCode.toUpperCase()}
      ORDER BY 
        CASE cl.severity 
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        lc.name ASC
    `

    if (laws.length === 0) {
      return NextResponse.json({ error: "Country not found or no laws available" }, { status: 404 })
    }

    return NextResponse.json({
      country: laws[0].country_name,
      countryCode: countryCode.toUpperCase(),
      laws: laws.map((law) => ({
        id: law.id,
        category: law.category_name,
        categoryDescription: law.category_description,
        summary: law.summary,
        severity: law.severity,
        details: law.details,
      })),
    })
  } catch (error) {
    console.error("Error fetching country laws:", error)
    return NextResponse.json({ error: "Failed to fetch country laws" }, { status: 500 })
  }
}
