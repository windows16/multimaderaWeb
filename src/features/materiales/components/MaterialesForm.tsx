import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { Material } from "@/features/materiales/models/Material"
import { insertMaterial, updateMaterial } from "../services/materiales-service"

interface MaterialsFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  materialEditar: Material | null
}

const FormVacio: Material = {
  idMaterial: null,
  descripcion: "",
  precioAlquiler: null,
}

export default function MaterialsForm({ isOpen, onClose, onSuccess, materialEditar }: MaterialsFormProps) {
  const esEdicion = !!materialEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: materialEditar,
    isOpen,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && materialEditar) {
        await updateMaterial({ ...form })
      } else {
        await insertMaterial({...form})
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
      titulo="Material" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">descripcion</Label>
        <Input name="descripcion" value={form.descripcion} onChange={handleChange} required placeholder="tabla de 10 pies" />
      </div>

      <div>
        <Label className="text-gray-700 mb-1">precio de alquiler</Label>
        <Input name="precioAlquiler" type="number" value={form.precioAlquiler ?? 0} onChange={handleChange} required placeholder="100.00" />
      </div>

    </ModalForm>
  )
}