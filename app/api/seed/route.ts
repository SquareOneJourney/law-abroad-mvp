import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const result = await sql`
      INSERT INTO laws (
        id,
        country_code,
        category,
        title,
        raw_text,
        source_name,
        source_url,
        source_date,
        last_verified,
        created_at,
        updated_at
      ) VALUES 
      (
        gen_random_uuid(),
        'JP',
        'drugs',
        'Prescription meds import',
        'Excerpt: Some medicines require a Yakkan Shoumei import certificate before entry.',
        'Japan Ministry of Health, Labour and Welfare',
        'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html',
        '2025-03-10',
        NOW(),
        NOW(),
        NOW()
      ),
      (
        gen_random_uuid(),
        'AE',
        'alcohol',
        'Alcohol consumption in UAE',
        'Excerpt: Alcohol consumption is allowed in licensed venues but prohibited in public places.',
        'UAE Government Portal',
        'https://u.ae/en/information-and-services/justice-safety-and-the-law',
        '2025-01-15',
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `

    const seeded = []

    for (const row of result) {
      try {
        const summarizeResponse = await fetch(
          `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/summarize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: row.id }),
          },
        )

        const summarizeData = await summarizeResponse.json()

        if (summarizeData.error) {
          console.error(`Summarize error for ${row.id}:`, summarizeData.error)
          seeded.push({ id: row.id, summary: "Summary generation failed" })
        } else {
          seeded.push({ id: row.id, summary: summarizeData.summary })
        }
      } catch (summarizeError) {
        console.error(`Summarize request error for ${row.id}:`, summarizeError)
        seeded.push({ id: row.id, summary: "Summary generation failed" })
      }
    }

    return NextResponse.json({
      status: "ok",
      seeded,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
