"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

interface Country {
  id: number;
  name: string;
  code: string;
  law_count: number;
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/laws/countrycodes");
        if (response.ok) {
          const data = await response.json();
          console.log("[CountrySelector] received data:", data);
          setCountries(data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading countries..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Failed to load countries" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedCountry} onValueChange={onCountryChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.id} value={country.code}>
            {country.name} ({country.law_count} law{country.law_count !== 1 ? "s" : ""})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
