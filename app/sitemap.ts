import { MetadataRoute } from "next";
import promptsData from "@/data/prompts.json";
import { Prompt } from "@/types";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://promptlibrary.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const promptRoutes = (promptsData as Prompt[]).map((p) => ({
    url: `${base}/prompts/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/browse`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...promptRoutes,
  ];
}
