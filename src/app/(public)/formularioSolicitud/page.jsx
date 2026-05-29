"use client";

import {
  CalendarDays,
  ClipboardList,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const camposPaciente = [
  {
    id: "nombre",
    label: "Nombre",
    placeholder: "Ej: Camila",
    type: "text",
    icon: UserRound,
    autoComplete: "given-name",
  },
  {
    id: "apellidos",
    label: "Apellidos",
    placeholder: "Ej: Perez Soto",
    type: "text",
    icon: UserRound,
    autoComplete: "family-name",
  },
  {
    id: "rut",
    label: "RUT",
    placeholder: "Ej: 12.345.678-9",
    type: "text",
    icon: ClipboardList,
    autoComplete: "off",
  },
  {
    id: "telefono",
    label: "Numero de telefono",
    placeholder: "Ej: +56 9 1234 5678",
    type: "tel",
    icon: Phone,
    autoComplete: "tel",
  },
  {
    id: "correo",
    label: "Correo electronico",
    placeholder: "Ej: correo@ejemplo.com",
    type: "email",
    icon: Mail,
    autoComplete: "email",
  },
  {
    id: "fechaNacimiento",
    label: "Fecha de nacimiento",
    placeholder: "",
    type: "date",
    icon: CalendarDays,
    autoComplete: "bday",
  },
  {
    id: "fechaConsulta",
    label: "Fecha estimada de consulta",
    placeholder: "",
    type: "date",
    icon: CalendarDays,
    autoComplete: "off",
  },
];

export default function FormularioSolicitudPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-64 bg-indigo-50" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="rounded-[2rem] bg-indigo-700 p-7 text-white shadow-xl sm:p-9 lg:p-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/50 bg-indigo-600">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-indigo-200">
              Solicitud de atencion
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Completa tus datos para coordinar una consulta.
            </h1>
            <p className="mt-5 text-base leading-7 text-indigo-100">
              Esta informacion nos ayuda a identificar al paciente, conocer el
              motivo de consulta y preparar una mejor orientacion para la
              atencion.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-indigo-500 bg-indigo-600/35 p-5">
                <p className="text-sm font-bold text-white">
                  Datos de contacto actualizados
                </p>
                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Usaremos el telefono y correo para confirmar disponibilidad o
                  solicitar antecedentes adicionales.
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500 bg-indigo-600/35 p-5">
                <p className="text-sm font-bold text-white">
                  Fecha referencial
                </p>
                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  La fecha estimada permite priorizar la coordinacion, pero no
                  confirma automaticamente una hora.
                </p>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Datos del paciente
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Formulario de contacto
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Ingresa la informacion solicitada para que el equipo pueda
                contactarte y revisar tu solicitud de atencion.
              </p>
            </div>

            <form
              className="mt-9 space-y-7"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid gap-5 md:grid-cols-2">
                {camposPaciente.map((campo) => {
                  const Icon = campo.icon;

                  return (
                    <div key={campo.id} className="space-y-2.5">
                      <label
                        htmlFor={campo.id}
                        className="text-sm font-bold text-slate-700"
                      >
                        {campo.label}
                      </label>
                      <div className="relative">
                        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id={campo.id}
                          name={campo.id}
                          type={campo.type}
                          placeholder={campo.placeholder}
                          autoComplete={campo.autoComplete}
                          required
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 shadow-none transition focus-visible:border-indigo-500 focus-visible:ring-indigo-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                <label
                  htmlFor="motivoConsulta"
                  className="text-sm font-bold text-slate-700"
                >
                  Motivo de consulta
                </label>
                <Textarea
                  id="motivoConsulta"
                  name="motivoConsulta"
                  required
                  placeholder="Describe brevemente el motivo de la consulta, sintomas, requerimiento o antecedente relevante."
                  className="min-h-36 resize-none rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none transition focus-visible:border-indigo-500 focus-visible:ring-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  Al enviar, el equipo revisara tus datos para gestionar el
                  contacto y orientar la coordinacion de la consulta.
                </p>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 sm:w-auto"
                >
                  Enviar solicitud
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
