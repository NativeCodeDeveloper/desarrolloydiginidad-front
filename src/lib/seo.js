export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://desarrolloydignidad.cl"
).replace(/\/$/, "");

export const seoConfig = {
  name: "Fundacion Desarrollo y Dignidad",
  legalName: "Fundacion Desarrollo y Dignidad",
  shortName: "Desarrollo y Dignidad",
  description:
    "Atencion psicologica presencial y online en Santiago Centro. Agenda sesiones con psicologos y terapeutas en formacion en Fundacion Desarrollo y Dignidad.",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Agustinas 1357 oficina 73-A, Santiago, Chile",
  city: "Santiago",
  region: "Region Metropolitana",
  country: "CL",
  locale: "es_CL",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  image: "/logoagendaclinica.png",
  logo: "/logoagendaclinica.png",
  keywords: [
    "desarrollo y dignidad",
    "fundacion desarrollo y dignidad",
    "atencion psicologica en santiago centro",
    "atencion psicologica en santiago",
    "psicologo santiago centro",
    "psicologa santiago centro",
    "psicologos en santiago",
    "terapia psicologica santiago",
    "consulta psicologica santiago",
    "psicologia infantil santiago",
    "salud mental santiago centro",
    "terapeuta en formacion santiago",
    "agendar psicologo santiago",
    "psicoterapia santiago centro",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description = seoConfig.description,
  path = "/",
  keywords = [],
  image = seoConfig.image,
  noIndex = false,
} = {}) {
  const url = absoluteUrl(path);
  const fullTitle = title
    ? `${title} | ${seoConfig.shortName}`
    : `${seoConfig.name} | Atencion psicologica en Santiago Centro`;

  return {
    title: fullTitle,
    description,
    keywords: [...seoConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: seoConfig.name,
      locale: seoConfig.locale,
      type: "website",
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: `${seoConfig.name} - atencion psicologica en Santiago Centro`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export function organizationJsonLd() {
  const sameAs = [
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL,
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL,
  ].filter(Boolean);

  const contactPoint = [seoConfig.phone, seoConfig.email].some(Boolean)
    ? {
        "@type": "ContactPoint",
        telephone: seoConfig.phone || undefined,
        email: seoConfig.email || undefined,
        contactType: "Atencion de pacientes",
        areaServed: "CL",
        availableLanguage: ["Spanish"],
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${siteUrl}/#clinica`,
    name: seoConfig.name,
    legalName: seoConfig.legalName,
    url: siteUrl,
    logo: absoluteUrl(seoConfig.logo),
    image: absoluteUrl(seoConfig.image),
    description: seoConfig.description,
    telephone: seoConfig.phone || undefined,
    email: seoConfig.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Agustinas 1357 oficina 73-A",
      addressLocality: seoConfig.city,
      addressRegion: seoConfig.region,
      addressCountry: seoConfig.country,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Santiago",
      },
      {
        "@type": "Place",
        name: "Santiago Centro",
      },
    ],
    medicalSpecialty: ["Psychiatric", "PsychologicalTreatment"],
    knowsAbout: [
      "Atencion psicologica",
      "Psicologia infantil",
      "Psicoterapia",
      "Salud mental",
      "Terapia online",
      "Terapia presencial",
    ],
    priceRange: "$$",
    contactPoint,
    sameAs,
  };
}
