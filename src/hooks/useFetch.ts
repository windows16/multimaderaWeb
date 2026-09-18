import { useEffect, useState } from "react"
import { useError } from "./useError"

export function useFetch<TData>(fetchFn: () => Promise<TData[]>) {
  const [items, setItems] = useState<TData[]>([])
  const { error, handleError, clearError } = useError()
  const [loading, setLoading] = useState<boolean>(true)

  async function recargar() {
    setLoading(true)
    clearError()
    try {
      const data = await fetchFn()
      setItems(data)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    recargar()
  }, [])

  return { items, error, recargar, handleError, loading }
}