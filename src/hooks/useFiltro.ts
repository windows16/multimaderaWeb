import { useState } from "react"

export function useFiltro<T>(items: T[]) {
  const [campoFiltro, setCampoFiltro] = useState("")
  const [valorFiltro, setValorFiltro] = useState("")
  const [valorCombobox, setValorCombobox] = useState("")

  const valoresFiltro = campoFiltro
    ? [...new Set(items.map((item) => item[campoFiltro as keyof T]?.toString()))]
    : []

  const itemsFiltrados = items.filter((item) => {
    if (!campoFiltro || !valorFiltro) return true
    const valor = item[campoFiltro as keyof T]?.toString().toLowerCase()
    return valor?.includes(valorFiltro.toLowerCase())
  })

  const limpiarFiltro = () => {
    setCampoFiltro("")
    setValorFiltro("")
    setValorCombobox("")
  }

  return {
    campoFiltro, setCampoFiltro,
    valorFiltro, setValorFiltro,
    valorCombobox, setValorCombobox,
    valoresFiltro,
    itemsFiltrados,
    limpiarFiltro,
  }
}