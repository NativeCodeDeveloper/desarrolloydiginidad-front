import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/formularioSolicitud", priority: 0.95, changeFrequency: "weekly" },
  { path: "/contacto", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.85, changeFrequency: "monthly" },
  { path: "/agendaProfesionales", priority: 0.8, changeFrequency: "daily" },
  { path: "/mision-y-vision", priority: 0.7, changeFrequency: "monthly" },
  { path: "/como-funciona", priority: 0.65, changeFrequency: "monthly" },
  { path: "/terminosCondiciones", priority: 0.35, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
