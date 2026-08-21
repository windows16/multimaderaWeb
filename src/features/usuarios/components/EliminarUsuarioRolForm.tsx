import { useState } from "react"
import { FaTimes, FaTrash } from "react-icons/fa"
import { deleteUsuarioRol } from "@/features/usuarios/services/usuarios-service"
import type { UsuarioRolCompleto } from "@/features/usuarios/models/UsuarioRol"
import ErrorAlert from "@/components/common/ErrorAlert"
import { getErrorMessage } from "@/utils/Functions"
import { Button } from "@/components/ui/button"

interface EliminarUsuarioRolFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  usuarioRol: UsuarioRolCompleto | null
}

export default function EliminarUsuarioRolForm({ isOpen, onClose, onSuccess, usuarioRol }: EliminarUsuarioRolFormProps) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setError(null)
    onClose()
  }

  async function handleConfirmar() {
    if (!usuarioRol?.idUsuarioRol) return
    setCargando(true)
    setError(null)
    try {
      await deleteUsuarioRol(usuarioRol.idUsuarioRol)
      onSuccess()
      handleClose()
    } catch (err: any) {
      setError(getErrorMessage(err))
    } finally {
      setCargando(false)
    }
  }

  if (!isOpen || !usuarioRol) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-600">
            <FaTrash />
            <h2 className="text-lg font-semibold">Quitar Rol</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Estás a punto de quitarle el rol de{" "}
            <span className="font-semibold text-gray-900">
              {usuarioRol.tblRoles?.descripcion}
            </span>{" "}
            al empleado{" "}
            <span className="font-semibold text-gray-900">
              {usuarioRol.tblPersonal?.nombre}
            </span>
            . ¿Deseas continuar?
          </p>

          <ErrorAlert error={error} title="Error al quitar rol" />

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" type="button" onClick={handleClose} disabled={cargando}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmar}
              disabled={cargando}
              className="bg-red-600 hover:bg-red-700"
            >
              {cargando ? "Procesando..." : "Confirmar Eliminación"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
