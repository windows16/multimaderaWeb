import { useEffect, useState } from "react"
import { useError } from "./useError"

export function useFetch<TData>(fetchFn: () => Promise<TData[]>) {
  const [items, setItems] = useState<TData[]>([])
  const { error, handleError } = useError()

  async function recargar() {
    try {
      const data = await fetchFn()
      setItems(data)
    } catch (err) {
      handleError(err)
    }
  }

  useEffect(() => {
    recargar()
  }, [])

  return { items, error, recargar, handleError }
}