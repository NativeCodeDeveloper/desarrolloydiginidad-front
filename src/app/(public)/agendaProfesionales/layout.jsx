import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Agenda de psicologos en Santiago",
  description:
    "Revisa profesionales disponibles y agenda atencion psicologica con Fundacion Desarrollo y Dignidad en Santiago Centro.",
  path: "/agendaProfesionales",
  keywords: [
    "agenda psicologos santiago",
    "reservar psicologo santiago centro",
    "hora psicologica santiago",
  ],
});

export default function AgendaProfesionalesLayout({ children }) {
  return children;
}
