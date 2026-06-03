import Portada from "@/app/(public)/portada/page";
import Seccion1 from "@/app/(public)/seccion1/page";
import Seccion2 from "@/app/(public)/seccion2/page";
import Seccion3 from "@/app/(public)/seccion3/page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Atencion psicologica en Santiago Centro",
  description:
    "Fundacion Desarrollo y Dignidad ofrece atencion psicologica presencial y online en Santiago Centro. Solicita hora para psicologia, terapia y acompanamiento emocional.",
  path: "/",
});

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Portada />
      <Seccion1 />
      <Seccion2 />
      <Seccion3 />
    </main>
  );
}
