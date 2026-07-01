import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BrowseClient from "@/components/BrowseClient";
import categoriesData from "@/data/categories.json";
import promptsData from "@/data/prompts.json";
import { Category, Prompt } from "@/types";

export default function BrowsePage() {
  return (
    <>
      <Nav />
      <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
        <BrowseClient
          allPrompts={promptsData as Prompt[]}
          allCategories={categoriesData as Category[]}
        />
      </Suspense>
      <Footer />
    </>
  );
}
