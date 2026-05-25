import { useState, useEffect, useCallback } from "react"

// Definimos lo que requiere el hook para operar
interface UsePaginacionProps<T> {
  fetchFn: (page: number, limit: number) => Promise<{ data: T[]; meta: { total: number; totalPages: number } }>
  initialLimit?: number
}

export function usePaginacion<T>({ fetchFn, initialLimit = 10 }: UsePaginacionProps<T>) {
  const [page, setPage] = useState(1)
  const [limit] = useState(initialLimit)
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 })

  // Función para obtener los datos de la API
  const cargarDatos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const respuesta = await fetchFn(page, limit)
      setItems(respuesta.data)
      setMeta({
        total: respuesta.meta.total,
        totalPages: respuesta.meta.totalPages,
      })
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, limit])

  // Ejecutar la carga cada vez que cambie la página o el límite
  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  // Resetear a la página 1 si es necesario (útil si se aplican filtros externos)
  const resetPagina = () => setPage(1)

  return {
    items,
    loading,
    error,
    page,
    setPage,
    meta,
    recargar: cargarDatos,
    resetPagina,
    setError
  }
}