// app/countries/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Country = {
  id: number;
  name: string;
  code: string;
  law_count: number;
};

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("/api/laws/countrycodes");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Countries with Laws</h1>
      <ul className="space-y-2">
        {countries.map((c) => (
          <li
            key={c.id}
            className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
          >
            <Link href={`/countries/${c.code}`} className="font-medium text-blue-600 hover:underline">
              {c.name} ({c.code})
            </Link>
            <span className="text-gray-600">{c.law_count} laws</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
