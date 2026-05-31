"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  HeartHandshake,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const camposPaciente = [
  {
    id: "nombre",
    label: "Nombre del paciente",
    placeholder: "Ej: Moira",
    type: "text",
    icon: UserRound,
    autoComplete: "given-name",
  },
  {
    id: "apellidos",
    label: "Apellidos del paciente",
    placeholder: "Ej: Morales Diaz",
    type: "text",
    icon: UserRound,
    autoComplete: "family-name",
  },
  {
    id: "rut",
    label: "RUT del paciente",
    placeholder: "Ej: 174569823",
    type: "text",
    icon: ShieldCheck,
    autoComplete: "off",
  },
  {
    id: "telefono",
    label: "Telefono celular",
    placeholder: "Ej: +56983214477",
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
    id: "direccion",
    label: "Direccion",
    placeholder: "Ej: Las Condes, Chile",
    type: "text",
    icon: MapPin,
    autoComplete: "street-address",
  },
  {
    id: "contactoEmergencia",
    label: "Contacto de emergencia",
    placeholder: "Nombre y telefono de emergencia",
    type: "text",
    icon: Phone,
    autoComplete: "off",
  },
];

const camposResponsable = camposPaciente.map((campo) => {
  const labels = {
    nombre: "Nombre del responsable",
    apellidos: "Apellidos del responsable",
    rut: "RUT del responsable",
  };

  return {
    ...campo,
    label: labels[campo.id] || campo.label,
  };
});

const etiquetasCampos = {
  nombre: "Nombre del paciente",
  apellidos: "Apellidos del paciente",
  rut: "RUT del paciente",
  telefono: "Telefono celular",
  correo: "Correo electronico",
  fechaNacimiento: "Fecha de nacimiento",
  contactoEmergencia: "Contacto de emergencia",
  modalidadAtencion: "Modalidad de atencion",
  convenio: "Convenio",
  otraPersona: "Nombre de la otra persona",
  parentesco: "Parentesco",
  direccion: "Direccion",
  comoNosEncontro: "Como nos encontro",
  disponibilidadPaciente: "Disponibilidad del paciente",
  motivoConsulta: "Motivo de consulta",
};

const bloquesHorarios = [
  "9:00 / 10:00 / 11:00 / 12:00 / 13:00",
  "14:00 / 15:00 / 16:00 / 17:00",
  "17:00 / 18:00",
];

const diasDisponibles = [
  { dia: "Lunes", bloques: bloquesHorarios },
  { dia: "Martes", bloques: bloquesHorarios },
  { dia: "Miercoles", bloques: bloquesHorarios },
  { dia: "Jueves", bloques: bloquesHorarios },
  { dia: "Viernes", bloques: bloquesHorarios },
  { dia: "Sabado", bloques: [bloquesHorarios[0]] },
];

const opcionesComoNosEncontro = [
  "Recomendación",
  "Busqueda en Google",
  "Facebook",
  "Instagram",
  "Convenio",
  "Otro",
];

