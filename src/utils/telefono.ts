const CODIGO_PAIS = "502";

export function limpiarTelefono(
  telefono?: string | number | null
): string {
  return String(telefono ?? "").replace(/\D/g, "");
}

export function telefonoParaWhatsapp(
  telefono?: string | number | null
): string {
  const limpio = limpiarTelefono(telefono);
  if (!limpio) return "";

  return limpio.length === 8 ? `${CODIGO_PAIS}${limpio}` : limpio;
}