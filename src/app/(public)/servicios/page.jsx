"use client";

import Link from "next/link";
import { Brain, HeartHandshake, Users } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const tratamientos = [
  {
    title: "Atencion Psicologica",
    subtitle: "Presencial y online",
    description: "Sesiones de psicologia para ninos, jovenes y adultos, con acompanamiento profesional orientado al bienestar emocional, la salud mental y el desarrollo personal.",
    icon: Brain,
    colorClass: "bg-indigo-50 text-indigo-600",
    linkInfo: "/formularioSolicitud",
  },
  {
    title: "Terapia Familiar",
    subtitle: "Orientacion y contencion",
    description: "Espacios de orientacion para familias que buscan fortalecer la comunicacion, acompanar procesos emocionales y abordar dificultades relacionales con apoyo clinico.",
    icon: Users,
    colorClass: "bg-slate-100 text-slate-700",
    linkInfo: "/formularioSolicitud",
  },
  {
    title: "Terapeuta en Formacion",
    subtitle: "Acceso a bajo costo",
    description: "Alternativa de atencion psicologica con terapeutas en formacion, supervisada y pensada para facilitar el acceso oportuno a apoyo emocional en Santiago.",
    icon: HeartHandshake,
    colorClass: "bg-indigo-50 text-indigo-600",
    linkInfo: "/formularioSolicitud",
  },
];

export default function ServicioPage() {
  return (
    <main className="bg-[#f8f9fa] text-slate-900 pt-32 pb-32 min-h-screen font-sans">

      {/* Header Section */}
      <section className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10 mb-20 lg:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-medium tracking-tight text-slate-900 leading-[1.05] mb-6">
              Nuestros<br />
              Servicios
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 font-light max-w-lg">
              Atencion psicologica en Santiago Centro con modalidad presencial y online.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayClass="delay-200">
          <Link
            href="/formularioSolicitud"
            className="inline-flex rounded-full border border-slate-900 px-8 py-3.5 text-sm md:text-base font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white whitespace-nowrap"
          >
            Agendar Evaluación
          </Link>
        </RevealOnScroll>
      </section>

      {/* Treatments Grid - Staggered layout */}
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-3 lg:gap-14 lg:px-10 mb-32 items-start">
        {tratamientos.map((tratamiento, index) => {
          const Icon = tratamiento.icon;
          // Apply a staggered offset for middle items
          const staggerClass = index === 1 ? "lg:mt-[100px]" : index === 2 ? "lg:mt-[50px]" : "";

          return (
            <RevealOnScroll key={index} delayClass={`delay-${index * 100}`}>
              <article className={`group relative flex flex-col h-full bg-transparent ${staggerClass}`}>
                {/* Number indicator above the card mimicking the reference */}
                <span className="text-slate-500 font-medium text-lg mb-4 block">
                  0{index + 1}
                </span>

                {/* Visual Area - Clean soft background instead of aggressive borders */}
                <div className={`
                  w-full rounded-[2rem] bg-white p-16 flex items-center justify-center mb-8
                  transition-transform duration-700 ease-out group-hover:-translate-y-3
                `}>
                  <div className={`inline-flex h-24 w-24 items-center justify-center rounded-3xl ${tratamiento.colorClass}`}>
                    <Icon strokeWidth={1} className={`h-14 w-14 ${index === 1 ? 'animate-icon-beat' : 'animate-icon-bounce-slow'}`} />
                  </div>
                </div>

                {/* Minimal Typography below */}
                <h2 className="text-xl md:text-2xl font-medium text-slate-900 mb-2">
                  {tratamiento.title}
                </h2>
                <h3 className="text-[13px] md:text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
                  {tratamiento.subtitle}
                </h3>

                <p className="text-slate-500 font-light leading-relaxed text-[15px] mb-8">
                  {tratamiento.description}
                </p>

                <Link
                  href={tratamiento.linkInfo}
                  className="flex w-fit items-center border-b border-transparent pb-1 text-sm font-medium text-slate-900 transition-all hover:border-indigo-600 hover:text-indigo-600"
                >
                  Solicitar atencion
                </Link>
              </article>
            </RevealOnScroll>
          );
        })}
      </section>

      {/* Bottom Conversion Block - Redesigned cleanly */}
      <section className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10 mt-20">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between rounded-[2rem] bg-white p-12 md:p-20">
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4">
                Agenda atencion psicologica.
              </h3>
              <p className="text-slate-500 text-lg font-light">
                Completa la solicitud y selecciona los dias y horarios en los que puedes asistir a sesion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/formularioSolicitud"
                className="rounded-full border border-slate-900 px-8 py-3.5 text-sm md:text-base font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white text-center"
              >
                Solicitar atencion
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

    </main>
  );
}
