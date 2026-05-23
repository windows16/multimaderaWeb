// hooks/useFiltros.ts
import { useState, useMemo } from "react"
import type { ConfigFiltro, Operador } from "../types/Filtros"

function aplicarFiltro<T>(item: T, { campo, operador, valor }: ConfigFiltro<T>): boolean {
  if (!valor) return true
  const raw = item[campo]?.toString() ?? ""

  switch (operador) {
    case "includes": return raw.toLowerCase().includes(valor.toLowerCase())
    case "equals":   return raw.toLowerCase() === valor.toLowerCase()
    case "gte":      return raw >= valor
    case "lte":      return raw <= valor
  }
}

export function useFiltros<T>(items: T[]) {
  const [filtros, setFiltros] = useState<ConfigFiltro<T>[]>([])

  const setFiltro = (config: ConfigFiltro<T>) =>
    setFiltros(prev => {
      const existe = prev.findIndex(f => f.campo === config.campo && f.operador === config.operador)
      if (existe >= 0) {
        const next = [...prev]
        next[existe] = config
        return next
      }
      return [...prev, config]
    })

  const limpiarFiltro = (campo: keyof T, operador?: Operador) =>
    setFiltros(prev => prev.filter(f => !(f.campo === campo && (!operador || f.operador === operador))))

  const limpiarTodos = () => setFiltros([])

  const filtrosActivos = filtros.filter(f => f.valor !== "")

  const itemsFiltrados = useMemo(() =>
    items.filter(item => filtros.every(f => aplicarFiltro(item, f))),
    [items, filtros]
  )

  return {
    filtros,
    filtrosActivos,
    setFiltro,
    limpiarFiltro,
    limpiarTodos,
    itemsFiltrados,
  }
}