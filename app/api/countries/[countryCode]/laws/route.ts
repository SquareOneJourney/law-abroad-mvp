// app/api/countries/[countryCode]/laws/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;

    // 1. Get the country
    const { data: country, error: countryError } = await supabase
      .from("countries")
      .select("id, name, code")
      .eq("code", countryCode.toUpperCase())
      .single();

    if (countryError || !country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      );
    }

    // 2. Get laws for that country, with category info
    const { data: laws, error: lawsError } = await supabase
      .from("country_laws")
      .select(
        `
        id,
        summary,
        severity,
        details,
        law_categories (
          name,
          description
        )
      `
      )
      .eq("country_id", country.id);

    if (lawsError) {
      throw lawsError;
    }

    if (!laws || laws.length === 0) {
      return NextResponse.json(
        { error: "No laws available for this country" },
        { status: 404 }
      );
    }

    // 3. Shape into frontend format
    return NextResponse.json({
      country: country.name,
      countryCode: country.code,
      laws: laws.map((law) => {
        let category: { name?: string; description?: string } | null = null;

        if (Array.isArray(law.law_categories)) {
          category = law.law_categories[0] || null;
        } else if (law.law_categories) {
          category = law.law_categories;
        }

        return {
          id: law.id,
          category: category?.name || "General",
          categoryDescription: category?.description || "",
          summary: law.summary,
          severity: law.severity,
          details: law.details,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching country laws:", error);
    return NextResponse.json(
      { error: "Failed to fetch country laws" },
      { status: 500 }
    );
  }
}
