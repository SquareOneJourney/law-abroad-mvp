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

    // Fetch FAQs
    const { data: faqs, error: faqsError } = await supabase
      .from("country_faqs")
      .select("id, question, answer")
      .eq("country_id", country.id);

    if (faqsError) throw faqsError;

    return NextResponse.json(faqs || []);
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
