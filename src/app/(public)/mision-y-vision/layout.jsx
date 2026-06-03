import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mision y vision",
  description:
    "Conoce la mision de Fundacion Desarrollo y Dignidad: facilitar acceso a atencion psicologica cercana y profesional en Santiago Centro.",
  path: "/mision-y-vision",
  keywords: [
    "fundacion desarrollo y dignidad mision",
    "salud mental comunitaria santiago",
    "psicologia santiago centro",
  ],
});

export default function MisionVisionLayout({ children }) {
  return children;
}
