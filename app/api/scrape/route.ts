import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function POST() {
  const results = []

  try {
    const jpResponse = await fetch("https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html")
    const jpHtml = await jpResponse.text()
    const jp$ = cheerio.load(jpHtml)

    const jpTitle = jp$("h1").first().text().trim() || "Prescription medicine import (Japan)"
    const jpText = jp$("p")
      .map((_, el) => jp$(el).text().trim())
      .get()
      .join(" ")
      .slice(0, 2000)

    const jpResult = await sql`
      INSERT INTO laws (country_code, category, title, raw_text, source_name, source_url, source_date, last_verified)
      VALUES ('JP', 'drugs', ${jpTitle}, ${jpText}, 'Japan Ministry of Health', 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html', ${new Date().toISOString().split("T")[0]}, NOW())
      ON CONFLICT (country_code, category, title) DO UPDATE SET
        raw_text = EXCLUDED.raw_text,
        last_verified = NOW()
      RETURNING id
    `

    if (jpResult.length > 0) {
      const lawId = jpResult[0].id
      try {
        const summarizeResponse = await fetch(
          `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/summarize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: lawId }),
          },
        )
        const summarizeResult = await summarizeResponse.json()
        results.push({
          country: "JP",
          id: lawId,
          summary: summarizeResult.summary || "Summary generation failed",
        })
      } catch (summaryError) {
        console.error("Japan summary error:", summaryError)
        results.push({ country: "JP", id: lawId, summary: "Summary generation failed" })
      }
    }
  } catch (error) {
    console.error("Japan scraper error:", error)
  }

  try {
    const aeResponse = await fetch("https://u.ae/en/information-and-services/justice-safety-and-the-law")
    const aeHtml = await aeResponse.text()
    const ae$ = cheerio.load(aeHtml)

    const aeTitle = "Alcohol laws in UAE"
    const aeText = ae$("h1, p")
      .slice(0, 5)
      .map((_, el) => ae$(el).text().trim())
      .get()
      .join(" ")
      .slice(0, 2000)

    const aeResult = await sql`
      INSERT INTO laws (country_code, category, title, raw_text, source_name, source_url, source_date, last_verified)
      VALUES ('AE', 'alcohol', ${aeTitle}, ${aeText}, 'UAE Government', 'https://u.ae/en/information-and-services/justice-safety-and-the-law', ${new Date().toISOString().split("T")[0]}, NOW())
      ON CONFLICT (country_code, category, title) DO UPDATE SET
        raw_text = EXCLUDED.raw_text,
        last_verified = NOW()
      RETURNING id
    `

    if (aeResult.length > 0) {
      const lawId = aeResult[0].id
      try {
        const summarizeResponse = await fetch(
          `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/summarize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: lawId }),
          },
        )
        const summarizeResult = await summarizeResponse.json()
        results.push({
          country: "AE",
          id: lawId,
          summary: summarizeResult.summary || "Summary generation failed",
        })
      } catch (summaryError) {
        console.error("UAE summary error:", summaryError)
        results.push({ country: "AE", id: lawId, summary: "Summary generation failed" })
      }
    }
  } catch (error) {
    console.error("UAE scraper error:", error)
  }

  try {
    const deResponse = await fetch("https://www.bmvi.de/")
    const deHtml = await deResponse.text()
    const de$ = cheerio.load(deHtml)

    const deTitle = "Driving laws in Germany"
    const deText = (de$("title").text() + " " + de$("p").first().text()).slice(0, 2000)

    const deResult = await sql`
      INSERT INTO laws (country_code, category, title, raw_text, source_name, source_url, source_date, last_verified)
      VALUES ('DE', 'driving', ${deTitle}, ${deText}, 'German Federal Ministry of Transport', 'https://www.bmvi.de/', ${new Date().toISOString().split("T")[0]}, NOW())
      ON CONFLICT (country_code, category, title) DO UPDATE SET
        raw_text = EXCLUDED.raw_text,
        last_verified = NOW()
      RETURNING id
    `

    if (deResult.length > 0) {
      const lawId = deResult[0].id
      try {
        const summarizeResponse = await fetch(
          `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/summarize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: lawId }),
          },
        )
        const summarizeResult = await summarizeResponse.json()
        results.push({
          country: "DE",
          id: lawId,
          summary: summarizeResult.summary || "Summary generation failed",
        })
      } catch (summaryError) {
        console.error("Germany summary error:", summaryError)
        results.push({ country: "DE", id: lawId, summary: "Summary generation failed" })
      }
    }
  } catch (error) {
    console.error("Germany scraper error:", error)
  }

  return NextResponse.json({
    status: "ok",
    results,
  })
}
