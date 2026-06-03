import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Como funciona la atencion psicologica",
  description:
    "Conoce como solicitar atencion psicologica presencial u online en Fundacion Desarrollo y Dignidad, Santiago Centro.",
  path: "/como-funciona",
  keywords: [
    "como agendar psicologo santiago",
    "atencion psicologica presencial",
    "atencion psicologica online santiago",
  ],
});

export default function ComoFuncionaLayout({ children }) {
  return children;
}
