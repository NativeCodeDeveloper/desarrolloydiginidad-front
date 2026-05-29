"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { CalendarDays, Download, Mail, Phone, Search, UserCheck, UsersRound } from "lucide-react";
import { toast } from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockProfesionales = [
  { id: "sin-asignar", nombre: "Sin asignar" },
  { id: "dra-camila-rojas", nombre: "Dra. Camila Rojas" },
  { id: "dr-matias-perez", nombre: "Dr. Matias Perez" },
  { id: "dra-valentina-soto", nombre: "Dra. Valentina Soto" },
  { id: "dr-ignacio-munoz", nombre: "Dr. Ignacio Munoz" },
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
  },
];

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

function obtenerProfesionalNombre(idProfesional) {
  return mockProfesionales.find((profesional) => profesional.id === idProfesional)?.nombre || "Sin asignar";
}

export default function FormularioSolicitudesTablaPage() {
  const [nombreBuscado, setNombreBuscado] = useState("");
  const [rutBuscado, setRutBuscado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [asignaciones, setAsignaciones] = useState(() =>
    mockSolicitudes.reduce((acc, solicitud) => {
      acc[solicitud.id] = solicitud.profesionalAsignado;
      return acc;
    }, {})
  );

  const solicitudesFiltradas = useMemo(() => {
    const nombreNormalizado = nombreBuscado.trim().toLowerCase();
    const rutNormalizado = rutBuscado.trim().toLowerCase().replaceAll(".", "");

    return mockSolicitudes.filter((solicitud) => {
      const nombreCompleto = `${solicitud.nombre} ${solicitud.apellidos}`.toLowerCase();
      const rutSolicitud = solicitud.rut.toLowerCase().replaceAll(".", "");
      const cumpleNombre = !nombreNormalizado || nombreCompleto.includes(nombreNormalizado);
      const cumpleRut = !rutNormalizado || rutSolicitud.includes(rutNormalizado);
      const cumpleDesde = !fechaDesde || solicitud.fechaConsulta >= fechaDesde;
      const cumpleHasta = !fechaHasta || solicitud.fechaConsulta <= fechaHasta;

      return cumpleNombre && cumpleRut && cumpleDesde && cumpleHasta;
    });
  }, [fechaDesde, fechaHasta, nombreBuscado, rutBuscado]);

  function limpiarFiltros() {
    setNombreBuscado("");
    setRutBuscado("");
    setFechaDesde("");
    setFechaHasta("");
  }

  function asignarProfesional(idSolicitud, idProfesional) {
    setAsignaciones((prev) => ({
      ...prev,
      [idSolicitud]: idProfesional,
    }));
  }

  function exportarExcel() {
    if (solicitudesFiltradas.length === 0) {
      return toast.error("No hay solicitudes para exportar.");
    }

    const datosExportar = solicitudesFiltradas.map((solicitud) => ({
      Nombre: solicitud.nombre,
      Apellidos: solicitud.apellidos,
      RUT: solicitud.rut,
      Telefono: solicitud.telefono,
      "Correo electronico": solicitud.correo,
      "Fecha nacimiento": formatearFecha(solicitud.fechaNacimiento),
      "Fecha estimada consulta": formatearFecha(solicitud.fechaConsulta),
      "Motivo consulta": solicitud.motivoConsulta,
      "Profesional asignado": obtenerProfesionalNombre(asignaciones[solicitud.id]),
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");
    XLSX.writeFile(workbook, `solicitudes_pacientes_${new Date().toISOString().slice(0, 10)}.xlsx`);
    return toast.success("Excel generado con los datos visibles.");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <ToasterClient />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-10 2xl:max-w-none">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">
              Solicitudes web
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Formularios de <span className="text-[#6E56CF]">Pacientes</span>
            </h1>
            <p className="mt-2 max-w-2xl text-[13px] text-slate-500">
              Plantilla visual para revisar solicitudes recibidas desde el formulario publico, filtrar registros y asignar un profesional responsable.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Solicitudes
              </span>
              <span className="mt-1 block text-sm font-bold leading-none text-slate-900">
                {solicitudesFiltradas.length} visibles
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sin asignar
              </span>
              <span className="mt-1 block text-sm font-bold leading-none text-slate-900">
                {solicitudesFiltradas.filter((item) => asignaciones[item.id] === "sin-asignar").length} pendientes
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/30 px-4 py-4 md:px-8 md:py-5">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Filtros de busqueda
              </h2>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2 md:p-8 xl:grid-cols-5">
              <div className="space-y-3 xl:col-span-2">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Nombre paciente
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={nombreBuscado}
                    onChange={(event) => setNombreBuscado(event.target.value)}
                    placeholder="Ej: Francisca Morales"
                    className="h-12 rounded-2xl border-slate-200 pl-11 focus-visible:border-[#6E56CF] focus-visible:ring-violet-100"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  RUT
                </label>
                <Input
                  value={rutBuscado}
                  onChange={(event) => setRutBuscado(event.target.value)}
                  placeholder="12.345.678-9"
                  className="h-12 rounded-2xl border-slate-200 focus-visible:border-[#6E56CF] focus-visible:ring-violet-100"
                />
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Desde
                </label>
                <Input
                  type="date"
                  value={fechaDesde}
                  onChange={(event) => setFechaDesde(event.target.value)}
                  className="h-12 rounded-2xl border-slate-200 focus-visible:border-[#6E56CF] focus-visible:ring-violet-100"
                />
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Hasta
                </label>
                <Input
                  type="date"
                  value={fechaHasta}
                  onChange={(event) => setFechaHasta(event.target.value)}
                  className="h-12 rounded-2xl border-slate-200 focus-visible:border-[#6E56CF] focus-visible:ring-violet-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:justify-end md:px-8">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-500 transition-all hover:bg-slate-50"
              >
                Limpiar filtros
              </button>
              <button
                type="button"
                onClick={exportarExcel}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-[13px] font-bold text-emerald-700 transition-all hover:bg-emerald-100"
              >
                <Download className="h-4 w-4" />
                Descargar Excel
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/30 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-5">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Solicitudes recibidas
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                Datos mock, sin conexion a backend
              </span>
            </div>

            <div className="xl:hidden p-4 md:p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                {solicitudesFiltradas.map((solicitud) => (
                  <article key={solicitud.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {solicitud.nombre} {solicitud.apellidos}
                        </p>
                        <p className="mt-1 font-mono text-[12px] font-semibold text-slate-500">
                          {solicitud.rut}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-[#6E56CF]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatearFecha(solicitud.fechaConsulta)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-[13px] text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {solicitud.telefono}
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate">{solicitud.correo}</span>
                      </span>
                    </div>

                    <Textarea
                      readOnly
                      value={solicitud.motivoConsulta}
                      className="mt-4 min-h-24 resize-none rounded-2xl border-slate-200 bg-slate-50 text-[13px] text-slate-700"
                    />

                    <div className="mt-4 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Profesional asignado
                      </label>
                      <select
                        value={asignaciones[solicitud.id]}
                        onChange={(event) => asignarProfesional(solicitud.id, event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-700 outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100"
                      >
                        {mockProfesionales.map((profesional) => (
                          <option key={profesional.id} value={profesional.id}>
                            {profesional.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <Table className="min-w-[1250px]">
                <TableHeader>
                  <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Paciente</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Contacto</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Nacimiento</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Fecha consulta</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Motivo</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Profesional asignado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <UsersRound className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-[13px] font-medium italic text-slate-400">
                          No se encontraron solicitudes para los filtros seleccionados.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    solicitudesFiltradas.map((solicitud) => (
                      <TableRow key={solicitud.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#6E56CF]">
                              <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-slate-900">
                                {solicitud.nombre} {solicitud.apellidos}
                              </p>
                              <p className="mt-0.5 font-mono text-[11px] font-semibold text-slate-400">
                                {solicitud.rut}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <p className="text-[13px] font-semibold text-slate-600">{solicitud.telefono}</p>
                          <p className="mt-0.5 max-w-[190px] truncate text-[11px] text-slate-400">{solicitud.correo}</p>
                        </TableCell>
                        <TableCell className="py-4 text-[13px] font-semibold text-slate-600">
                          {formatearFecha(solicitud.fechaNacimiento)}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="inline-flex rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-[12px] font-bold text-[#6E56CF]">
                            {formatearFecha(solicitud.fechaConsulta)}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[320px] py-4">
                          <p className="line-clamp-2 text-[13px] font-medium leading-6 text-slate-600">
                            {solicitud.motivoConsulta}
                          </p>
                        </TableCell>
                        <TableCell className="py-4">
                          <select
                            value={asignaciones[solicitud.id]}
                            onChange={(event) => asignarProfesional(solicitud.id, event.target.value)}
                            className="h-10 w-full min-w-[210px] rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-bold text-slate-700 outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100"
                          >
                            {mockProfesionales.map((profesional) => (
                              <option key={profesional.id} value={profesional.id}>
                                {profesional.nombre}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
