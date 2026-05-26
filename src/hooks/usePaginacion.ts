import { useState, useEffect, useCallback } from "react"

interface UsePaginacionProps<T> {
  fetchFn: (page: number, limit: number, search: string) => Promise<{ 
    data: T[]; 
    meta: { total: number; totalPages: number } 
  }>
  initialLimit?: number
  search?: string
}

export function usePaginacion<T>({ fetchFn, initialLimit = 10, search = "" }: UsePaginacionProps<T>) {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [errorPaginacion, setErrorPaginacion] = useState<any>(null)
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 })

  // 1. Una única función encargada de pedir los datos al servidor
  const cargarDatos = useCallback(async (paginaDestino: number, textoBusqueda: string) => {
    setLoading(true)
    setErrorPaginacion(null)
    try {
      const respuesta = await fetchFn(paginaDestino, initialLimit, textoBusqueda.trim())
      
      if (respuesta && Array.isArray(respuesta.data)) {
        setItems(respuesta.data)
        setMeta({
          total: respuesta.meta?.total ?? 0,
          totalPages: respuesta.meta?.totalPages ?? 0,
        })
      }
    } catch (err: any) {
      setErrorPaginacion(err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [fetchFn, initialLimit])

  // 2. EFECTO A: Escucha ÚNICAMENTE cuando el usuario cambia de página
  useEffect(() => {
    cargarDatos(page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]) // Moverse entre páginas NO debe depender de 'search'

  // 3. EFECTO B: Escucha ÚNICAMENTE cuando el usuario escribe en la barra de búsqueda
  useEffect(() => {
    setPage(1) // Regresa a la página 1
    cargarDatos(1, search) // Carga la página 1 con el nuevo texto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]) // Buscar NO debe depender de 'page'

  const resetPagina = () => setPage(1)

  return {
    items,
    loading,
    errorPaginacion,
    page,
    setPage,
    meta,
    recargar: () => cargarDatos(page, search),
    resetPagina,
    setErrorPaginacion
  }
}