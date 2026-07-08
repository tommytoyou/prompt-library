"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Search prompts… e.g. "cold email", "Instagram", "SOP"'
        className="w-full bg-white border border-border text-text placeholder-muted rounded-xl pl-12 pr-28 py-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
}
