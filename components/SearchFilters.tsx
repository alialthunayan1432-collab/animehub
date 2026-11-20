"use client";

import { useRouter, usePathname } from "next/navigation";

const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

const sorts = [
  { value: "POPULARITY_DESC", label: "Most Popular" },
  { value: "SCORE_DESC", label: "Highest Rated" },
  { value: "START_DATE_DESC", label: "Newest" },
  { value: "TITLE_ROMAJI", label: "A-Z" },
];

export default function SearchFilters({
  currentYear,
  currentSort,
}: {
  currentYear: string;
  currentSort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Year Filter */}
      <select
        value={currentYear}
        onChange={(e) => updateFilter("year", e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Sort Filter */}
      <select
        value={currentSort}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}