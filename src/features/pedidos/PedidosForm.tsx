import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Pedido, CreatePedidoDto, UpdatePedidoDto } from "@/types/Pedidos/Pedido"
import { insertPedido, updatePedido } from "@/services/pedidos-service"
import { useForm } from "@/hooks/useForm"
import { ComboboxField } from "@/components/common/ComboboxField"
import { useQuery } from "@tanstack/react-query"
import { getAllClientes } from "@/services/clientes-service"
import ModalForm from "@/components/layout/ModalForm"

interface PedidosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  pedidoEditar: Pedido | null
}

const FormVacio: CreatePedidoDto = {
  fechaInicio: "",
  fechaFin: "",
  direccion: "",
  propietario: null,
  albanil: null,
  abono: 0,
  deposito: 0,
}

export default function PedidosForm({ isOpen, onClose, onSuccess, pedidoEditar }: PedidosFormProps) {
  const esEdicion = !!pedidoEditar
  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: pedidoEditar,
    isOpen,
  })

  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ["clientes-dropdown"], 
    // Le pasamos un límite alto por defecto (ej. 100) para que el dropdown tenga suficientes opciones
    queryFn: () => getAllClientes(1, 100), 
    enabled: isOpen,
    // La magia: extraemos únicamente el array de clientes para abastecer los Combobox
    select: (resultadoPaginado) => resultadoPaginado.data
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && pedidoEditar) {
        await updatePedido(pedidoEditar.idPedido, form as UpdatePedidoDto)
      } else {
        await insertPedido(form as CreatePedidoDto)
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
      titulo="Pedido" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Fecha Inicio</Label>
        <Input
          name="fechaInicio"
          type="date"
          value={form.fechaInicio}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Fecha Fin</Label>
        <Input
          name="fechaFin"
          type="date"
          value={form.fechaFin}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Dirección</Label>
        <Input
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          required
          placeholder="Calle Principal 123"
        />
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Propietario (Cliente)</Label>
        <ComboboxField
          items={clientes}
          selectedValue={form.propietario}
          getValue={(p) => p.numeroDeCliente}
          getLabel={(p) => p.nombre}
          renderItem={(p) => `${p.numeroDeCliente} - ${p.nombre}`}
          placeholder="Selecciona un cliente"
          isLoading={loadingClientes}
          onChange={(data) => setForm((prev) => ({ ...prev, propietario: data as number }))}
        />
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Albañil (Cliente)</Label>
        <ComboboxField
          items={clientes}
          selectedValue={form.albanil}
          getValue={(e) => e.numeroDeCliente}
          getLabel={(e) => e.nombre}
          renderItem={(e) => `${e.numeroDeCliente} - ${e.nombre}`}
          placeholder="Selecciona un cliente"
          isLoading={loadingClientes}
          onChange={(data) => setForm((prev) => ({ ...prev, albanil: data as number }))}
        />
      </div>

      {esEdicion && (
          <>
            <div className="col-span-2">
              <Label className="text-gray-700 mb-1">Abono</Label>
              <Input
                name="abono"
                type="number"
                value={form.abono}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-gray-700 mb-1">Depósito</Label>
              <Input
                name="deposito"
                type="number"
                value={form.deposito}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </>
        )}

    </ModalForm>
  )
}
