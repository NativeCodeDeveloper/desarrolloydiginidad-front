"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ClipboardList,
  Mail,
  Phone,
  RefreshCw,
  UserCheck,
  UserRound,
} from "lucide-react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { toast } from "react-hot-toast";

const estadoClases = {
  "Sin asignar": "border-amber-200 bg-amber-50 text-amber-700",
  Asignado: "border-violet-200 bg-violet-50 text-[#6E56CF]",
  Atendido: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cerrado: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const fechaNormalizada = String(fecha).slice(0, 10);
  const [year, month, day] = fechaNormalizada.split("-");
  return `${day}/${month}/${year}`;
}

function crearWhatsappUrl(telefono = "") {
  const numero = telefono.replace(/\D/g, "");
  const mensaje = encodeURIComponent("Hola Como estas te contactamos de la Fundacion Desarrollo y Dignidad");
  return `https://wa.me/${numero}?text=${mensaje}`;
}

function crearCalendarioUrl(solicitud) {
  const params = new URLSearchParams({
    nombre: solicitud.nombre || "",
    apellido: solicitud.apellidos || "",
    rut: solicitud.rut || "",
    telefono: solicitud.telefono || "",
    email: solicitud.correo || "",
  });

  return `/dashboard/calendario?${params.toString()}`;
}

