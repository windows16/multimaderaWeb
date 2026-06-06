import { useEffect, useState } from "react"
import { useError } from "./useError"

interface UseFormProps<TData> {
  formVacio: TData
  itemEditar: TData | null
  isOpen: boolean
  mapearItem?: (item: TData) => TData  // opcional, para transformar datos como slice(0,10)
}

export function useForm<TData>({ formVacio, itemEditar, isOpen, mapearItem }: UseFormProps<TData>) {
  const [form, setForm] = useState<TData>({ ...formVacio })
  const [cargando, setCargando] = useState(false)
  const { error, handleError, clearError } = useError()

  useEffect(() => {
    if (isOpen && itemEditar) {
      setForm(mapearItem ? mapearItem(itemEditar) : { ...itemEditar })
    } else if (isOpen) {
      setForm({ ...formVacio })
    }
    clearError()
  }, [isOpen, itemEditar])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange }
}