"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Law {
  id: number;
  title: string;
  category: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  raw_text: string;
  source_name: string;
  source_url: string;
  last_verified: string;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface CountryLawsResponse {
  country: string;
  countryCode: string;
  laws: Law[];
}

export default function CountryDetailPage() {
  const params = useParams();
  const code = params.countrycode as string;

  const [data, setData] = useState<CountryLawsResponse | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch laws
  useEffect(() => {
    const fetchCountryLaws = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/laws/${code}`);
        if (!res.ok) throw new Error("Failed to fetch laws");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading laws");
      } finally {
        setLoading(false);
      }
    };

    if (code) fetchCountryLaws();
  }, [code]);

  // fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`/api/countries/${code}/faqs`);
        if (!res.ok) return; // don’t block page if FAQs are missing
        const result = await res.json();
        setFaqs(result || []);
      } catch {
        // ignore FAQ errors
      }
    };

    if (code) fetchFaqs();
  }, [code]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return <p className="p-6">No data available.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back link */}
        <div>
          <Button variant="ghost" asChild>
            <Link href="/countries" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Countries
            </Link>
          </Button>
        </div>

        {/* Country Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.country}</h1>
          <p className="text-gray-600">Legal essentials for travelers to {data.country}</p>
        </div>

        {/* Laws Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Key Laws</h2>
          <div className="space-y-4">
            {data.laws.map((law) => (
              <Card key={law.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{law.category}</CardTitle>
                    <Badge>{law.severity}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800">{law.summary}</p>
                  {law.raw_text && (
                    <p className="text-sm text-gray-600 mt-2">{law.raw_text}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Traveler FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
