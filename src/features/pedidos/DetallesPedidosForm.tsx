import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { DetallePedido, DetallesPedidoForm } from "@/types/Pedidos/Pedido"
import { insertDetallePedido, updateDetallePedido } from "@/services/pedidos-service"
import { getAllMateriales } from "@/services/materiales-service"
import { ComboboxField } from "@/components/common/ComboboxField"
import { useQuery } from "@tanstack/react-query"

interface DetallesPedidosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  detalleEditar: DetallePedido | null
  idPedidoActual: number
}

const FormVacio: DetallesPedidoForm = {
  idDetallePedido: null,
  idPedido: 0,
  idMaterial: null,
  cantidad: null
}

export default function DetallesPedidosForm({ isOpen, onClose, onSuccess, detalleEditar, idPedidoActual }: DetallesPedidosFormProps) {
  const esEdicion = !!detalleEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: { ...FormVacio, idPedido: idPedidoActual },
    itemEditar: detalleEditar,
    isOpen,
  })

  const { data: materiales = [], isLoading: loadingMateriales } = useQuery({
    queryKey: ["materiales-dropdown"],
    queryFn: () => getAllMateriales(),
    enabled: isOpen,
    select: (resultadoPaginado) => resultadoPaginado.data
  })
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && detalleEditar) {
        await updateDetallePedido(detalleEditar.idDetallePedido!, { ...form })
      } else {
        await insertDetallePedido({ ...form })
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
      titulo="Detalle de Pedido" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Material</Label>
        <ComboboxField
          items={materiales}
          selectedValue={form.idMaterial}
          getValue={(m) => m.idMaterial}
          getLabel={(m) => m.descripcion}
          renderItem={(m) => `${m.idMaterial} - ${m.descripcion}`}
          placeholder="Selecciona un material"
          isLoading={loadingMateriales}
          onChange={(data) => setForm((prev) => ({ ...prev, idMaterial: data as number }))}
        />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Cantidad</Label>
        <Input
          name="cantidad"
          type="number"
          value={form.cantidad ?? 0}
          onChange={handleChange}
          required
          placeholder="0"
        />
      </div>

    </ModalForm>
  )
}
