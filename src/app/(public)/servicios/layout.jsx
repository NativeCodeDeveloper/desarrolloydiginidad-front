import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Servicios de atencion psicologica",
  description:
    "Servicios de atencion psicologica presencial y online en Santiago. Acompanamiento profesional para salud mental, bienestar emocional y orientacion familiar.",
  path: "/servicios",
  keywords: [
    "servicios psicologicos santiago",
    "psicoterapia santiago centro",
    "atencion psicologica online",
  ],
});

export default function ServiciosLayout({ children }) {
  return children;
}
