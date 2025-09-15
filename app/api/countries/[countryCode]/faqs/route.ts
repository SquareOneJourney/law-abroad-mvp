// app/api/countries/[countryCode]/faqs/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;

    // 1. Get the country id by its code
    const { data: country, error: countryError } = await supabase
      .from("countries")
      .select("id")
      .eq("code", countryCode.toUpperCase())
      .single();

    if (countryError || !country) {
      throw new Error("Country not found");
    }

    // 2. Fetch FAQs for that country
    const { data: faqs, error: faqError } = await supabase
      .from("country_faqs")
      .select("id, question, answer")
      .eq("country_id", country.id);

    if (faqError) throw faqError;

    return NextResponse.json(faqs || []);
  } catch (err: any) {
    console.error("Error fetching country FAQs:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Failed to load FAQs" },
      { status: 500 }
    );
  }
}
