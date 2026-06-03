import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Solicitud de atencion psicologica en Santiago Centro",
  description:
    "Solicita atencion psicologica presencial u online en Fundacion Desarrollo y Dignidad, Agustinas 1357 oficina 73-A, Santiago. Sesiones con psicologos y terapeutas en formacion.",
  path: "/formularioSolicitud",
  keywords: [
    "solicitud de atencion psicologica",
    "fundacion desarrollo y dignidad agustinas",
    "psicologo agustinas santiago",
    "terapia presencial santiago centro",
  ],
});

export default function FormularioSolicitudLayout({ children }) {
  return children;
}
