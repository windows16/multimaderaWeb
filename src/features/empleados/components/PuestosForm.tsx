import { insertPuesto, updatePuesto } from "../services/empleados-service"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Puesto, FormPuesto } from "@/features/empleados/models/Puesto"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"

interface PuestosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  puestoEditar: Puesto | null
}

const FormVacio: FormPuesto = {
  idPuesto: null,
  puesto: "",
  descripcion: ""
}

export default function PuestosForm({ isOpen, onClose, onSuccess, puestoEditar }: PuestosFormProps) {
  const esEdicion = !!puestoEditar
  
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: puestoEditar,
    isOpen,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && puestoEditar) {
        await updatePuesto({ ...form })
      } else {
        await insertPuesto({...form as Omit<FormPuesto, "idPuesto">})
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
      titulo="Puesto" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Puesto</Label>
        <Input name="puesto" value={form.puesto} onChange={handleChange} required placeholder="Accionista" />
      </div>

      <div>
        <Label className="text-gray-700 mb-1">Descripción</Label>
        <Input name="descripcion" value={form.descripcion} onChange={handleChange} required placeholder="Gerente de Ventas" />
      </div>

    </ModalForm>
  )
}