import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;

    // 1. Get country id by code
    const { data: country, error: countryError } = await supabase
      .from("countries")
      .select("id")
      .eq("code", countryCode.toUpperCase())
      .single();

    if (countryError || !country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // 2. Get emergency contacts for that country
    const { data: contacts, error: contactsError } = await supabase
      .from("emergency_contacts")
      .select("id, service, phone")
      .eq("country_id", country.id);

    if (contactsError) throw contactsError;

    return NextResponse.json(contacts || []);
  } catch (err) {
    console.error("Error fetching emergency contacts:", err);
    return NextResponse.json({ error: "Failed to fetch emergency contacts" }, { status: 500 });
  }
}
