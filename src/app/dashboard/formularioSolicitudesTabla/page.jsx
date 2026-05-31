"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { CalendarDays, Download, Eye, Mail, Phone, RefreshCw, Search, UserCheck, UsersRound } from "lucide-react";
import { toast } from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const estadosSolicitud = [
  { valor: "Sin asignar", clase: "border-amber-200 bg-amber-50 text-amber-700" },
  { valor: "Asignado", clase: "border-violet-200 bg-violet-50 text-[#6E56CF]" },
  { valor: "Atendido", clase: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { valor: "Cerrado", clase: "border-rose-200 bg-rose-50 text-rose-700" },
];

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const fechaNormalizada = String(fecha).slice(0, 10);
  const [year, month, day] = fechaNormalizada.split("-");
  return `${day}/${month}/${year}`;
}

function obtenerIdFormulario(solicitud) {
  return solicitud.id_formulario ?? solicitud.id;
}

function obtenerEstadoSolicitud(solicitud) {
  return solicitud.estadoSolicitud || "Sin asignar";
}

function obtenerProfesionalNombre(solicitud) {
  return solicitud.profesionalAsignado || "Sin asignar";
}

function obtenerClaseEstado(estado) {
  return estadosSolicitud.find((item) => item.valor === estado)?.clase || estadosSolicitud[0].clase;
}

export default function FormularioSolicitudesTablaPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [nombreBuscado, setNombreBuscado] = useState("");
  const [rutBuscado, setRutBuscado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [solicitudes, setSolicitudes] = useState([]);
  const [profesionalesDisponibles, setProfesionalesDisponibles] = useState(["Sin asignar"]);
  const [cargando, setCargando] = useState(true);
  const [cargandoProfesionales, setCargandoProfesionales] = useState(false);
  const [actualizandoEstadoId, setActualizandoEstadoId] = useState(null);
  const [actualizandoProfesionalId, setActualizandoProfesionalId] = useState(null);

  function normalizarRespuestaSolicitudes(respuestaBackend) {
    return Array.isArray(respuestaBackend) ? respuestaBackend : [];
  }

  function normalizarRespuestaProfesionales(respuestaBackend) {
    if (!Array.isArray(respuestaBackend)) return ["Sin asignar"];

    const nombresProfesionales = respuestaBackend
      .map((profesional) => profesional.nombreProfesional)
      .filter(Boolean);

    return [...new Set(["Sin asignar", ...nombresProfesionales])];
  }

  async function seleccionarTodosLosFormularios() {
    try {
      if (!API) {
        setSolicitudes([]);
        return toast.error("Falta configurar NEXT_PUBLIC_API_URL.");
      }

      setCargando(true);
      const res = await fetch(`${API}/solicitud/seleccionarTodosLosFormularios`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        setSolicitudes([]);
        return toast.error("No fue posible cargar las solicitudes.");
      }

      const respuestaBackend = await res.json();
      setSolicitudes(normalizarRespuestaSolicitudes(respuestaBackend));
    } catch (error) {
      console.error(error);
      setSolicitudes([]);
      return toast.error("Error de conexion cargando solicitudes.");
    } finally {
      setCargando(false);
    }
  }

  async function seleccionarTodosProfesionales() {
    try {
      if (!API) {
        setProfesionalesDisponibles(["Sin asignar"]);
        return toast.error("Falta configurar NEXT_PUBLIC_API_URL.");
      }

      setCargandoProfesionales(true);
      const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        setProfesionalesDisponibles(["Sin asignar"]);
        return toast.error("No fue posible cargar los profesionales.");
      }

      const respuestaBackend = await res.json();
      setProfesionalesDisponibles(normalizarRespuestaProfesionales(respuestaBackend));
    } catch (error) {
      console.error(error);
      setProfesionalesDisponibles(["Sin asignar"]);
      return toast.error("Error de conexion cargando profesionales.");
    } finally {
      setCargandoProfesionales(false);
    }
  }

  async function seleccionarSolicitudesPorFechas() {
    try {
      if (!API) {
        setSolicitudes([]);
        return toast.error("Falta configurar NEXT_PUBLIC_API_URL.");
      }

      if (!fechaDesde || !fechaHasta) {
        return seleccionarTodosLosFormularios();
      }

      setCargando(true);
      const res = await fetch(`${API}/solicitud/fechas`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaConsultaInicio: `${fechaDesde} 00:00:00`,
          fechaConsultaFinal: `${fechaHasta} 23:59:59`,
        }),
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        setSolicitudes([]);
        return toast.error("No fue posible filtrar por fechas.");
      }

      const respuestaBackend = await res.json();
      setSolicitudes(normalizarRespuestaSolicitudes(respuestaBackend));
    } catch (error) {
      console.error(error);
      setSolicitudes([]);
      return toast.error("Error de conexion filtrando por fechas.");
    } finally {
      setCargando(false);
    }
  }

  async function seleccionarSolicitudesPorEstado() {
    try {
      if (!API) {
        setSolicitudes([]);
        return toast.error("Falta configurar NEXT_PUBLIC_API_URL.");
      }

      if (estadoFiltro === "Todos" || estadoFiltro === "Sin asignar") {
        return seleccionarTodosLosFormularios();
      }

      setCargando(true);
      const res = await fetch(`${API}/solicitud/estado`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estadoSolicitud: estadoFiltro }),
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        setSolicitudes([]);
        return toast.error("No fue posible filtrar por estado.");
      }

      const respuestaBackend = await res.json();
      setSolicitudes(normalizarRespuestaSolicitudes(respuestaBackend));
    } catch (error) {
      console.error(error);
      setSolicitudes([]);
      return toast.error("Error de conexion filtrando por estado.");
    } finally {
      setCargando(false);
    }
  }

  async function seleccionarSolicitudesSegunFiltros() {
    if (fechaDesde && fechaHasta) {
      return seleccionarSolicitudesPorFechas();
    }

    if (estadoFiltro !== "Todos" && estadoFiltro !== "Sin asignar") {
      return seleccionarSolicitudesPorEstado();
    }

    return seleccionarTodosLosFormularios();
  }

  useEffect(() => {
    seleccionarTodosLosFormularios();
    seleccionarTodosProfesionales();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      seleccionarSolicitudesSegunFiltros();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fechaDesde, fechaHasta, estadoFiltro]);

  const solicitudesFiltradas = useMemo(() => {
    const nombreNormalizado = nombreBuscado.trim().toLowerCase();
    const rutNormalizado = rutBuscado.trim().toLowerCase().replaceAll(".", "").replaceAll("-", "");

    return solicitudes.filter((solicitud) => {
      const nombreCompleto = `${solicitud.nombre} ${solicitud.apellidos}`.toLowerCase();
      const rutSolicitud = String(solicitud.rut || "").toLowerCase().replaceAll(".", "").replaceAll("-", "");
      const cumpleNombre = !nombreNormalizado || nombreCompleto.includes(nombreNormalizado);
      const cumpleRut = !rutNormalizado || rutSolicitud.includes(rutNormalizado);
      const fechaConsulta = String(solicitud.fechaConsulta || "").slice(0, 10);
      const cumpleDesde = !fechaDesde || fechaConsulta >= fechaDesde;
      const cumpleHasta = !fechaHasta || fechaConsulta <= fechaHasta;
      const cumpleEstado = estadoFiltro === "Todos" || obtenerEstadoSolicitud(solicitud) === estadoFiltro;

      return cumpleNombre && cumpleRut && cumpleDesde && cumpleHasta && cumpleEstado;
    });
  }, [estadoFiltro, fechaDesde, fechaHasta, nombreBuscado, rutBuscado, solicitudes]);

  function limpiarFiltros() {
    setNombreBuscado("");
    setRutBuscado("");
    setFechaDesde("");
    setFechaHasta("");
    setEstadoFiltro("Todos");
  }

  async function asignarProfesional(id_formulario, profesionalAsignado) {
    try {
      if (!id_formulario || !profesionalAsignado) {
        return toast.error("No fue posible identificar la solicitud o el profesional.");
      }

      setActualizandoProfesionalId(id_formulario);
      const res = await fetch(`${API}/solicitud/cambiarProfesionalAsignado`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_formulario, profesionalAsignado }),
        mode: "cors",
      });

      if (!res.ok) {
        return toast.error("No se pudo asignar el profesional.");
      }

      const respuestaBackend = await res.json();
      if (respuestaBackend.message === true || respuestaBackend.message === "true") {
        setSolicitudes((prev) =>
          prev.map((solicitud) =>
            obtenerIdFormulario(solicitud) === id_formulario
              ? { ...solicitud, profesionalAsignado }
              : solicitud
          )
        );
        return toast.success("Profesional asignado correctamente.");
      }

      return toast.error("El backend no actualizo el profesional.");
    } catch (error) {
      console.error(error);
      return toast.error("Error de conexion asignando profesional.");
    } finally {
      setActualizandoProfesionalId(null);
    }
  }

  async function cambiarEstadoSolicitud(id_formulario, estadoSolicitud) {
    try {
      if (!id_formulario || !estadoSolicitud) {
        return toast.error("No fue posible identificar la solicitud o el estado.");
      }

      setActualizandoEstadoId(id_formulario);
      const res = await fetch(`${API}/solicitud/cambiarEstadoFormulario`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_formulario, estadoSolicitud }),
        mode: "cors",
      });

      if (!res.ok) {
        return toast.error("No se pudo actualizar el estado.");
      }

      const respuestaBackend = await res.json();
      if (respuestaBackend.message === true || respuestaBackend.message === "true") {
        setSolicitudes((prev) =>
          prev.map((solicitud) =>
            obtenerIdFormulario(solicitud) === id_formulario
              ? { ...solicitud, estadoSolicitud }
              : solicitud
          )
        );
        return toast.success("Estado actualizado correctamente.");
      }

      return toast.error("El backend no actualizo el estado.");
    } catch (error) {
      console.error(error);
      return toast.error("Error de conexion actualizando estado.");
    } finally {
      setActualizandoEstadoId(null);
    }
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
      "Disponibilidad paciente": solicitud.disponibilidadPaciente || "",
      "Motivo consulta": solicitud.motivoConsulta || "",
      "Profesional asignado": obtenerProfesionalNombre(solicitud),
      "Estado solicitud": obtenerEstadoSolicitud(solicitud),
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
                {solicitudesFiltradas.filter((item) => obtenerProfesionalNombre(item) === "Sin asignar").length} pendientes
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

            <div className="grid gap-4 p-4 md:grid-cols-2 md:p-8 xl:grid-cols-6">
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
                  placeholder="123456789"
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

              <div className="space-y-3">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Estado
                </label>
                <select
                  value={estadoFiltro}
                  onChange={(event) => setEstadoFiltro(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100"
                >
                  <option value="Todos">Todos los estados</option>
                  {estadosSolicitud.map((estado) => (
                    <option key={estado.valor} value={estado.valor}>
                      {estado.valor}
                    </option>
                  ))}
                </select>
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
                onClick={seleccionarSolicitudesSegunFiltros}
                disabled={cargando}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${cargando ? "animate-spin" : ""}`} />
                Actualizar
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
                Datos cargados desde API
              </span>
            </div>

            <div className="xl:hidden p-4 md:p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                {cargando ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-[13px] font-bold text-slate-400">
                    Cargando solicitudes...
                  </div>
                ) : solicitudesFiltradas.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <UsersRound className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-[13px] font-medium italic text-slate-400">
                      No se encontraron solicitudes para los filtros seleccionados.
                    </p>
                  </div>
                ) : solicitudesFiltradas.map((solicitud) => {
                  const idFormulario = obtenerIdFormulario(solicitud);
                  const estadoSolicitud = obtenerEstadoSolicitud(solicitud);
                  const profesionalAsignado = obtenerProfesionalNombre(solicitud);

                  return (
                  <article key={idFormulario} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${obtenerClaseEstado(estadoSolicitud)}`}>
                        {estadoSolicitud}
                      </span>
                      <Link
                        href={`/dashboard/formularioDetalle/${idFormulario}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver detalle
                      </Link>
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

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Estado solicitud
                        </label>
                        <select
                          value={estadoSolicitud}
                          onChange={(event) => cambiarEstadoSolicitud(idFormulario, event.target.value)}
                          disabled={actualizandoEstadoId === idFormulario}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-700 outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100"
                        >
                          {estadosSolicitud.map((estado) => (
                            <option key={estado.valor} value={estado.valor}>
                              {estado.valor}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Profesional asignado
                      </label>
                      <select
                        value={profesionalAsignado}
                        onChange={(event) => asignarProfesional(idFormulario, event.target.value)}
                        disabled={actualizandoProfesionalId === idFormulario || cargandoProfesionales}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-700 outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100"
                      >
                        {[...new Set([profesionalAsignado, ...profesionalesDisponibles])].map((profesional) => (
                          <option key={profesional} value={profesional}>
                            {profesional}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                  </article>
                  );
                })}
              </div>
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <Table className="min-w-[1250px]">
                <TableHeader>
                  <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Paciente</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Contacto</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Fecha consulta</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Detalle</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Estado</TableHead>
                    <TableHead className="py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Profesional asignado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargando ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <RefreshCw className="mx-auto h-10 w-10 animate-spin text-slate-300" />
                        <p className="mt-3 text-[13px] font-medium italic text-slate-400">
                          Cargando solicitudes...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : solicitudesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <UsersRound className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-[13px] font-medium italic text-slate-400">
                          No se encontraron solicitudes para los filtros seleccionados.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    solicitudesFiltradas.map((solicitud) => {
                      const idFormulario = obtenerIdFormulario(solicitud);
                      const estadoSolicitud = obtenerEstadoSolicitud(solicitud);
                      const profesionalAsignado = obtenerProfesionalNombre(solicitud);

                      return (
                      <TableRow key={idFormulario} className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
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
                        <TableCell className="py-4">
                          <span className="inline-flex rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-[12px] font-bold text-[#6E56CF]">
                            {formatearFecha(solicitud.fechaConsulta)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Link
                            href={`/dashboard/formularioDetalle/${idFormulario}`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#6E56CF]" />
                            Ver detalle
                          </Link>
                        </TableCell>
                        <TableCell className="py-4">
                          <select
                            value={estadoSolicitud}
                            onChange={(event) => cambiarEstadoSolicitud(idFormulario, event.target.value)}
                            disabled={actualizandoEstadoId === idFormulario}
                            className={`h-8 min-w-[120px] rounded-lg border px-2.5 text-[11px] font-bold outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70 ${obtenerClaseEstado(estadoSolicitud)}`}
                          >
                            {estadosSolicitud.map((estado) => (
                              <option key={estado.valor} value={estado.valor}>
                                {estado.valor}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell className="py-4">
                          <select
                            value={profesionalAsignado}
                            onChange={(event) => asignarProfesional(idFormulario, event.target.value)}
                            disabled={actualizandoProfesionalId === idFormulario || cargandoProfesionales}
                            className="h-10 w-full min-w-[210px] rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-bold text-slate-700 outline-none transition focus:border-[#6E56CF] focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {[...new Set([profesionalAsignado, ...profesionalesDisponibles])].map((profesional) => (
                              <option key={profesional} value={profesional}>
                                {profesional}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                      </TableRow>
                      );
                    })
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
