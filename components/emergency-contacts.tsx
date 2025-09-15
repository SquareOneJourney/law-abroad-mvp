"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, ExternalLink, Shield, Heart, Building } from "lucide-react"
import type { EmergencyContact } from "@/types/law-abroad"

interface EmergencyContactsProps {
  countryCode: string
}

const contactTypeConfig = {
  police: {
    icon: Shield,
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200",
    label: "Police",
  },
  medical: {
    icon: Heart,
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200",
    label: "Medical",
  },
  embassy: {
    icon: Building,
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200",
    label: "Embassy",
  },
  tourist_police: {
    icon: Shield,
    color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200",
    label: "Tourist Police",
  },
}

export function EmergencyContacts({ countryCode }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState("")

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/countries/${countryCode}/emergency`)
        if (response.ok) {
          const data = await response.json()
          setContacts(data.contacts)
          setCountry(data.country)
        }
      } catch (error) {
        console.error("Error fetching emergency contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    if (countryCode) {
      fetchContacts()
    }
  }, [countryCode])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading emergency contacts...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <Phone className="h-5 w-5" />
            Emergency Contacts - {country}
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            Important numbers to save in your phone before traveling
          </CardDescription>
        </CardHeader>
      </Card>

      {contacts.length > 0 ? (
        contacts.map((contact) => {
          const config = contactTypeConfig[contact.type as keyof typeof contactTypeConfig] || contactTypeConfig.police
          const Icon = config.icon

          return (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mt-2 ${config.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.address}</p>
                      </div>
                    </div>
                  )}

                  {contact.website && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">No emergency contacts found for this country.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
