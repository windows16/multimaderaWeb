import { useQuery } from "@tanstack/react-query"
import { getAllEmpleados, getAllPuestos, insertHistoricoEmpleado, updateHistoricoEmpleado } from "../../services/empleados-service"
import type { FormHistoricoLaboral, HistoricoLaboral } from "../../types/Empleados/HistoricoLaboral"
import type { Empleado } from "../../types/Empleados/Empleado"
import type { Puesto } from "../../types/Empleados/Puesto"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import { ComboboxField } from "@/components/common/ComboboxField"
import ModalForm from "@/components/layout/ModalForm"

interface HistoricoLaboralFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  historicoEditar: HistoricoLaboral | null
}

const FormVacio: FormHistoricoLaboral = {
  idHistorial: null,
  numeroDeEmpleado: null,
  idPuesto: null,
  fechaInicio: "",
  fechaFin: "",
  tipoMovimiento: "",
  motivo: ""
}

export default function HistoricoLaboralForm({ isOpen, onClose, onSuccess, historicoEditar }: HistoricoLaboralFormProps) {
  const esEdicion = !!historicoEditar && historicoEditar.idHistorial !== 0
  const isAutoPopup = !!historicoEditar?.numeroDeEmpleado && historicoEditar?.idHistorial === 0

  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: historicoEditar,
    isOpen,
    mapearItem: (hist) => ({
      ...hist,
      fechaInicio: hist.fechaInicio?.slice(0, 10) ?? "",
      fechaFin: hist.fechaFin?.slice(0, 10) ?? "",
    }),
  })

  const { data: empleados = [], isLoading: isLoadingEmpleados } = useQuery({
    queryKey: ["empleados"],
    queryFn: getAllEmpleados,
    enabled: isOpen && !esEdicion
  })

  const { data: puestos = [], isLoading: isLoadingPuestos } = useQuery({
    queryKey: ["puestos"],
    queryFn: getAllPuestos,
    enabled: isOpen
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      if (esEdicion && historicoEditar) {
        await updateHistoricoEmpleado({ 
          ...form as FormHistoricoLaboral,
          fechaFin: form.fechaFin ? form.fechaFin : null
        })
      } else {
        if (!form.idPuesto) throw new Error("El idPuesto es requerido para insertar un historial laboral.");
        await insertHistoricoEmpleado({
            ...form as Omit<FormHistoricoLaboral, "idHistorial">,
            fechaFin: form.fechaFin ? form.fechaFin : null
        })
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
      titulo="Movimiento Laboral" esEdicion={esEdicion} cargando={cargando} error={error} hideClose={isAutoPopup}>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Empleado</Label>
        {historicoEditar?.numeroDeEmpleado ? (
           <div className="p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600">
             {historicoEditar?.numeroDeEmpleado} - {historicoEditar?.nombreEmpleado || "Desconocido"}
           </div>
        ) : (
          <ComboboxField
            items={empleados}
            selectedValue={form.numeroDeEmpleado}
            getValue={(e: Empleado) => e.numeroDeEmpleado!}
            getLabel={(e: Empleado) => `${e.numeroDeEmpleado} - ${e.nombre}`}
            renderItem={(e: Empleado) => `${e.numeroDeEmpleado} - ${e.nombre}`}
            placeholder="Selecciona un empleado"
            isLoading={isLoadingEmpleados}
            onChange={(data) => setForm((prev) => ({ ...prev, numeroDeEmpleado: data as number }))}
          />
        )}
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Nuevo Puesto</Label>
        <ComboboxField
          items={puestos}
          selectedValue={form.idPuesto}
          getValue={(p: Puesto) => p.idPuesto!}
          getLabel={(p: Puesto) => p.puesto}
          renderItem={(p: Puesto) => `${p.idPuesto} - ${p.puesto}`}
          placeholder="Selecciona el nuevo puesto"
          isLoading={isLoadingPuestos}
          onChange={(data) => setForm((prev) => ({ ...prev, idPuesto: data as number }))}
        />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Tipo de Movimiento</Label>
        <Input name="tipoMovimiento" value={form.tipoMovimiento} onChange={handleChange} required placeholder="Ej: Promoción, Traslado, Alta..." />
      </div>

      <div className="col-span-1">
        <Label className="text-gray-700 mb-1">Fecha de Inicio</Label>
        <Input name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} required />
      </div>

      <div className="col-span-1">
        <Label className="text-gray-700 mb-1">Fecha de Fin (Opcional)</Label>
        <Input name="fechaFin" type="date" value={form.fechaFin || ""} onChange={handleChange} />
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Motivo / Descripción</Label>
        <Input name="motivo" value={form.motivo} onChange={handleChange} required placeholder="Razón del movimiento..." />
      </div>

    </ModalForm>
  )
}
