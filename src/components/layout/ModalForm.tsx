import { FaTimes, FaEdit, FaPlus } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import ErrorAlert from "@/components/common/ErrorAlert"

interface ModalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  titulo: string
  esEdicion: boolean
  cargando: boolean
  error: string | null
  children: React.ReactNode
  hideClose?: boolean
}

export default function ModalForm({ isOpen, onClose, onSubmit, titulo, esEdicion, cargando, error, hideClose = false, children }: ModalFormProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header — fijo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-gray-800">
            {esEdicion ? <FaEdit className="text-amber-600" /> : <FaPlus className="text-blue-600" />}
            <h2 className="text-lg font-semibold">
              {esEdicion ? `Editar ${titulo}` : `Nuevo ${titulo}`}
            </h2>
          </div>
          {!hideClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <FaTimes />
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">

          {/* Campos — scrolleable */}
          <div className="overflow-y-auto flex-1 px-6 py-5 grid grid-cols-2 gap-4 content-start">
            {children}
            <ErrorAlert error={error} title="Error al guardar" />
          </div>

          {/* Botones — fijos al fondo */}
          <div className="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            {!hideClose && (
              <Button variant="outline" type="button" onClick={onClose} disabled={cargando}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={cargando} className="bg-blue-600">
              {cargando ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
            </Button>
          </div>

        </form>

      </div>
    </div>
  )
}