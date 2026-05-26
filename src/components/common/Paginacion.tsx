interface PaginacionProps {
  page: number
  totalPages: number
  onChange: (newPage: number) => void
}

/**
 * Genera un array de números de página a mostrar
 * Ej: si estás en página 5 de 10, muestra [3, 4, 5, 6, 7]
 */
function getPaginationRange(
  current: number,
  total: number,
  maxVisible: number = 5
): (number | string)[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []
  const halfWindow = Math.floor(maxVisible / 2)
  let start = Math.max(1, current - halfWindow)
  let end = Math.min(total, start + maxVisible - 1)

  // Ajustar si estamos cerca del final
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  // Agregar primera página si no está visible
  if (start > 1) {
    range.push(1)
    if (start > 2) {
      range.push("...")
    }
  }

  // Agregar rango visible
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  // Agregar última página si no está visible
  if (end < total) {
    if (end < total - 1) {
      range.push("...")
    }
    range.push(total)
  }

  return range
}

export function Paginacion({ page, totalPages, onChange }: PaginacionProps) {
  
  if (totalPages === 0) return null
  
  const isFirstPage = page === 1
  const isLastPage = page === totalPages
  const paginationRange = getPaginationRange(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Botón Anterior */}
      <button
        className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-transparent transition-colors"
        disabled={isFirstPage}
        onClick={() => onChange(page - 1)}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {paginationRange.map((num, idx) => {
          if (num === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400">
                …
              </span>
            )
          }

          const pageNum = num as number
          const isActive = pageNum === page

          return (
            <button
              key={pageNum}
              onClick={() => onChange(pageNum)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white border border-blue-500"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              aria-label={`Página ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      {/* Botón Siguiente */}
      <button
        className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-transparent transition-colors"
        disabled={isLastPage}
        onClick={() => onChange(page + 1)}
        aria-label="Página siguiente">
        Siguiente
      </button>
    </div>
  )
}