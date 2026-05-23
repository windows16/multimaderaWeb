// hooks/usePanelFiltros.ts
import { useState } from "react"

export function usePanelFiltros() {
  const [abierto, setAbierto] = useState(false)
  const toggle = () => setAbierto(prev => !prev)
  return { abierto, toggle }
}