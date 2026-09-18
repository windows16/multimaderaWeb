import type { ReactNode } from "react"
import ErrorAlert from "@/components/common/ErrorAlert"
import SearchBar from "@/components/common/SearchBar"
import RecordCount from "@/components/common/RecordCount"
import FabButton from "@/components/common/FabButton"
import PageHeader, {type MenuOption } from "@/components/layout/PageHeader"
import { FaPlus } from "react-icons/fa"

interface MaestroLayoutProps {
  title: string
  menuOptions?: MenuOption[]
  // Busqueda simple (opcional)
  busqueda?: string
  onBusquedaChange?: (v: string) => void
  searchPlaceholder?: string
  // RecordCount
  recordCount?: number
  // Extras junto al RecordCount (ej: PanelFiltros.Trigger)
  toolbarExtras?: ReactNode
  // Error y Loading
  error: string | null
  loading?: boolean
  paginacion?: ReactNode
  onAgregar?: () => void
  children: ReactNode
}

export default function MaestroLayout({
  title, menuOptions,
  busqueda, onBusquedaChange, searchPlaceholder,
  recordCount, toolbarExtras,
  error, loading, paginacion, onAgregar, children,
}: MaestroLayoutProps) {
  return (
    <div>
      <PageHeader title={title} menuOptions={ !error && !loading ? menuOptions : undefined } />

      {!error && busqueda !== undefined && (
        <SearchBar
          value={busqueda}
          onChange={onBusquedaChange!}
          placeholder={searchPlaceholder}
        />
      )}

      {!error && !loading && recordCount !== undefined  && (
        <div className="flex gap-4 mb-4">
          <RecordCount count={loading ? 0 : recordCount} />
          {toolbarExtras}
        </div>
      )}

      {!loading && error && <ErrorAlert error={error} />}

      {children}

      {!error && !loading && paginacion}

      {!error && !loading && onAgregar && (
        <FabButton onClick={onAgregar} icon={<FaPlus size={20} />} />
      )}
    </div>
  )
}