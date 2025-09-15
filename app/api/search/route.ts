// app/api/search/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

type LawRecord = {
  id: string;
  title: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  raw_text: string | null;
  category: string;
  country_code: string;
  region?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  last_verified?: string | null;
  countries?: { name: string }[]; // 👈 array, not object
};

// 🔎 Country-specific keyword-based search
export async function POST(request: Request) {
  try {
    const { query, countryCode } = await request.json();

    if (!query || !countryCode) {
      return NextResponse.json(
        { error: "Query and country code are required" },
        { status: 400 }
      );
    }

    const { data: laws, error } = await supabase
      .from("laws")
      .select(
        `
        id,
        title,
        summary,
        severity,
        raw_text,
        category,
        country_code,
        countries ( name )
      `
      )
      .eq("country_code", countryCode.toUpperCase())
      .or(
        `summary.ilike.%${query}%,raw_text.ilike.%${query}%,category.ilike.%${query}%`
      )
      .order("severity", { ascending: true })
      .limit(5);

    if (error) throw error;

    const typedLaws = (laws || []) as LawRecord[];

    let answer = "UNCLEAR";
    let explanation = "No specific information found for your query.";

    if (typedLaws.length > 0) {
      const highestSeverity = typedLaws[0].severity;
      const countryName =
        typedLaws[0].countries?.[0]?.name || countryCode.toUpperCase();

      if (highestSeverity === "critical" || highestSeverity === "high") {
        answer = "NO - HIGH RISK";
        explanation = `This activity may be illegal or highly restricted in ${countryName}. ${typedLaws[0].summary}`;
      } else if (highestSeverity === "medium") {
        answer = "CAUTION REQUIRED";
        explanation = `This activity has restrictions in ${countryName}. ${typedLaws[0].summary}`;
      } else {
        answer = "GENERALLY ALLOWED";
        explanation = `This activity appears to be allowed with normal precautions in ${countryName}. ${typedLaws[0].summary}`;
      }
    }

    return NextResponse.json({
      query,
      country: typedLaws[0]?.countries?.[0]?.name || "Unknown",
      countryCode: countryCode.toUpperCase(),
      answer,
      explanation,
      relatedLaws: typedLaws.map((law) => ({
        id: law.id,
        title: law.title,
        category: law.category,
        summary: law.summary,
        severity: law.severity,
        details: law.raw_text,
      })),
    });
  } catch (error) {
    console.error("Error processing search:", error);
    return NextResponse.json(
      { error: "Failed to process search query" },
      { status: 500 }
    );
  }
}

// 🌍 Global search with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");
    const region = searchParams.get("region");

    let supabaseQuery = supabase
      .from("laws")
      .select(
        `
        id,
        title,
        category,
        summary,
        severity,
        raw_text,
        source_name,
        source_url,
        last_verified,
        country_code,
        region,
        countries ( name )
      `
      )
      .limit(50);

    if (country) supabaseQuery = supabaseQuery.eq("country_code", country);
    if (category) supabaseQuery = supabaseQuery.eq("category", category);
    if (severity) supabaseQuery = supabaseQuery.eq("severity", severity);
    if (region && region !== "all")
      supabaseQuery = supabaseQuery.eq("region", region);

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `country_code.ilike.%${query}%,category.ilike.%${query}%,title.ilike.%${query}%,summary.ilike.%${query}%,raw_text.ilike.%${query}%,region.ilike.%${query}%`
      );
    }

    const { data: laws, error } = await supabaseQuery.order("last_verified", {
      ascending: false,
    });

    if (error) throw error;

    const typedLaws = (laws || []) as LawRecord[];

    return NextResponse.json({
      query,
      filters: { country, category, severity, region },
      results: typedLaws.map((law) => ({
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
        country_name: law.countries?.[0]?.name || "Unknown", // 👈 array safe access
      })),
      total: typedLaws.length,
    });
  } catch (error) {
    console.error("Error processing global search:", error);
    return NextResponse.json(
      { error: "Failed to process search query" },
      { status: 500 }
    );
  }
}
