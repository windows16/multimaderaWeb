const CODIGO_PAIS = "502" // Guatemala 

export function limpiarTelefono(telefono?: string | null): string {
  return telefono?.replace(/\D/g, "") ?? ""
}

export function telefonoParaWhatsapp(telefono?: string | null): string {
  const limpio = limpiarTelefono(telefono)
  if (!limpio) return ""
  // Número local de 8 dígitos -> se le antepone el código de país.
  // Si ya viene con código de país (más dígitos), se deja igual.
  return limpio.length === 8 ? `${CODIGO_PAIS}${limpio}` : limpio
}