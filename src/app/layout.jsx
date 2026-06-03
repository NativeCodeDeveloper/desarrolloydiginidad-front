import "./globals.css";
import { AnimatedLayout } from "@/Componentes/AnimatedLayout";
import AgendaProvider from "@/ContextosGlobales/AgendaContext";
import { Inter, Outfit, Lora } from "next/font/google";
import { organizationJsonLd, pageMetadata, seoConfig, siteUrl } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(),
  applicationName: seoConfig.name,
  authors: [{ name: seoConfig.name, url: siteUrl }],
  creator: seoConfig.name,
  publisher: seoConfig.name,
  category: "healthcare",
  classification: "Atencion psicologica y salud mental",
  icons: {
    icon: "/Aclogopro.png",
    shortcut: "/Aclogopro.png",
    apple: "/Aclogopro.png",
  },
  appleWebApp: {
    capable: true,
    title: seoConfig.shortName,
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = organizationJsonLd();

  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          AgendaProvider DEBE envolver AnimatedLayout (no estar dentro).
          AnimatedLayout desmonta/remonta sus hijos en cada navegación
          (usa key={pathname} + AnimatePresence). Si AgendaProvider
          estuviera adentro, su estado (fecha, hora, servicio) se reiniciaría
          en cada cambio de ruta, perdiendo los datos entre el calendario y el formulario.
        */}
        <AgendaProvider>
          <AnimatedLayout>
            {children}
          </AnimatedLayout>
        </AgendaProvider>
      </body>
    </html>
  );
}
