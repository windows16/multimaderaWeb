import { useState } from "react"
import { getErrorMessage } from "../utils/Functions"

export function useError() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => setError(getErrorMessage(err))
  const clearError = () => setError(null)

  return { error, handleError, clearError }
}