// app/api/laws/countrycodes/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("countries")
      .select("id, name, code");

    if (error) throw error;

    // Optionally join with country_laws to count laws
    const { data: laws, error: lawError } = await supabase
      .from("country_laws")
      .select("country_id");

    if (lawError) throw lawError;

    // Count laws per country
    const lawCounts: Record<number, number> = {};
    (laws || []).forEach((law) => {
      lawCounts[law.country_id] = (lawCounts[law.country_id] || 0) + 1;
    });

    const enriched = (data || []).map((c) => ({
      ...c,
      law_count: lawCounts[c.id] || 0,
    }));

    return NextResponse.json(enriched);
  } catch (err: any) {
    console.error("Error fetching country codes:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Failed to load countries" },
      { status: 500 }
    );
  }
}
