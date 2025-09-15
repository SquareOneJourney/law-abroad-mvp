import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function testConnection() {
  try {
    console.log("[v0] Testing database connection...")

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] Database connected successfully:", result[0])

    // Check if countries exist
    const countries = await sql`SELECT COUNT(*) as count FROM countries`
    console.log("[v0] Countries in database:", countries[0].count)

    // Check if FAQs exist
    const faqs = await sql`SELECT COUNT(*) as count FROM country_faqs`
    console.log("[v0] FAQs in database:", faqs[0].count)

    // Check if laws exist
    const laws = await sql`SELECT COUNT(*) as count FROM country_laws`
    console.log("[v0] Laws in database:", laws[0].count)
  } catch (error) {
    console.error("[v0] Database connection error:", error)
  }
}

testConnection()
