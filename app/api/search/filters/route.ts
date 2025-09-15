// app/api/search/filters/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

type LawRecord = {
  id: string;
  title: string;
  category: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  raw_text: string | null;
  region?: string | null;
  country_code: string;
  countries?: { name: string }[]; // ✅ array, not single object
};

export async function GET() {
  try {
    // Get unique categories
    const { data: categories, error: catError } = await supabase
      .from("laws")
      .select("category")
      .not("category", "is", null);

    if (catError) throw catError;

    // Get unique severities
    const { data: severities, error: sevError } = await supabase
      .from("laws")
      .select("severity")
      .not("severity", "is", null);

    if (sevError) throw sevError;

    // Get unique regions
    const { data: regions, error: regError } = await supabase
      .from("laws")
      .select("region")
      .not("region", "is", null);

    if (regError) throw regError;

    // Get countries with names
    const { data: countries, error: countryError } = await supabase
      .from("laws")
      .select("country_code, countries ( name )");

    if (countryError) throw countryError;

    // Format distinct lists
    const uniqueCategories = Array.from(
      new Set((categories || []).map((c) => c.category))
    );
    const uniqueSeverities = Array.from(
      new Set((severities || []).map((s) => s.severity))
    );
    const uniqueRegions = Array.from(
      new Set((regions || []).map((r) => r.region).filter(Boolean))
    );
    const uniqueCountries = Array.from(
      new Map(
        (countries || []).map((c) => [
          c.country_code,
          {
            code: c.country_code,
            name: c.countries?.[0]?.name || c.country_code, // ✅ unwrap array safely
          },
        ])
      ).values()
    );

    return NextResponse.json({
      categories: uniqueCategories,
      severities: uniqueSeverities,
      regions: uniqueRegions,
      countries: uniqueCountries,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
