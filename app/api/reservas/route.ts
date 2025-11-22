import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type TipoVehiculo = "SCOOTER_150" | "NAVI_100" | "EBIKE_26" | "EBIKE_20";
type TipoAlquiler = "FULL_DAY" | "24H";

interface ReservaPayload {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  hotel: string;
  cedulaPasaporte: string;
  licenciaLink: string;
  tipoVehiculo: TipoVehiculo;
  tipoAlquiler: TipoAlquiler;
  fechaRecogida: string; // "YYYY-MM-DD"
  horaRecogida: string; // "HH:MM"
  comentarios: string;
}

function isValidTipoVehiculo(value: string): value is TipoVehiculo {
  return ["SCOOTER_150", "NAVI_100", "EBIKE_26", "EBIKE_20"].includes(value);
}

function isValidTipoAlquiler(value: string): value is TipoAlquiler {
  return ["FULL_DAY", "24H"].includes(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ReservaPayload>;

    const {
      nombre,
      apellido,
      email,
      telefono,
      hotel = "",
      cedulaPasaporte,
      licenciaLink = "",
      tipoVehiculo,
      tipoAlquiler,
      fechaRecogida,
      horaRecogida,
      comentarios = ""
    } = body;

    const missing: string[] = [];

    if (!nombre) missing.push("nombre");
    if (!apellido) missing.push("apellido");
    if (!email) missing.push("email");
    if (!telefono) missing.push("telefono");
    if (!cedulaPasaporte) missing.push("cedulaPasaporte");
    if (!fechaRecogida) missing.push("fechaRecogida");
    if (!horaRecogida) missing.push("horaRecogida");
    if (!tipoVehiculo) missing.push("tipoVehiculo");
    if (!tipoAlquiler) missing.push("tipoAlquiler");

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Faltan campos obligatorios: " + missing.join(", ")
        },
        { status: 400 }
      );
    }

    if (!isValidTipoVehiculo(tipoVehiculo as string)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipo de vehículo no válido."
        },
        { status: 400 }
      );
    }

    if (!isValidTipoAlquiler(tipoAlquiler as string)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipo de alquiler no válido."
        },
        { status: 400 }
      );
    }

    const payload: ReservaPayload = {
      nombre,
      apellido,
      email,
      telefono,
      hotel,
      cedulaPasaporte,
      licenciaLink,
      tipoVehiculo: tipoVehiculo as TipoVehiculo,
      tipoAlquiler: tipoAlquiler as TipoAlquiler,
      fechaRecogida,
      horaRecogida,
      comentarios
    };

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      // La URL real del Apps Script se configura en la variable de entorno
      // GOOGLE_APPS_SCRIPT_URL en Vercel.
      return NextResponse.json(
        {
          success: false,
          message:
            "Falta configurar la variable de entorno GOOGLE_APPS_SCRIPT_URL."
        },
        { status: 500 }
      );
    }

    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    let scriptData: { success?: boolean; message?: string } | null = null;

    try {
      scriptData = (await scriptResponse.json()) as {
        success?: boolean;
        message?: string;
      };
    } catch (e) {
      scriptData = null;
    }

    if (scriptResponse.ok && scriptData?.success) {
      return NextResponse.json(
        {
          success: true,
          message: "Reserva guardada en hoja de cálculo."
        },
        { status: 200 }
      );
    }

    const errorMessage =
      scriptData?.message ||
      `Error al llamar al Apps Script (status ${scriptResponse.status}).`;

    return NextResponse.json(
      {
        success: false,
        message: errorMessage
      },
      { status: 500 }
    );
  } catch (err) {
    console.error("Error en /api/reservas:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno al procesar la reserva."
      },
      { status: 500 }
    );
  }
}
