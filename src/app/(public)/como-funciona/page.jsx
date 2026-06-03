"use client";

import RevealOnScroll from "@/Componentes/RevealOnScroll";
import Link from "next/link";
import { CalendarCheck, ClipboardList, HeartHandshake, MessagesSquare } from "lucide-react";

const STEPS = [
    {
        step: 1,
        title: "Completa tu solicitud",
        description: "Indica tus datos, modalidad de atencion y disponibilidad horaria para una sesion psicologica.",
        icon: ClipboardList,
    },
    {
        step: 2,
        title: "Coordinamos la agenda",
        description: "El equipo revisa tu disponibilidad y coordina la alternativa de atencion mas adecuada.",
        icon: CalendarCheck,
    },
    {
        step: 3,
        title: "Inicias tu proceso",
        description: "Asistes a una sesion de 50 minutos, presencial en Santiago Centro u online.",
        icon: MessagesSquare,
    },
    {
        step: 4,
        title: "Acompanamiento",
        description: "Recibes orientacion psicologica para avanzar con contencion y continuidad.",
        icon: HeartHandshake,
    },
];

export default function ComoFuncionaPage() {
    return (
        <div className="bg-slate-50 min-h-screen pt-20 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40 font-sans text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <RevealOnScroll>
                    <div className="text-center mb-20 md:mb-28">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-900">
                            ¿Cómo funciona la atención?
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-light max-w-2xl mx-auto">
                            Un proceso simple para acceder a <span className="text-indigo-600 font-semibold">atencion psicologica en Santiago Centro</span>
                        </p>
                    </div>
                </RevealOnScroll>

                {/* Progress Line with Steps */}
                <RevealOnScroll>
                    <div className="mb-20 md:mb-28">
                        {/* Progress Line - Desktop */}
                        <div className="hidden lg:flex items-center justify-between mb-16 relative px-6">
                            {STEPS.map((step, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 relative z-10">
                                    {/* Step Circle */}
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg z-10 relative shadow-md">
                                        {step.step}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Steps Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                            {STEPS.map((step, index) => {
                                const StepIcon = step.icon;
                                return (
                                    <RevealOnScroll 
                                        key={index}
                                        delayClass={`delay-${index * 75}`}
                                    >
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                                            {/* Mobile Step Number */}
                                            <div className="lg:hidden mb-4">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                                                    {step.step}
                                                </span>
                                            </div>

                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-6">
                                                <StepIcon strokeWidth={1.5} className="h-7 w-7" />
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </RevealOnScroll>
                                );
                            })}
                        </div>
                    </div>
                </RevealOnScroll>

                {/* Results Text */}
                <RevealOnScroll className="text-center mb-12 md:mb-16">
                    <p className="text-lg md:text-2xl font-semibold text-slate-700">
                        <span className="text-indigo-600">Fundacion Desarrollo y Dignidad atiende en Agustinas 1357 oficina 73-A, Santiago.</span>
                    </p>
                </RevealOnScroll>

                {/* CTA Section */}
                <RevealOnScroll>
                    <div className="text-center">
                        <Link
                            href="/formularioSolicitud"
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-10 py-4 md:px-12 md:py-4 text-base md:text-lg font-semibold text-white transition-all hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                        >
                            Solicitar atencion psicologica →
                        </Link>
                        
                        <p className="text-sm md:text-base text-slate-500 font-light mt-6">
                            Modalidad presencial y online segun disponibilidad.
                        </p>
                    </div>
                </RevealOnScroll>

            </div>
        </div>
    );
}
