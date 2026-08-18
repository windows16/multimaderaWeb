
interface LoadingProps {
  mensaje?: string
}

export function Loading({ mensaje = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">{mensaje}</p>
    </div>
  )
}

interface LoadingErrorProps {
  mensaje?: string
  error?: string | null
  onRetry?: () => void
}

export function LoadingError({
  mensaje = "No se pudo cargar la información. Intente de nuevo.",
  error,
  onRetry,
}: LoadingErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <p className="text-sm text-destructive">{mensaje}</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {onRetry && (
        <button onClick={onRetry} className="text-sm underline text-muted-foreground hover:text-foreground">
          Reintentar
        </button>
      )}
    </div>
  )
}