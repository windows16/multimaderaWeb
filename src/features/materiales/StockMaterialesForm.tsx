import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { StockMaterial, StockMaterialForm } from "@/types/Materiales/StockMaterial"
import { getAllMateriales, insertStockMaterial, updateStockMaterial } from "@/services/materiales-service"
import { ComboboxField } from "@/components/common/ComboboxField"
import { useQuery } from "@tanstack/react-query"

interface StockMaterialesFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  stockMaterialEditar: StockMaterial | null
}

const FormVacio: StockMaterialForm = {
  idStock: null,
  idMaterial: null,
  stock: null
}

export default function StockMaterialesForm({ isOpen, onClose, onSuccess, stockMaterialEditar }: StockMaterialesFormProps) {
  const esEdicion = !!stockMaterialEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: stockMaterialEditar,
    isOpen,
  })

  const { data: materiales = [], isLoading } = useQuery({
    queryKey: ["materiales"],
    queryFn: getAllMateriales,
    enabled: isOpen 
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && stockMaterialEditar) {
        await updateStockMaterial({ ...form })
      } else {
        await insertStockMaterial({...form})
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
      titulo="StockMaterial" esEdicion={esEdicion} cargando={cargando} error={error}>

        <div className="col-span-2">
            <Label className="block text-gray-700 mb-1">material</Label>
            <ComboboxField
                items={materiales}
                selectedValue={form.idMaterial}
                getValue={(p) => p.idMaterial}
                getLabel={(p) => p.descripcion}
                renderItem={(p) => `${p.idMaterial} - ${p.descripcion}`}
                placeholder="Selecciona un material"
                isLoading={isLoading}
                onChange={(data) => setForm((prev) => ({ ...prev, idMaterial: data as number }))}
            />
        </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">stock</Label>
        <Input name="stock" type="number" value={form.stock ?? 0} onChange={handleChange} required placeholder="100" />
      </div>

    </ModalForm>
  )
}