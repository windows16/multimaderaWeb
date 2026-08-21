import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Cliente, FormCliente } from "@/features/clientes/models/Cliente"
import { insertCliente, updateCliente } from "@/features/clientes/services/clientes-service"
import { useForm } from "@/hooks/useForm"
import { ComboboxField } from "@/components/common/ComboboxField"
import { useQuery } from "@tanstack/react-query"
import { getAllTiposCliente } from "@/features/clientes/services/clientes-service"
import ModalForm from "@/components/layout/ModalForm"

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
    <ModalForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}
      titulo="Cliente" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">nombre</Label>
        <Input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Juan Carlos" />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">teléfono</Label>
        <Input name="telefono" type="number" value={form.telefono} onChange={handleChange} required placeholder="1234-7890" />
      </div>

      <div className="col-span-2">
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

    </ModalForm>
  )
}