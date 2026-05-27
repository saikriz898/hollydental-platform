import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hollyhilldental.ie";
  const routes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/contact",
    "/blog",
    "/testimonials",
    "/laser-treatment",
    "/teeth-whitening",
    "/cosmetic-dentistry",
    "/botox",
    "/lip-fillers",
    "/hydrafacial",
    "/skin-rejuvenation",
  ];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
