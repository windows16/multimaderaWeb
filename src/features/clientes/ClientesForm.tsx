
import { FaTimes, FaEdit, FaUserPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ErrorAlert from "@/components/ErrorAlert"
import type { Cliente, FormCliente } from "@/types/Clientes/Cliente"
import { insertCliente, updateCliente } from "@/services/clientes-service"
import { useForm } from "@/hooks/useForm"
import { ComboboxField } from "@/components/ComboboxField"
import { useQuery } from "@tanstack/react-query"
import { getAllTiposCliente } from "@/services/tipos-cliente-service"

interface ClientesFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clienteEditar: Cliente | null
}

const FormVacio: FormCliente = {
  numeroDeCliente: null,
  nombre: "",
  telefono: "",
  idTipoCliente: null
}

export default function ClientesForm({ isOpen, onClose, onSuccess, clienteEditar }: ClientesFormProps) {
  const esEdicion = !!clienteEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: clienteEditar,
    isOpen,
  })

  const { data: tiposCliente = [], isLoading } = useQuery({
    queryKey: ["tiposCliente"],
    queryFn: getAllTiposCliente,
    enabled: isOpen 
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && clienteEditar) {
        await updateCliente({ ...form })
      } else {
        await insertCliente({...form})
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
            <h2 className="text-lg font-semibold">{esEdicion ? "Editar Cliente" : "Nuevo Cliente"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-2 gap-4">

          <div className="col-span-2">
            <Label className="text-gray-700 mb-1">nombre</Label>
            <Input name="nombre" type="number" value={form.nombre} onChange={handleChange} required placeholder="Juan Carlos" />
          </div>

          <div>
            <Label className="text-gray-700 mb-1">teléfono</Label>
            <Input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="1234-7890" />
          </div>

          <div>
            <Label className="block text-gray-700 mb-1">tipo de cliente</Label>
            <ComboboxField
              items={tiposCliente}
              selectedValue={form.idTipoCliente}
              getValue={(p) => p.idTipoCliente}
              getLabel={(p) => p.descripcion}
              renderItem={(p) => `${p.idTipoCliente} - ${p.descripcion}`}
              placeholder="Selecciona un tipo de cliente"
              isLoading={isLoading}
              onChange={(data) => setForm((prev) => ({ ...prev, idTipoCliente: data as number }))}
            />
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