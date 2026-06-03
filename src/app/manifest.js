import { seoConfig } from "@/lib/seo";

export default function manifest() {
  return {
    name: seoConfig.name,
    short_name: seoConfig.shortName,
    description: seoConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "es-CL",
    icons: [
      {
        src: "/Aclogopro.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Aclogopro.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
