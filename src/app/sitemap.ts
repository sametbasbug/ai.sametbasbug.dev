import type { MetadataRoute } from "next";
import { models } from "@/data/models";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, priority: 1 },
    { url: `${SITE_URL}/karsilastir/`, lastModified, priority: 0.8 },
    { url: `${SITE_URL}/saglayicilar/`, lastModified, priority: 0.6 },
    { url: `${SITE_URL}/hakkinda/`, lastModified, priority: 0.4 },
  ];

  const modelPages: MetadataRoute.Sitemap = models.map((model) => ({
    url: `${SITE_URL}/modeller/${model.slug}/`,
    lastModified: new Date(model.source.verifiedAt),
    priority: 0.7,
  }));

  return [...pages, ...modelPages];
}
