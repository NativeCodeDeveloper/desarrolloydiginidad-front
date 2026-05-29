"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Mail,
  Phone,
  Stethoscope,
  UserCheck,
  UserRound,
} from "lucide-react";

const mockProfesionales = [
  { id: "sin-asignar", nombre: "Sin asignar" },
  { id: "dra-camila-rojas", nombre: "Dra. Camila Rojas", especialidad: "Odontologia general" },
  { id: "dr-matias-perez", nombre: "Dr. Matias Perez", especialidad: "Rehabilitacion oral" },
  { id: "dra-valentina-soto", nombre: "Dra. Valentina Soto", especialidad: "Estetica clinica" },
  { id: "dr-ignacio-munoz", nombre: "Dr. Ignacio Munoz", especialidad: "Prevencion y control" },
];

const mockSolicitudes = [
  {
    id: 1,
    nombre: "Francisca",
    apellidos: "Morales Diaz",
    rut: "17.456.982-3",
    telefono: "+56 9 8321 4477",
    correo: "francisca.morales@example.com",
    fechaNacimiento: "1991-04-18",
    fechaConsulta: "2026-06-03",
    motivoConsulta: "Dolor mandibular recurrente y sensibilidad dental al frio.",
    profesionalAsignado: "dra-camila-rojas",
    estadoSolicitud: "Asignado",
    antecedentes: "Paciente indica episodios de bruxismo nocturno y sensibilidad al consumir bebidas frias.",
    observaciones: "Priorizar evaluacion inicial, revisar oclusion y solicitar antecedentes de tratamientos previos.",
  },
  {
    id: 2,
    nombre: "Javier",
    apellidos: "Contreras Silva",
    rut: "14.908.771-6",
    telefono: "+56 9 6554 9012",
    correo: "javier.contreras@example.com",
    fechaNacimiento: "1986-11-07",
    fechaConsulta: "2026-06-05",
    motivoConsulta: "Evaluacion general y revision por sangrado de encias.",
    profesionalAsignado: "sin-asignar",
    estadoSolicitud: "Sin asignar",
    antecedentes: "No registra atenciones recientes. Solicita orientacion para primera evaluacion.",
    observaciones: "Contactar para confirmar disponibilidad y asignar profesional segun agenda.",
  },
  {
    id: 3,
    nombre: "Daniela",
    apellidos: "Fuentes Araya",
    rut: "19.224.113-K",
    telefono: "+56 9 7412 3008",
    correo: "daniela.fuentes@example.com",
    fechaNacimiento: "1998-02-22",
    fechaConsulta: "2026-06-10",
    motivoConsulta: "Consulta por control estetico y orientacion de tratamiento.",
    profesionalAsignado: "dra-valentina-soto",
    estadoSolicitud: "Atendido",
    antecedentes: "Paciente busca alternativas no invasivas y solicita evaluacion presencial.",
    observaciones: "Se sugiere revisar expectativas, fotografias clinicas y plan por etapas.",
  },
  {
    id: 4,
    nombre: "Rodrigo",
    apellidos: "Navarro Pizarro",
    rut: "12.337.884-5",
    telefono: "+56 9 9980 1124",
    correo: "rodrigo.navarro@example.com",
    fechaNacimiento: "1979-08-31",
    fechaConsulta: "2026-06-12",
    motivoConsulta: "Molestia al masticar y posible fractura en pieza posterior.",
    profesionalAsignado: "dr-matias-perez",
    estadoSolicitud: "Asignado",
    antecedentes: "Refiere dolor localizado de tres dias de evolucion, sin tratamiento reciente.",
    observaciones: "Evaluar urgencia relativa y orientar sobre cuidados previos a la cita.",
  },
  {
    id: 5,
    nombre: "Antonia",
    apellidos: "Vargas Medina",
    rut: "20.118.490-1",
    telefono: "+56 9 4210 7788",
    correo: "antonia.vargas@example.com",
    fechaNacimiento: "2001-01-13",
    fechaConsulta: "2026-06-18",
    motivoConsulta: "Primera evaluacion por tratamiento preventivo y limpieza.",
    profesionalAsignado: "dr-ignacio-munoz",
    estadoSolicitud: "Cerrado",
    antecedentes: "Consulta preventiva sin dolor asociado. Interes en control semestral.",
    observaciones: "Solicitud cerrada como referencia visual mock para estados finalizados.",
  },
];