function limpiarRut(valor) {
  return String(valor || "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "");
}

function validarFormatoRut(rut) {
  const rutLimpio = limpiarRut(rut);
  return /^[0-9A-Z]+$/.test(rutLimpio);
}

function Field({ campo, rut, setRut }) {
  const Icon = campo.icon;
  const esRut = campo.id === "rut";

  return (
    <div className="space-y-2.5">
      <label htmlFor={campo.id} className="text-sm font-bold text-slate-700">
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
          value={esRut ? rut : undefined}
          onChange={esRut ? (event) => setRut(limpiarRut(event.target.value)) : undefined}
          inputMode={esRut ? "text" : undefined}
          pattern={esRut ? "[0-9A-Z]*" : undefined}
          maxLength={esRut ? 9 : undefined}
          required
          minLength={1}
          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 shadow-none transition focus-visible:border-indigo-500 focus-visible:ring-indigo-600"
        />
      </div>
    </div>
  );
}

export default function FormularioSolicitudPage() {
  const [enviando, setEnviando] = useState(false);
  const [rut, setRut] = useState("");
  const [solicitudPara, setSolicitudPara] = useState("para-mi");
  const [modalidadAtencion, setModalidadAtencion] = useState("");
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const usandoResponsable = solicitudPara === "otra-persona";
  const camposContacto = usandoResponsable ? camposResponsable : camposPaciente;

  function alternarHorario(dia, bloque) {
    const valor = `${dia}: ${bloque}`;
    setHorariosSeleccionados((prev) =>
      prev.includes(valor)
        ? prev.filter((item) => item !== valor)
        : [...prev, valor]
    );
  }

  async function enviarSolicitud(event) {
    event.preventDefault();
    if (enviando) return;

    const formulario = event.currentTarget;
    const formData = new FormData(formulario);
    const disponibilidadPaciente = horariosSeleccionados.join(" | ");
    const otraPersona =
      solicitudPara === "para-mi"
        ? "Para mi"
        : String(formData.get("otraPersona") || "").trim();
    const parentesco =
      solicitudPara === "para-mi"
        ? "No aplica"
        : String(formData.get("parentesco") || "").trim();

    const payload = {
      nombre: String(formData.get("nombre") || "").trim(),
      apellidos: String(formData.get("apellidos") || "").trim(),
      rut: limpiarRut(formData.get("rut")),
      telefono: String(formData.get("telefono") || "").trim(),
      correo: String(formData.get("correo") || "").trim(),
      fechaNacimiento: String(formData.get("fechaNacimiento") || "").trim(),
      disponibilidadPaciente,
      motivoConsulta: String(formData.get("motivoConsulta") || "").trim(),
      contactoEmergencia: String(formData.get("contactoEmergencia") || "").trim(),
      modalidadAtencion,
      convenio: String(formData.get("convenio") || "").trim() || "SIN CONVENIO",
      otraPersona,
      parentesco,
      direccion: String(formData.get("direccion") || "").trim(),
      comoNosEncontro: String(formData.get("comoNosEncontro") || "").trim(),
      estadoSolicitud: "Sin asignar",
    };

    const camposObligatorios = Object.entries(payload).filter(
      ([key, value]) => key !== "estadoSolicitud" && !value
    );

    if (camposObligatorios.length > 0) {
      const [primerCampoVacio] = camposObligatorios[0];
      formulario.elements[primerCampoVacio]?.focus();
      return toast.error(`Completa el campo: ${etiquetasCampos[primerCampoVacio]}.`);
    }

    if (!validarFormatoRut(payload.rut)) {
      formulario.elements.rut?.focus();
      return toast.error("Ingresa el RUT sin puntos ni guion. Solo numeros y letras.");
    }

    try {
      setEnviando(true);

      const res = await fetch(`${API}/solicitud/insertarFormulario`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        return toast.error("No se pudo enviar la solicitud. Intenta nuevamente.");
      }

      const respuestaBackend = await res.json();

      if (respuestaBackend.message === true || respuestaBackend.message === "true") {
        formulario.reset();
        setRut("");
        setSolicitudPara("para-mi");
        setModalidadAtencion("");
        setHorariosSeleccionados([]);
        return toast.success("Solicitud enviada correctamente.");
      }

      return toast.error("No se pudo registrar la solicitud. Verifica los datos.");
    } catch (error) {
      console.error(error);
      return toast.error("Error de conexion. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-64 bg-indigo-50" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.76fr_1.24fr]">
          <aside className="rounded-[2rem] bg-indigo-700 p-7 text-white shadow-xl sm:p-9 lg:p-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/50 bg-indigo-600">
              <HeartHandshake className="h-6 w-6" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-indigo-200">
              Solicitud de atencion psicologica
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Fundacion Desarrollo y Dignidad.
            </h1>
            <p className="mt-5 text-base leading-7 text-indigo-100">
              Agustinas 1357 oficina 73-A, Santiago. La atencion consiste en
              sesiones de 50 minutos contados desde la hora de agendamiento.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-indigo-500 bg-indigo-600/35 p-5">
                <p className="text-sm font-bold text-white">
                  Atencion con Psicologo
                </p>
                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Valor de la sesion $25.000. Si tiene convenio, mencionelo en
                  el formulario.
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500 bg-indigo-600/35 p-5">
                <p className="text-sm font-bold text-white">
                  Atencion con Terapeuta en Formacion
                </p>
                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Valor de la sesion $8.000.
                </p>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Datos de solicitud
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Solicitud de atencion psicologica
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Complete los datos del paciente y seleccione los dias y horarios
                en los que puede asistir a sesion.
              </p>
            </div>

            <form className="mt-9 space-y-9" onSubmit={enviarSolicitud} noValidate>
              <section className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Modalidad de atencion</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Seleccione una modalidad para la atencion.
                  </p>
                </div>
                <select
                  name="modalidadAtencion"
                  value={modalidadAtencion}
                  onChange={(event) => setModalidadAtencion(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Seleccione modalidad</option>
                  <option value="Online">Online</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </section>

              <section className="space-y-5">
                <h3 className="text-lg font-bold text-slate-900">
                  ¿Para quien solicita la atencion?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "para-mi", label: "Para mi" },
                    { value: "otra-persona", label: "Para otra persona" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={[
                        "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 text-sm font-bold transition",
                        solicitudPara === item.value
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="solicitudPara"
                        checked={solicitudPara === item.value}
                        onChange={() => setSolicitudPara(item.value)}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>

                {solicitudPara === "otra-persona" && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2.5">
                      <label htmlFor="otraPersona" className="text-sm font-bold text-slate-700">
                        Nombre de la otra persona
                      </label>
                      <div className="relative">
                        <UsersRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="otraPersona"
                          name="otraPersona"
                          placeholder="Ej: Juliana"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label htmlFor="parentesco" className="text-sm font-bold text-slate-700">
                        Parentesco
                      </label>
                      <div className="relative">
                        <UsersRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="parentesco"
                          name="parentesco"
                          placeholder="Ej: Madre"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {usandoResponsable ? "Datos del responsable de contacto" : "Datos del paciente"}
                  </h3>
                  {usandoResponsable && (
                    <p className="mt-1 text-sm text-slate-500">
                      Ingresa los datos de la persona responsable de coordinar la cita y recibir el contacto del equipo.
                    </p>
                  )}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {camposContacto.map((campo) => (
                    <Field key={campo.id} campo={campo} rut={rut} setRut={setRut} />
                  ))}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <label htmlFor="comoNosEncontro" className="text-sm font-bold text-slate-700">
                      Como nos encontro
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        id="comoNosEncontro"
                        name="comoNosEncontro"
                        required
                        defaultValue=""
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="">Seleccione una opcion</option>
                        {opcionesComoNosEncontro.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="convenio" className="text-sm font-bold text-slate-700">
                    Convenio
                  </label>
                  <Input
                    id="convenio"
                    name="convenio"
                    defaultValue="SIN CONVENIO"
                    placeholder="Ej: SIN CONVENIO"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </section>

              <section className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Dias y horarios disponibles
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Seleccione sus preferencias. Esta informacion se guardara
                    como texto en disponibilidad del paciente.
                  </p>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-[760px] w-full border-collapse bg-white text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left text-slate-700">
                        <th className="w-36 border-b border-r border-slate-200 px-4 py-3 font-bold">Dia</th>
                        {bloquesHorarios.map((bloque) => (
                          <th key={bloque} className="border-b border-r border-slate-200 px-4 py-3 font-bold">
                            {bloque}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {diasDisponibles.map((fila) => (
                        <tr key={fila.dia}>
                          <td className="border-r border-t border-slate-200 px-4 py-3 font-bold text-slate-800">
                            {fila.dia}
                          </td>
                          {bloquesHorarios.map((bloque) => {
                            const habilitado = fila.bloques.includes(bloque);
                            const valor = `${fila.dia}: ${bloque}`;
                            const seleccionado = horariosSeleccionados.includes(valor);

                            return (
                              <td key={bloque} className="border-r border-t border-slate-200 p-2">
                                {habilitado ? (
                                  <button
                                    type="button"
                                    onClick={() => alternarHorario(fila.dia, bloque)}
                                    className={[
                                      "h-12 w-full rounded-xl border text-xs font-bold transition",
                                      seleccionado
                                        ? "border-indigo-600 bg-indigo-600 text-white"
                                        : "border-blue-200 bg-blue-100 text-blue-900 hover:bg-blue-200",
                                    ].join(" ")}
                                  >
                                    {seleccionado ? "Seleccionado" : "Disponible"}
                                  </button>
                                ) : (
                                  <div className="h-12 rounded-xl bg-slate-100" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-5">
                <div className="space-y-2.5">
                  <label htmlFor="motivoConsulta" className="text-sm font-bold text-slate-700">
                    Motivo de consulta
                  </label>
                  <Textarea
                    id="motivoConsulta"
                    name="motivoConsulta"
                    required
                    minLength={1}
                    placeholder="Describe brevemente el motivo de la consulta."
                    className="min-h-32 resize-none rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none transition focus-visible:border-indigo-500 focus-visible:ring-indigo-600"
                  />
                </div>
              </section>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  Al enviar, el equipo revisara tus datos para gestionar el
                  contacto y coordinar una posible atencion.
                </p>
                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:bg-slate-400 sm:w-auto"
                >
                  {enviando ? (
                    <>
                      Procesando...
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Enviar solicitud
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
