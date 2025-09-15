import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing law ID" }, { status: 400 });
    }

    // 1. Fetch law text from Supabase
    const { data: law, error } = await supabase
      .from("country_laws")
      .select("raw_text")
      .eq("id", id)
      .single();

    if (error || !law) {
      console.error("Law fetch error:", error);
      return NextResponse.json(
        { error: "Law not found" },
        { status: 404 }
      );
    }

    // 2. Ask OpenAI to summarize
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant. Summarize the law clearly in one sentence for travelers.",
        },
        {
          role: "user",
          content: law.raw_text,
        },
      ],
      max_tokens: 150,
    });

    const summary =
      completion.choices[0]?.message?.content?.trim() ||
      "No summary generated.";

    // 3. Update Supabase with the summary
    await supabase
      .from("country_laws")
      .update({ summary })
      .eq("id", id);

    return NextResponse.json({ id, summary });
  } catch (err) {
    console.error("Summarize error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
