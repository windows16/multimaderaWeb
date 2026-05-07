import { useState } from "react"
import { FaTimes, FaUserMinus } from "react-icons/fa"
import { deleteEmpleado } from "../../services/empleados-service"
import type { Empleado } from "../../types/Empleados/Empleado"
import ErrorAlert from "../../components/common/ErrorAlert"
import { getErrorMessage } from "../../utils/Functions"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface BajaEmpleadosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  empleado: Empleado | null
}

export default function BajaEmpleadosForm({ isOpen, onClose, onSuccess, empleado }: BajaEmpleadosFormProps) {
  const [motivoBaja, setMotivoBaja] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setMotivoBaja("")
    setError(null)
    onClose()
  }

  async function handleConfirmar() {
    if (!empleado || !motivoBaja.trim()) return
    setCargando(true)
    setError(null)
    try {
      await deleteEmpleado(empleado.numeroDeEmpleado!, motivoBaja.trim())
      onSuccess()
      handleClose()
    } catch (err: any) {
      setError(getErrorMessage(err))
    } finally { 
      setCargando(false)
    }
  }

  if (!isOpen || !empleado) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-600">
            <FaUserMinus />
            <h2 className="text-lg font-semibold">Dar de Baja</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Estás a punto de dar de baja a{" "}
            <span className="font-semibold text-gray-900">
              {empleado.numeroDeEmpleado} — {empleado.nombre}
            </span>
            . Esta acción no se puede deshacer.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de baja <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={motivoBaja}
              onChange={(e) => setMotivoBaja(e.target.value)}
              rows={3}
              placeholder="Descripcion motivo de baja..."
            />
          </div>

          <ErrorAlert error={error} title="Error al dar de baja"/>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" onClick={handleConfirmar}
              disabled={cargando || !motivoBaja.trim()}
              className="bg-red-600">
              {cargando ? "Procesando..." : "Confirmar Baja"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}