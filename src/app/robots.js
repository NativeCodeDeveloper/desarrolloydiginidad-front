import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/sign-in/",
          "/no-access",
          "/carrito",
          "/comprobantePago",
          "/pagoAprobado",
          "/pagoEnProceso",
          "/pagoRechazado",
          "/programa",
          "/ultraformer",
          "/catalogo",
          "/producto/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
