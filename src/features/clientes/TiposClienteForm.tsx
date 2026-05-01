
import { FaTimes, FaEdit, FaUserPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ErrorAlert from "@/components/ErrorAlert"
import { useForm } from "@/hooks/useForm"
import type { FormTipoCliente, TipoCliente } from "@/types/Clientes/TipoCliente"
import { insertTipoCliente, updateTipoCliente } from "@/services/tipos-cliente-service"

interface TiposClienteFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  tipoClienteEditar: TipoCliente | null
}

const FormVacio: FormTipoCliente = {
  idTipoCliente: null,
  descripcion: ""
}

export default function TiposClienteForm({ isOpen, onClose, onSuccess, tipoClienteEditar }: TiposClienteFormProps) {
  const esEdicion = !!tipoClienteEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: tipoClienteEditar,
    isOpen,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && tipoClienteEditar) {
        await updateTipoCliente({ ...form })
      } else {
        await insertTipoCliente({...form})
      }
      onSuccess()
      onClose()
    } catch (err: any) {  
      handleError(err)
    } finally {
      setCargando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            {esEdicion ? <FaEdit className="text-amber-600" /> : <FaUserPlus className="text-blue-600" />}
            <h2 className="text-lg font-semibold">{esEdicion ? "Editar TipoCliente" : "Nuevo TipoCliente"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-2 gap-4">

          <div className="col-span-2">
            <Label className="text-gray-700 mb-1">Descripcion</Label>
            <Input name="descripcion" value={form.descripcion} onChange={handleChange} required placeholder="propietario" />
          </div>

          <ErrorAlert error={error} title="Error al guardar" />

          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={onClose} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}
              className="bg-blue-600">
              {cargando ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}