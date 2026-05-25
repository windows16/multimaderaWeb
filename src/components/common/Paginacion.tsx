interface PaginacionProps {
  page: number
  totalPages: number
  onChange: (newPage: number) => void
}

export function Paginacion({ page, totalPages, onChange }: PaginacionProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>
      <button
        className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </div>
  )
}