import { sql } from "@/lib/db"
import * as cheerio from "cheerio"

export async function POST() {
  try {
    // Fetch the Japan Ministry of Health page
    const response = await fetch("https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html")

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`)
    }

    const html = await response.text()

    // Use cheerio to extract h1 and p tags
    const $ = cheerio.load(html)
    const headings = $("h1")
      .map((_, el) => $(el).text().trim())
      .get()
    const paragraphs = $("p")
      .map((_, el) => $(el).text().trim())
      .get()

    // Combine and truncate to ~2000 chars
    const rawText = [...headings, ...paragraphs]
      .filter((text) => text.length > 0)
      .join("\n\n")
      .substring(0, 2000)

    if (!rawText) {
      throw new Error("No content extracted from page")
    }

    // Insert or update the law record
    const result = await sql`
      INSERT INTO laws (
        country_code, 
        category, 
        title, 
        raw_text, 
        source_name, 
        source_url, 
        source_date, 
        last_verified
      ) VALUES (
        'JP',
        'drugs',
        'Prescription medicine import (Japan)',
        ${rawText},
        'Japan Ministry of Health, Labour and Welfare',
        'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html',
        ${new Date().toISOString()},
        NOW()
      )
      ON CONFLICT (country_code, category, title) 
      DO UPDATE SET 
        raw_text = EXCLUDED.raw_text,
        source_date = EXCLUDED.source_date,
        last_verified = NOW()
      RETURNING id
    `

    if (!result[0]?.id) {
      throw new Error("Failed to insert/update law record")
    }

    const lawId = result[0].id

    // Call the summarize API
    const summarizeResponse = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/summarize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: lawId }),
      },
    )

    if (!summarizeResponse.ok) {
      throw new Error("Failed to generate summary")
    }

    const summaryData = await summarizeResponse.json()

    if (summaryData.error) {
      throw new Error(`Summary generation failed: ${summaryData.error}`)
    }

    return Response.json({
      status: "ok",
      id: lawId,
      summary: summaryData.summary,
    })
  } catch (error) {
    console.error("Scrape Japan error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error occurred" }, { status: 500 })
  }
}
