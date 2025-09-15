// app/api/seed/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST() {
  try {
    // Insert sample laws
    const { data: result, error } = await supabase
      .from("country_laws")
      .insert([
        {
          id: crypto.randomUUID(),
          country_code: "JP",
          category: "drugs",
          title: "Prescription meds import",
          raw_text:
            "Some medicines require a Yakkan Shoumei import certificate before entry.",
          source_name: "Japan Ministry of Health, Labour and Welfare",
          source_url:
            "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000185890.html",
          source_date: "2025-03-10",
          last_verified: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          country_code: "AE",
          category: "alcohol",
          title: "Alcohol consumption in UAE",
          raw_text:
            "Alcohol consumption is allowed in licensed venues but prohibited in public places.",
          source_name: "UAE Government Portal",
          source_url:
            "https://u.ae/en/information-and-services/justice-safety-and-the-law",
          source_date: "2025-01-15",
          last_verified: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("id");

    if (error) throw error;

    const seeded: { id: string; summary: string }[] = [];

    // Trigger summarize for each inserted law
    for (const row of result) {
      try {
        const summarizeResponse = await fetch(
          `${
            process.env.VERCEL_URL
              ? "https://" + process.env.VERCEL_URL
              : "http://localhost:3000"
          }/api/summarize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: row.id }),
          }
        );

        const summarizeData = await summarizeResponse.json();

        if (summarizeData.error) {
          console.error(
            `Summarize error for ${row.id}:`,
            summarizeData.error
          );
          seeded.push({ id: row.id, summary: "Summary generation failed" });
        } else {
          seeded.push({ id: row.id, summary: summarizeData.summary });
        }
      } catch (summarizeError) {
        console.error(
          `Summarize request error for ${row.id}:`,
          summarizeError
        );
        seeded.push({ id: row.id, summary: "Summary generation failed" });
      }
    }

    return NextResponse.json({
      status: "ok",
      seeded,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
