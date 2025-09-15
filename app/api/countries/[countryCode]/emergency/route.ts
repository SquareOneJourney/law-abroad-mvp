import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { countryCode: string } }) {
  try {
    const { countryCode } = params

    const contacts = await sql`
      SELECT 
        ec.id,
        ec.contact_type,
        ec.name,
        ec.phone,
        ec.address,
        ec.email,
        ec.website,
        c.name as country_name
      FROM emergency_contacts ec
      JOIN countries c ON ec.country_id = c.id
      WHERE c.code = ${countryCode.toUpperCase()}
      ORDER BY 
        CASE ec.contact_type 
          WHEN 'police' THEN 1
          WHEN 'medical' THEN 2
          WHEN 'embassy' THEN 3
          WHEN 'tourist_police' THEN 4
          ELSE 5
        END,
        ec.name ASC
    `

    if (contacts.length === 0) {
      return NextResponse.json({ error: "Country not found or no emergency contacts available" }, { status: 404 })
    }

    return NextResponse.json({
      country: contacts[0].country_name,
      countryCode: countryCode.toUpperCase(),
      contacts: contacts.map((contact) => ({
        id: contact.id,
        type: contact.contact_type,
        name: contact.name,
        phone: contact.phone,
        address: contact.address,
        email: contact.email,
        website: contact.website,
      })),
    })
  } catch (error) {
    console.error("Error fetching emergency contacts:", error)
    return NextResponse.json({ error: "Failed to fetch emergency contacts" }, { status: 500 })
  }
}
