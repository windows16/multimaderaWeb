import { FaTimes, FaEdit, FaPlus } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import ErrorAlert from "@/components/ErrorAlert"

interface ModalFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  titulo: string
  esEdicion: boolean
  cargando: boolean
  error: string | null
  children: React.ReactNode
}

export default function ModalForm({ isOpen, onClose, onSubmit, titulo, esEdicion, cargando, error, children }: ModalFormProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            {esEdicion ? <FaEdit className="text-amber-600" /> : <FaPlus className="text-blue-600" />}
            <h2 className="text-lg font-semibold">
              {esEdicion ? `Editar ${titulo}` : `Nuevo ${titulo}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={onSubmit} className="px-6 py-5 grid grid-cols-2 gap-4">
          {children}

          <ErrorAlert error={error} title="Error al guardar" />

          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={onClose} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando} className="bg-blue-600">
              {cargando ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}