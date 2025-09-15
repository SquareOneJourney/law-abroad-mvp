// app/api/scrape-japan/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import * as cheerio from "cheerio";

export async function POST() {
  const results: any[] = [];

  try {
    // 1. Fetch the Japan ministry health page
    const response = await fetch(
      "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html"
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    // 2. Extract title + text
    const title =
      $("h1").first().text().trim() ||
      "Prescription medicine import (Japan)";
    const text = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .join(" ")
      .slice(0, 2000);

    // 3. Upsert into Supabase
    const { data, error } = await supabase
      .from("country_laws")
      .upsert(
        {
          country_code: "JP",
          category: "drugs",
          title,
          raw_text: text,
          source_name: "Japan Ministry of Health",
          source_url:
            "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html",
          source_date: new Date().toISOString().split("T")[0],
          last_verified: new Date().toISOString(),
        },
        {
          onConflict: "country_code,category,title",
        }
      )
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
    }

    if (data) {
      // 4. Call summarize endpoint
      try {
        const summarizeResponse = await fetch(
          `${
            process.env.VERCEL_URL
              ? "https://" + process.env.VERCEL_URL
              : "http://localhost:3000"
          }/api/summarize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.id }),
          }
        );

        const summarizeResult = await summarizeResponse.json();
        results.push({
          country: "JP",
          id: data.id,
          summary: summarizeResult.summary || "Summary generation failed",
        });
      } catch (summaryError) {
        console.error("Summary request error:", summaryError);
        results.push({
          country: "JP",
          id: data.id,
          summary: "Summary generation failed",
        });
      }
    }
  } catch (error) {
    console.error("Japan scraper error:", error);
  }

  return NextResponse.json({
    status: "ok",
    results,
  });
}
