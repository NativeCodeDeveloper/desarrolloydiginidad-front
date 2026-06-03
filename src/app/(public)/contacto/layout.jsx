import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto y ubicacion en Santiago Centro",
  description:
    "Contacta a Fundacion Desarrollo y Dignidad para atencion psicologica en Santiago Centro. Ubicacion en Agustinas 1357 oficina 73-A, Santiago.",
  path: "/contacto",
  keywords: [
    "contacto desarrollo y dignidad",
    "ubicacion desarrollo y dignidad",
    "atencion psicologica agustinas santiago",
  ],
});

export default function ContactoLayout({ children }) {
  return children;
}
