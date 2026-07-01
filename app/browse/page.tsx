import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BrowseClient from "@/components/BrowseClient";
import categoriesData from "@/data/categories.json";
import promptsData from "@/data/prompts.json";
import { Category, Prompt } from "@/types";

export default function BrowsePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return (
    <>
      <Nav />
      <BrowseClient
        allPrompts={promptsData as Prompt[]}
        allCategories={categoriesData as Category[]}
        initialCategory={searchParams.category ?? null}
      />
      <Footer />
    </>
  );
}
