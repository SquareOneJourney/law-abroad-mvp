// app/api/scrape/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import * as cheerio from "cheerio";

async function summarizeLaw(lawId: string, country: string, results: any[]) {
  try {
    const summarizeResponse = await fetch(
      `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/summarize`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lawId }),
      }
    );

    const summarizeResult = await summarizeResponse.json();
    results.push({
      country,
      id: lawId,
      summary: summarizeResult.summary || "Summary generation failed",
    });
  } catch (err) {
    console.error(`${country} summary error:`, err);
    results.push({ country, id: lawId, summary: "Summary generation failed" });
  }
}

export async function POST() {
  const results: any[] = [];

  // --- Japan ---
  try {
    const jpResponse = await fetch(
      "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html"
    );
    const jpHtml = await jpResponse.text();
    const jp$ = cheerio.load(jpHtml);

    const jpTitle =
      jp$("h1").first().text().trim() ||
      "Prescription medicine import (Japan)";
    const jpText = jp$("p")
      .map((_, el) => jp$(el).text().trim())
      .get()
      .join(" ")
      .slice(0, 2000);

    const { data: jpResult, error: jpError } = await supabase
      .from("country_laws")
      .upsert(
        {
          country_code: "JP",
          category: "drugs",
          title: jpTitle,
          raw_text: jpText,
          source_name: "Japan Ministry of Health",
          source_url:
            "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html",
          source_date: new Date().toISOString().split("T")[0],
          last_verified: new Date().toISOString(),
        },
        { onConflict: "country_code,category,title" }
      )
      .select("id")
      .single();

    if (jpError) throw jpError;
    if (jpResult) {
      await summarizeLaw(jpResult.id, "JP", results);
    }
  } catch (error) {
    console.error("Japan scraper error:", error);
  }

  // --- UAE ---
  try {
    const aeResponse = await fetch(
      "https://u.ae/en/information-and-services/justice-safety-and-the-law"
    );
    const aeHtml = await aeResponse.text();
    const ae$ = cheerio.load(aeHtml);

    const aeTitle = "Alcohol laws in UAE";
    const aeText = ae$("h1, p")
      .slice(0, 5)
      .map((_, el) => ae$(el).text().trim())
      .get()
      .join(" ")
      .slice(0, 2000);

    const { data: aeResult, error: aeError } = await supabase
      .from("country_laws")
      .upsert(
        {
          country_code: "AE",
          category: "alcohol",
          title: aeTitle,
          raw_text: aeText,
          source_name: "UAE Government",
          source_url:
            "https://u.ae/en/information-and-services/justice-safety-and-the-law",
          source_date: new Date().toISOString().split("T")[0],
          last_verified: new Date().toISOString(),
        },
        { onConflict: "country_code,category,title" }
      )
      .select("id")
      .single();

    if (aeError) throw aeError;
    if (aeResult) {
      await summarizeLaw(aeResult.id, "AE", results);
    }
  } catch (error) {
    console.error("UAE scraper error:", error);
  }

  // --- Germany ---
  try {
    const deResponse = await fetch("https://www.bmvi.de/");
    const deHtml = await deResponse.text();
    const de$ = cheerio.load(deHtml);

    const deTitle = "Driving laws in Germany";
    const deText = (de$("title").text() + " " + de$("p").first().text()).slice(
      0,
      2000
    );

    const { data: deResult, error: deError } = await supabase
      .from("country_laws")
      .upsert(
        {
          country_code: "DE",
          category: "driving",
          title: deTitle,
          raw_text: deText,
          source_name: "German Federal Ministry of Transport",
          source_url: "https://www.bmvi.de/",
          source_date: new Date().toISOString().split("T")[0],
          last_verified: new Date().toISOString(),
        },
        { onConflict: "country_code,category,title" }
      )
      .select("id")
      .single();

    if (deError) throw deError;
    if (deResult) {
      await summarizeLaw(deResult.id, "DE", results);
    }
  } catch (error) {
    console.error("Germany scraper error:", error);
  }

  return NextResponse.json({
    status: "ok",
    results,
  });
}