function separarDisponibilidad(disponibilidad) {
  return String(disponibilidad || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function InfoItem({ icon: Icon, label, value, allowWrap = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#6E56CF]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className={`mt-1 text-[13px] font-bold text-slate-800 ${allowWrap ? "break-all leading-5" : "truncate"}`}>
            {value || "Sin registro"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FormularioDetallePage() {
  const params = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [solicitud, setSolicitud] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarAvisoAgenda, setMostrarAvisoAgenda] = useState(false);
  const [mostrarAvisoWhatsapp, setMostrarAvisoWhatsapp] = useState(false);

  async function seleccionarFormularioEspecifico() {
    try {
      if (!API) {
        return toast.error("Falta configurar NEXT_PUBLIC_API_URL.");
      }

      setCargando(true);
      const res = await fetch(`${API}/solicitud/seleccionarFormularioEspecifico`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_formulario: params.id_formulario }),
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        setSolicitud(null);
        return toast.error("No fue posible cargar el detalle de la solicitud.");
      }

      const respuestaBackend = await res.json();
      setSolicitud(Array.isArray(respuestaBackend) && respuestaBackend.length > 0 ? respuestaBackend[0] : null);
    } catch (error) {
      console.error(error);
      setSolicitud(null);
      return toast.error("Error de conexion cargando detalle.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    seleccionarFormularioEspecifico();
  }, [params.id_formulario]);

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#FAFAFB] px-4 py-10 md:px-8">
        <div className="mx-auto grid min-h-[420px] max-w-4xl place-items-center rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div>
            <RefreshCw className="mx-auto h-10 w-10 animate-spin text-[#6E56CF]" />
            <p className="mt-4 text-sm font-bold text-slate-500">Cargando solicitud...</p>
          </div>
        </div>
      </main>
    );
  }

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

  const estadoSolicitud = solicitud.estadoSolicitud || "Sin asignar";
  const profesionalAsignado = solicitud.profesionalAsignado || "Sin asignar";
  const disponibilidadItems = separarDisponibilidad(solicitud.disponibilidadPaciente);

  return (
    <main className="min-h-screen bg-[#FAFAFB]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8">
          <Link
            href="/dashboard/formularioSolicitudesTabla"
            className="inline-flex h-12 items-center gap-2.5 rounded-2xl border border-violet-200 bg-white px-5 text-[13px] font-extrabold text-[#5B45C4] shadow-md shadow-violet-100/70 transition hover:-translate-y-0.5 hover:border-[#6E56CF] hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-[#6E56CF]">
              <ArrowLeft className="h-4 w-4" />
            </span>
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
                <span className={`inline-flex rounded-full border px-4 py-2 text-[12px] font-bold ${estadoClases[estadoSolicitud] || estadoClases["Sin asignar"]}`}>
                  {estadoSolicitud}
                </span>
                <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-[12px] font-bold text-[#6E56CF]">
                  ID formulario #{solicitud.id_formulario}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 md:p-8 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <InfoItem icon={Phone} label="Telefono" value={solicitud.telefono} />
                <InfoItem icon={Mail} label="Correo" value={solicitud.correo} allowWrap />
                <InfoItem icon={CalendarDays} label="Nacimiento" value={formatearFecha(solicitud.fechaNacimiento)} />
                <InfoItem icon={UserCheck} label="Profesional" value={profesionalAsignado} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setMostrarAvisoWhatsapp(true)}
                  className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-emerald-500 bg-emerald-600 px-5 text-[13px] font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto"
                >
                  <WhatsAppIcon sx={{ fontSize: 20 }} />
                  Contactar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarAvisoAgenda(true)}
                  className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#6E56CF] bg-[#6E56CF] px-5 text-[13px] font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#5B45C4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 sm:w-auto"
                >
                  <CalendarDays className="h-4.5 w-4.5" />
                  Agendar en calendario
                </button>
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
                <p className="mt-5 text-[15px] leading-8 text-slate-700">
                  {solicitud.motivoConsulta || "Sin motivo registrado."}
                </p>
              </article>

              <article className="overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6E56CF] shadow-sm">
                    <Clock3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6E56CF]">
                      Disponibilidad indicada por el paciente
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      Horarios en los que puede asistir a sesion
                    </h2>
                    <p className="mt-2 text-[13px] leading-6 text-slate-500">
                      Esta es la disponibilidad que el paciente declaro al completar la solicitud.
                    </p>
                  </div>
                </div>

                {disponibilidadItems.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {disponibilidadItems.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-[13px] font-bold text-slate-800 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-bold text-slate-500">
                    Sin disponibilidad registrada.
                  </p>
                )}
              </article>
            </div>

            <aside className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6E56CF] shadow-sm">
                <UserRound className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">Resumen informacion de contacto</h2>
              <div className="mt-6 space-y-4">
                {[
                  ["Paciente", `${solicitud.nombre || ""} ${solicitud.apellidos || ""}`.trim()],
                  ["RUT", solicitud.rut],
                  ["Contacto", solicitud.telefono],
                  ["Correo", solicitud.correo],
                  ["Profesional", profesionalAsignado],
                  ["Estado", estadoSolicitud],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-slate-200 pb-3 last:border-b-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-1 break-words text-[13px] font-bold text-slate-800">{value || "Sin registro"}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </div>

      {mostrarAvisoAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-[#6E56CF]">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6E56CF]">
                  Antes de ir al calendario
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Informacion precargada
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Al ir a reservas, la informacion de contacto del paciente estara cargada. Sin embargo, debes seleccionar el profesional, el valor del servicio, la fecha y la hora antes de confirmar la reserva.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setMostrarAvisoAgenda(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => router.push(crearCalendarioUrl(solicitud))}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#6E56CF] bg-[#6E56CF] px-5 text-[13px] font-bold text-white transition hover:bg-[#5B45C4]"
              >
                Aceptar e ir al calendario
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarAvisoWhatsapp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <WhatsAppIcon sx={{ fontSize: 26 }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  Abrir WhatsApp
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Confirmar contacto
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Este boton abrira la aplicacion de WhatsApp en una ventana externa y abrira una conversacion con el numero del paciente. Desea continuar?
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setMostrarAvisoWhatsapp(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <a
                href={crearWhatsappUrl(solicitud.telefono)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMostrarAvisoWhatsapp(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-emerald-500 bg-emerald-600 px-5 text-[13px] font-bold text-white transition hover:bg-emerald-700"
              >
                Aceptar y abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
