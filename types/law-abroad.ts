export interface Country {
  id: number
  name: string
  code: string
}

export interface LawCategory {
  id: number
  name: string
  description: string
}

export interface LawSubcategory {
  id: number
  categoryId: number
  name: string
  description: string
}

export interface CountryLaw {
  id: string
  title?: string
  category: string
  summary: string
  severity: "critical" | "high" | "medium" | "low" // Updated to match requirements
  raw_text?: string
  source_name?: string
  source_url?: string
  last_verified?: string
  // Legacy fields for backward compatibility
  categoryDescription?: string
  subcategory?: string
  subcategoryDescription?: string
  details?: string
  scenario?: string
  redFlagAlert?: string
  culturalContext?: string
  sourceUrl?: string
}

export interface EmergencyContact {
  id: number
  type: string
  name: string
  phone?: string
  address?: string
  email?: string
  website?: string
}

export interface CountryFAQ {
  id: number
  question: string
  answer: string
  category: string
  priority: number
}

export interface SearchResult {
  query: string
  country: string
  countryCode: string
  answer: string
  explanation: string
  relatedLaws: CountryLaw[]
}

export interface FAQ {
  id: number
  category: string
  question: string
  answer: string
  severity: "info" | "warning" | "critical" // Updated severity levels
  relatedLaws: number[]
}
