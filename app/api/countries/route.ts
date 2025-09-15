import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const rows = await sql`
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
