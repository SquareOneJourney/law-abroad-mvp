// app/api/seed-non-us/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST() {
  try {
    // --- 1. Seed law categories ---
    const { error: categoriesError } = await supabase
      .from("law_categories")
      .upsert(
        [
          { name: "Drugs & Alcohol", description: "Regulations on controlled substances, alcohol, etc." },
          { name: "Customs & Import", description: "Rules for bringing goods in/out of the country." },
          { name: "Driving Laws", description: "Traffic regulations, licensing, vehicles." },
          { name: "Visa & Immigration", description: "Entry, residency, and visa rules." },
          { name: "Public Behavior", description: "Dress code, speech, assembly, public order." },
          { name: "Technology & Internet", description: "Internet usage, VPNs, digital communication." },
        ],
        { onConflict: "name" }
      );

    if (categoriesError) throw categoriesError;

    // --- 2. Seed countries ---
    const { error: countryError } = await supabase
      .from("countries")
      .upsert(
        [
          { code: "GB", name: "United Kingdom" },
          { code: "JP", name: "Japan" },
          { code: "DE", name: "Germany" },
          { code: "FR", name: "France" },
        ],
        { onConflict: "code" }
      );

    if (countryError) throw countryError;

    // --- 3. Fetch IDs for mapping ---
    const { data: countries } = await supabase
      .from("countries")
      .select("id, code");

    const { data: categories } = await supabase
      .from("law_categories")
      .select("id, name");

    if (!countries || !categories) throw new Error("Missing countries or categories");

    const countryMap: Record<string, number> = {};
    countries.forEach((c) => (countryMap[c.code] = c.id));

    const categoryMap: Record<string, number> = {};
    categories.forEach((cat) => (categoryMap[cat.name] = cat.id));

    // --- 4. Seed laws using maps ---
    const { error: lawsError } = await supabase.from("country_laws").upsert(
      [
        {
          country_id: countryMap["GB"],
          category_id: categoryMap["Driving Laws"],
          summary: "Drive on the left-hand side of the road.",
          severity: "medium",
          details: "In the UK, all vehicles drive on the left. Steering wheels are on the right side.",
        },
        {
          country_id: countryMap["JP"],
          category_id: categoryMap["Public Behavior"],
          summary: "No drinking alcohol in public spaces.",
          severity: "low",
          details: "Public drinking in Japan is discouraged. Fines may apply during festivals or crowded events.",
        },
        {
          country_id: countryMap["DE"],
          category_id: categoryMap["Drugs & Alcohol"],
          summary: "Blood alcohol limit is 0.05% for drivers.",
          severity: "medium",
          details: "Germany enforces strict drunk driving laws. New drivers have a zero-tolerance policy.",
        },
      ],
      { onConflict: "id" }
    );

    if (lawsError) throw lawsError;

    return NextResponse.json({ success: true, message: "Non-US seed completed" });
  } catch (error) {
    console.error("Error seeding non-US data:", error);
    return NextResponse.json(
      { error: "Failed to seed non-US data" },
      { status: 500 }
    );
  }
}
