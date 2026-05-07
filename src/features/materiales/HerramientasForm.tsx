import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { Herramienta } from "@/types/Materiales/Herramientas"
import { insertHerramienta, updateHerramienta } from "@/services/materiales-service"

interface HerramientasFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  herramientaEditar: Herramienta | null
}

const FormVacio: Herramienta = {
  idHerramienta: null,
  descripcion: "",
  precioAlquiler: null,
}

export default function HerramientasForm({ isOpen, onClose, onSuccess, herramientaEditar }: HerramientasFormProps) {
  const esEdicion = !!herramientaEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: herramientaEditar,
    isOpen,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && herramientaEditar) {
        await updateHerramienta({ ...form })
      } else {
        await insertHerramienta({...form})
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
      titulo="Herramienta" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">descripcion</Label>
        <Input name="descripcion" value={form.descripcion} onChange={handleChange} required placeholder="Juan Carlos" />
      </div>

      <div>
        <Label className="text-gray-700 mb-1">precio de alquiler</Label>
        <Input name="precioAlquiler" type="number" value={form.precioAlquiler ?? 0} onChange={handleChange} required placeholder="100.00" />
      </div>

    </ModalForm>
  )
}