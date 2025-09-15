import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"

interface FAQ {
  id: number
  question: string
  answer: string
  priority: number
  category: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  countryName: string
}

export function FAQSection({ faqs, countryName }: FAQSectionProps) {
  // Sort FAQs by priority (highest first)
  const sortedFAQs = faqs.sort((a, b) => b.priority - a.priority)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          Top Questions About {countryName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedFAQs.map((faq) => (
          <div key={faq.id} className="border-l-4 border-blue-200 pl-4">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {faq.category}
              </Badge>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
            <p className="text-sm text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
