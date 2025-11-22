import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Flow Rental · Motos y Ebikes en Bocas del Toro",
  description: "Alquiler de motos y ebikes para disfrutar Bocas del Toro a tu ritmo."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-flow-beige text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
