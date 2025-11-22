"use client";

import React, { useState } from "react";

type TipoVehiculo = "SCOOTER_150" | "NAVI_100" | "EBIKE_26" | "EBIKE_20";
type TipoAlquiler = "FULL_DAY" | "24H";

interface ReservaForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  hotel: string;
  cedulaPasaporte: string;
  licenciaLink: string;
  tipoVehiculo: TipoVehiculo | "";
  tipoAlquiler: TipoAlquiler | "";
  fechaRecogida: string;
  horaRecogida: string;
  comentarios: string;
}

const initialForm: ReservaForm = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  hotel: "",
  cedulaPasaporte: "",
  licenciaLink: "",
  tipoVehiculo: "",
  tipoAlquiler: "",
  fechaRecogida: "",
  horaRecogida: "",
  comentarios: ""
};

export default function HomePage() {
  const [form, setForm] = useState<ReservaForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSelectVehiculo(tipo: TipoVehiculo) {
    setForm((prev) => ({
      ...prev,
      tipoVehiculo: tipo
    }));
  }

  function handleSelectAlquiler(tipo: TipoAlquiler) {
    setForm((prev) => ({
      ...prev,
      tipoAlquiler: tipo
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const requiredFields: (keyof ReservaForm)[] = [
      "nombre",
      "apellido",
      "email",
      "telefono",
      "cedulaPasaporte",
      "tipoVehiculo",
      "tipoAlquiler",
      "fechaRecogida",
      "horaRecogida"
    ];

    const missing: string[] = [];

    requiredFields.forEach((field) => {
      const value = form[field];
      if (!value) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      setErrorMessage(
        "Por favor completa los campos obligatorios: " +
          missing.join(", ")
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          telefono: form.telefono,
          hotel: form.hotel,
          cedulaPasaporte: form.cedulaPasaporte,
          licenciaLink: form.licenciaLink,
          tipoVehiculo: form.tipoVehiculo,
          tipoAlquiler: form.tipoAlquiler,
          fechaRecogida: form.fechaRecogida,
          horaRecogida: form.horaRecogida,
          comentarios: form.comentarios
        })
      });

      const data: { success?: boolean; message?: string } =
        await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(
          data.message || "Tu solicitud de reserva se ha enviado correctamente."
        );
        setForm(initialForm);
      } else {
        setErrorMessage(
          data.message ||
            "Hubo un problema al enviar la reserva. Intenta nuevamente."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Error de conexión al enviar la reserva. Verifica tu internet e intenta otra vez."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function cardClasses(selected: boolean) {
    return (
      "cursor-pointer rounded-xl border p-4 shadow-sm transition " +
      (selected
        ? "border-orange-500 bg-white"
        : "border-slate-200 bg-[#fdf8f1] hover:border-orange-300")
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-flow-beige/90 backdrop-blur border-b border-slate-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Logo de imagen si la subes */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-flow-rental.png"
              alt="Flow Rental"
              className="h-10 w-auto"
            />
            <span className="font-semibold tracking-wide text-flow-brown">
              Flow Rental
            </span>
          </div>
          <div className="hidden gap-6 text-sm font-medium text-flow-brown md:flex">
            <a href="#flota" className="hover:text-orange-600">
              Flota
            </a>
            <a href="#tarifas" className="hover:text-orange-600">
              Tarifas
            </a>
            <a href="#como-funciona" className="hover:text-orange-600">
              Cómo funciona
            </a>
            <a href="#reservar" className="hover:text-orange-600">
              Reservar
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex h-[70vh] items-center justify-center">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-bocas.jpg"
            alt="Bocas del Toro"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
            Motos y ebikes para vivir Bocas del Toro a tu ritmo
          </h1>
          <p className="mt-4 text-base sm:text-lg">
            Muévete libremente entre playas, hostales y restaurantes con
            vehículos confiables, listos para la aventura.
          </p>
          <a
            href="#reservar"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold shadow-lg hover:bg-orange-600"
          >
            Reservar ahora
          </a>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-12">
        {/* Nuestra flota */}
        <section id="flota">
          <h2 className="text-2xl font-semibold text-flow-brown">
            Nuestra flota
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Motos y ebikes pensadas para moverte cómodo y seguro por Bocas del
            Toro.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {/* Card Scooter */}
            <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/vehiculos/scooter-150.jpg"
                alt="Scooter 150cc"
                className="h-32 w-full rounded-t-xl object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-flow-brown">
                  Scooter 150cc
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Ideal para parejas o amigos que quieren recorrer la isla con
                  comodidad.
                </p>
                <p className="mt-2 text-xs text-slate-500">2 unidades</p>
              </div>
            </article>

            {/* Card Honda Navi */}
            <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/vehiculos/honda-navi.jpg"
                alt="Honda Navi 100cc"
                className="h-32 w-full rounded-t-xl object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-flow-brown">
                  Honda Navi 100cc
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Compacta, fácil de manejar y perfecta para moverte por el
                  pueblo.
                </p>
                <p className="mt-2 text-xs text-slate-500">4 unidades</p>
              </div>
            </article>

            {/* Card Ebike 26 */}
            <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/vehiculos/ebike-26.jpg"
                alt='Ebike grande 26"'
                className="h-32 w-full rounded-t-xl object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-flow-brown">
                  Ebike grande 26"
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Para quienes quieren moverse sin esfuerzo y disfrutar el
                  paisaje.
                </p>
                <p className="mt-2 text-xs text-slate-500">5 unidades</p>
              </div>
            </article>

            {/* Card Ebike 20 */}
            <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/vehiculos/ebike-20.jpg"
                alt='Ebike pequeña 20"'
                className="h-32 w-full rounded-t-xl object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-flow-brown">
                  Ebike pequeña 20"
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Tamaño compacto, ideal para trayectos cortos y calles
                  angostas.
                </p>
                <p className="mt-2 text-xs text-slate-500">4 unidades</p>
              </div>
            </article>
          </div>
        </section>

        {/* Tarifas */}
        <section id="tarifas">
          <h2 className="text-2xl font-semibold text-flow-brown">Tarifas</h2>
          <p className="mt-2 text-sm text-slate-700">
            Precios claros para que solo te preocupes por disfrutar.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-flow-brown">
                Full Day
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                8:00 am – 6:30 pm
              </p>
              <p className="mt-3 text-3xl font-bold text-orange-500">
                $30
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Ideal si quieres moverte todo el día entre playas y el centro
                de Bocas.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-flow-brown">
                24 horas
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Horario flexible
              </p>
              <p className="mt-3 text-3xl font-bold text-orange-500">
                $40
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Perfecto si quieres más libertad de horarios para explorar sin
                prisa.
              </p>
            </article>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona">
          <h2 className="text-2xl font-semibold text-flow-brown">
            Cómo funciona
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-flow-brown">
                1. Envías la solicitud
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Completa el formulario con tus datos, fechas y tipo de
                vehículo.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-flow-brown">
                2. Confirmación por WhatsApp
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Te escribimos para confirmar disponibilidad, método de pago y
                detalles.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-flow-brown">
                3. Entrega y contrato
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                Entregamos la moto o ebike, revisamos juntos el vehículo y
                firmamos el contrato.
              </p>
            </article>
          </div>
        </section>

        {/* Reservar */}
        <section id="reservar">
          <h2 className="text-2xl font-semibold text-flow-brown">
            Reservar
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Completa el formulario y te contactaremos por WhatsApp para
            confirmar tu reserva.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
          >
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-flow-brown">
                    Nombre*
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-flow-brown">
                    Apellido*
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-flow-brown">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-flow-brown">
                  Teléfono / WhatsApp*
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-flow-brown">
                  Hotel / alojamiento
                </label>
                <input
                  type="text"
                  name="hotel"
                  value={form.hotel}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-flow-brown">
                  Cédula / Pasaporte*
                </label>
                <input
                  type="text"
                  name="cedulaPasaporte"
                  value={form.cedulaPasaporte}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-flow-brown">
                  Link a foto de licencia (URL)
                </label>
                <input
                  type="url"
                  name="licenciaLink"
                  value={form.licenciaLink}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              {/* Selección de vehículo */}
              <div>
                <p className="text-xs font-medium text-flow-brown">
                  Tipo de vehículo*
                </p>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div
                    className={cardClasses(form.tipoVehiculo === "SCOOTER_150")}
                    onClick={() => handleSelectVehiculo("SCOOTER_150")}
                  >
                    <p className="text-sm font-semibold text-flow-brown">
                      Scooter 150cc
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Gasolina</p>
                  </div>
                  <div
                    className={cardClasses(form.tipoVehiculo === "NAVI_100")}
                    onClick={() => handleSelectVehiculo("NAVI_100")}
                  >
                    <p className="text-sm font-semibold text-flow-brown">
                      Honda Navi 100cc
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Gasolina</p>
                  </div>
                  <div
                    className={cardClasses(form.tipoVehiculo === "EBIKE_26")}
                    onClick={() => handleSelectVehiculo("EBIKE_26")}
                  >
                    <p className="text-sm font-semibold text-flow-brown">
                      Ebike 26"
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Eléctrica</p>
                  </div>
                  <div
                    className={cardClasses(form.tipoVehiculo === "EBIKE_20")}
                    onClick={() => handleSelectVehiculo("EBIKE_20")}
                  >
                    <p className="text-sm font-semibold text-flow-brown">
                      Ebike 20"
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Eléctrica</p>
                  </div>
                </div>
              </div>

              {/* Tipo de alquiler */}
              <div>
                <p className="text-xs font-medium text-flow-brown">
                  Tipo de alquiler*
                </p>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div
                    className={cardClasses(form.tipoAlquiler === "FULL_DAY")}
                    onClick={() => handleSelectAlquiler("FULL_DAY")}
                  >
                    <p className="text-sm font-semibold text-flow-brown">
                      Full Day
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      8:00 am – 6:30 pm
                    </p>
                  </div>
                  <div
                    className={cardClasses(form.tipoAlquiler === "24H")}
                    onClick={() => handleSelectAlquiler("24H")}
                  >
                    <p className="text-sm font-semibold text-flow-brown">
                      24 horas
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Horario flexible</p>
                  </div>
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-flow-brown">
                    Fecha de recogida*
                  </label>
                  <input
                    type="date"
                    name="fechaRecogida"
                    value={form.fechaRecogida}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-flow-brown">
                    Hora de recogida*
                  </label>
                  <input
                    type="time"
                    name="horaRecogida"
                    value={form.horaRecogida}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <label className="text-xs font-medium text-flow-brown">
                  Comentarios adicionales
                </label>
                <textarea
                  name="comentarios"
                  value={form.comentarios}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-[#fdf8f1] px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Horarios especiales, número de personas, puntos de entrega, etc."
                />
              </div>

              {/* Mensajes y botón */}
              {errorMessage && (
                <p className="text-xs text-red-600">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-xs text-green-600">{successMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitud de reserva"}
              </button>
            </div>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            *Este formulario solo envía una solicitud. La reserva queda
            confirmada cuando te contactamos por WhatsApp y se realiza el pago.
          </p>
        </section>
      </section>

      <footer className="border-t border-slate-200 bg-flow-beige">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Flow Rental. Todos los derechos reservados.</span>
          <span>Bocas del Toro, Panamá</span>
        </div>
      </footer>
    </main>
  );
}
