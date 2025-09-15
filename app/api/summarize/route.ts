import OpenAI from "openai"
import { sql } from "@/lib/db"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    const laws = await sql`
      SELECT raw_text FROM country_laws WHERE id = ${id};
    `

    if (laws.length === 0) {
      return new Response(JSON.stringify({ error: "Law not found" }), { status: 404 })
    }

    const rawText = laws[0].raw_text

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes official law text into clear, traveler-friendly language.",
        },
        { role: "user", content: rawText },
      ],
    })

    const summary = completion.choices[0].message?.content || "No summary available"

    await sql`
      UPDATE country_laws
      SET summary = ${summary}, updated_at = now()
      WHERE id = ${id};
    `

    return new Response(JSON.stringify({ id, summary }), { status: 200 })
  } catch (err: any) {
    console.error("Error in summarize:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