const estadoClases = {
  "Sin asignar": "border-amber-200 bg-amber-50 text-amber-700",
  Asignado: "border-violet-200 bg-violet-50 text-[#6E56CF]",
  Atendido: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cerrado: "border-slate-200 bg-slate-100 text-slate-600",
};

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

function obtenerProfesional(idProfesional) {
  return mockProfesionales.find((profesional) => profesional.id === idProfesional) || mockProfesionales[0];
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#6E56CF]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-1 truncate text-[13px] font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function FormularioDetallePage() {
  const params = useParams();
  const solicitud = mockSolicitudes.find((item) => String(item.id) === String(params.id_formulario));
  const profesional = obtenerProfesional(solicitud?.profesionalAsignado);

  if (!solicitud) {
    return (
      <main className="min-h-screen bg-[#FAFAFB] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-900">Solicitud no encontrada</p>
          <Link href="/dashboard/formularioSolicitudesTabla" className="mt-5 inline-flex rounded-xl bg-[#6E56CF] px-5 py-3 text-[13px] font-bold text-white">
            Volver al listado
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFB]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8">
          <Link
            href="/dashboard/formularioSolicitudesTabla"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a solicitudes
          </Link>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/40 p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">
                  Detalle de solicitud
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {solicitud.nombre} {solicitud.apellidos}
                </h1>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-500">{solicitud.rut}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex rounded-full border px-4 py-2 text-[12px] font-bold ${estadoClases[solicitud.estadoSolicitud]}`}>
                  {solicitud.estadoSolicitud}
                </span>
                <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-[12px] font-bold text-[#6E56CF]">
                  ID formulario #{solicitud.id}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 md:p-8 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <InfoItem icon={Phone} label="Telefono" value={solicitud.telefono} />
                <InfoItem icon={Mail} label="Correo" value={solicitud.correo} />
                <InfoItem icon={CalendarDays} label="Nacimiento" value={formatearFecha(solicitud.fechaNacimiento)} />
                <InfoItem icon={CalendarDays} label="Fecha estimada" value={formatearFecha(solicitud.fechaConsulta)} />
                <InfoItem icon={UserCheck} label="Profesional" value={profesional.nombre} />
                <InfoItem icon={Stethoscope} label="Area" value={profesional.especialidad || "Por definir"} />
              </div>

              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-[#6E56CF]">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Motivo de consulta
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">Resumen enviado por paciente</h2>
                  </div>
                </div>
                <p className="mt-5 text-[15px] leading-8 text-slate-700">{solicitud.motivoConsulta}</p>
              </article>

              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Antecedentes declarados
                  </p>
                  <p className="mt-4 text-[14px] leading-7 text-slate-700">{solicitud.antecedentes}</p>
                </article>

                <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Observaciones internas
                  </p>
                  <p className="mt-4 text-[14px] leading-7 text-slate-700">{solicitud.observaciones}</p>
                </article>
              </div>
            </div>

            <aside className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6E56CF] shadow-sm">
                <UserRound className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">Ficha rapida</h2>
              <div className="mt-6 space-y-4">
                {[
                  ["Paciente", `${solicitud.nombre} ${solicitud.apellidos}`],
                  ["RUT", solicitud.rut],
                  ["Contacto", solicitud.telefono],
                  ["Correo", solicitud.correo],
                  ["Profesional", profesional.nombre],
                  ["Estado", solicitud.estadoSolicitud],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-slate-200 pb-3 last:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-1 break-words text-[13px] font-bold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
