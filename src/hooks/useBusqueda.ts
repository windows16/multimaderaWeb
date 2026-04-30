import { useState, useMemo } from "react"

export function useBusqueda<T extends object>(items: T[]) {
  const [busqueda, setBusqueda] = useState("")

  const itemsFiltrados = useMemo(() =>
    items.filter((item) =>
      Object.values(item as Record<string, unknown>)
        .join(" ")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    ), [items, busqueda])

  return { busqueda, setBusqueda, itemsFiltrados }
}