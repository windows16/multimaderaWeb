
import { FaTimes, FaEdit, FaUserPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ErrorAlert from "@/components/ErrorAlert"
import { useForm } from "@/hooks/useForm"
import type { FormTipoCliente, TipoCliente } from "@/types/Clientes/TipoCliente"
import { insertTipoCliente, updateTipoCliente } from "@/services/tipos-cliente-service"
import ModalForm from "@/components/ModalForm"

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
    <ModalForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}
     titulo="Tipo de Cliente" esEdicion={esEdicion} cargando={cargando} error={error}>
      
      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Descripcion</Label>
        <Input name="descripcion" value={form.descripcion} onChange={handleChange} required placeholder="propietario" />
      </div>

    </ModalForm>
  )
}