import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;

    // Get country ID
    const { data: country, error: countryError } = await supabase
      .from("countries")
      .select("id")
      .eq("code", countryCode.toUpperCase())
      .single();

    if (countryError || !country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // Fetch laws + category
    const { data: laws, error: lawsError } = await supabase
      .from("country_laws")
      .select("id, summary, severity, details, law_categories(name)")
      .eq("country_id", country.id);

    if (lawsError) throw lawsError;

    return NextResponse.json(laws || []);
  } catch (err) {
    console.error("Error fetching country laws:", err);
    return NextResponse.json({ error: "Failed to fetch country laws" }, { status: 500 });
  }
}
