import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import ModalForm from "@/components/layout/ModalForm"
import type { DetallePedido, CreateDetallePedidoDto, UpdateDetallePedidoDto } from "@/features/pedidos/models/Pedido"
import {
  insertDetallePedido,
  updateDetallePedido,
  deleteDetallePedido,
} from "@/features/pedidos/services/pedidos-service"
import { getAllMateriales } from "../../materiales/services/materiales-service"
import { ComboboxField } from "@/components/common/ComboboxField"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { FaMinus, FaPlus } from "react-icons/fa"
import { useError } from "@/hooks/useError"

interface DetallesPedidosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  detallesEditar: DetallePedido[] | null
  idPedidoActual: number
}

type FilaDetalle =
  Omit<DetallePedido, "idPedido" | "total" | "material" | "cantidad"> & {
    _id: number
    cantidad: number | null
  }

function esFilaValida(
  fila: FilaDetalle
): fila is FilaDetalle & {
  idMaterial: number
  cantidad: number
} {
  return (
    fila.idMaterial !== null &&
    fila.cantidad !== null &&
    fila.cantidad > 0
  )
}

let _nextId = 1

const nuevaFila = (): FilaDetalle => ({
  _id: _nextId++,
  idDetallePedido: null,
  idMaterial: null,
  cantidad: null,
})

export default function DetallesPedidosForm({
  isOpen,
  onClose,
  onSuccess,
  detallesEditar,
  idPedidoActual,
}: DetallesPedidosFormProps) {
  const esEdicion = detallesEditar !== null

  const [filas, setFilas] = useState<FilaDetalle[]>([nuevaFila()])
  const [filasEliminar, setFilasEliminar] = useState<FilaDetalle[]>([])
  const [cargando, setCargando] = useState(false)
  const {error, handleError, clearError} = useError()

  useEffect(() => {
    if (!isOpen) return

    clearError()
    setFilasEliminar([])

    setFilas(
      esEdicion && detallesEditar.length > 0
        ? detallesEditar.map((d) => ({
            _id: _nextId++,
            idDetallePedido: d.idDetallePedido,
            idMaterial: d.idMaterial,
            cantidad: d.cantidad ?? 1,
          }))
        : [nuevaFila()]
    )
  }, [isOpen, detallesEditar])

  const { data: materiales = [], isLoading: loadingMateriales } = useQuery({
    queryKey: ["materiales-dropdown"],
    queryFn: () => getAllMateriales(),
    enabled: isOpen,
    select: (r) => r.data,
  })

  const agregarFila = () =>
    setFilas((prev) => [...prev, nuevaFila()])

  const eliminarFila = (_id: number) => {
    const fila = filas.find((f) => f._id === _id)

    if (fila?.idDetallePedido) {
      setFilasEliminar((prev) => [...prev, fila])
    }

    setFilas((prev) =>
      prev.length > 1
        ? prev.filter((f) => f._id !== _id)
        : prev
    )
  }

  const actualizarFila = (
    _id: number,
    campo: keyof Omit<FilaDetalle, "_id">,
    valor: number | null
  ) => {
    setFilas((prev) =>
      prev.map((f) =>
        f._id === _id
          ? { ...f, [campo]: valor }
          : f
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()

    const filasValidas = filas.filter(esFilaValida)

    if (filasValidas.length !== filas.length) {
      handleError(
         new Error("Todas las filas deben tener un material y una cantidad mayor a 0.")
      )
      return
    }

    setCargando(true)

    try {
      if (esEdicion) {
        const filasExistentes = filasValidas.filter(
          (f) => f.idDetallePedido !== null
        )

        const filasNuevas = filasValidas.filter(
          (f) => f.idDetallePedido === null
        )

        await Promise.all(
          filasExistentes.map((f) => {
            const dto: UpdateDetallePedidoDto = {
              idPedido: idPedidoActual,
              idMaterial: f.idMaterial,
              cantidad: f.cantidad,
            }

            return updateDetallePedido(
              f.idDetallePedido!,
              dto
            )
          })
        )

        await Promise.all(
          filasNuevas.map((f) => {
            const dto: CreateDetallePedidoDto = {
              idPedido: idPedidoActual,
              idMaterial: f.idMaterial,
              cantidad: f.cantidad,
            }

            return insertDetallePedido(dto)
          })
        )

        await Promise.all(
          filasEliminar
            .filter((f) => f.idDetallePedido !== null)
            .map((f) =>
              deleteDetallePedido(f.idDetallePedido!)
            )
        )
      } else {
        await Promise.all(
          filasValidas.map((f) => {
            const dto: CreateDetallePedidoDto = {
              idPedido: idPedidoActual,
              idMaterial: f.idMaterial,
              cantidad: f.cantidad,
            }

            return insertDetallePedido(dto)
          })
        )
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
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titulo="Detalle"
      esEdicion={esEdicion}
      cargando={cargando}
      error={error}
    >
      <div className="col-span-2 space-y-2">
        <div className="grid grid-cols-[0.7fr_2fr_auto] gap-2 px-1">
          <Label>Cantidad</Label>
          <Label>Material</Label>
          <span />
        </div>

        {filas.map((fila) => (
          <div
            key={fila._id}
            className="grid grid-cols-[0.7fr_2fr_auto] gap-2 items-center">
               <Input
              type="number"
              min={1}
              value={fila.cantidad ?? ""}
              onChange={(e) =>
                actualizarFila(
                  fila._id,
                  "cantidad",
                  e.target.value === ""
                    ? null
                    : e.target.valueAsNumber
                )
              }
              placeholder="0"
            />

            <ComboboxField
              items={materiales}
              selectedValue={fila.idMaterial}
              getValue={(m) => m.idMaterial}
              getLabel={(m) => m.descripcion}
              renderItem={(m) =>
                `${m.idMaterial} - ${m.descripcion}`
              }
              placeholder="Material..."
              isLoading={loadingMateriales}
              onChange={(val) =>
                actualizarFila(
                  fila._id,
                  "idMaterial",
                  val as number
                )
              }
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => eliminarFila(fila._id)}
              disabled={filas.length === 1}
            >
              <FaMinus className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full mt-1 border-dashed"
          onClick={agregarFila}
        >
          <FaPlus className="w-3 h-3 mr-2" />
          Agregar fila
        </Button>
      </div>
    </ModalForm>
  )
}