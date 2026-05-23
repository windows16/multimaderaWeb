// src/utils/Functions.ts
import { format } from "date-fns"

/**
 * Formatea "YYYY-MM-DD" a "dd/MM/yyyy"
 */
export function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-GT", {
      day: "2-digit", month: "short", year: "numeric"
    })
}

/**
 * Formatea fecha con hora (YYYY-MM-DD HH:mm:ss)
 */
export function formatFechaHora(fecha: string): string {
  const date = new Date(fecha)
  return isNaN(date.getTime()) ? "" : format(date, "dd/MM/yyyy HH:mm:ss")
}


export function getErrorMessage(err: any): string {
  const e = err as any
  const mensaje =
    e?.response?.data?.message ||
    e?.response?.data?.error   ||
    e?.response?.data          ||
    e?.message                 ||
    "Error inesperado"

  return typeof mensaje === "string" ? mensaje : JSON.stringify(mensaje, null, 2)
}