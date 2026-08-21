import { useQuery } from "@tanstack/react-query"
import { getAllPuestos, insertEmpleado, updateEmpleado } from "../services/empleados-service"
import type { Empleado, FormEmpleado } from "../models/Empleado"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import { ComboboxField } from "@/components/common/ComboboxField"
import ModalForm from "@/components/layout/ModalForm"


interface EmpleadosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data?: any, esEdicion?: boolean) => void
  empleadoEditar: Empleado | null
}

const FormVacio: FormEmpleado = {
  numeroDeEmpleado: null,
  nombre: "",
  telefono: "",
  fechaNacimiento: "",
  dpi: ""
}

export default function EmpleadosForm({ isOpen, onClose, onSuccess, empleadoEditar }: EmpleadosFormProps) {
  const esEdicion = !!empleadoEditar

  const { form, setForm, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: empleadoEditar,
    isOpen,
    mapearItem: (emp) => ({
      ...emp,
      fechaNacimiento: emp.fechaNacimiento?.slice(0, 10) ?? null,
    }),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      let resultado = { ...form } as any;
      if (esEdicion && empleadoEditar) {
        const resUpdate = await updateEmpleado({ ...form })
        if (typeof resUpdate === 'object' && resUpdate !== null) resultado = resUpdate;
      } else {
        const resInsert = await insertEmpleado({...form as Omit<FormEmpleado, "numeroDeEmpleado">})
        if (typeof resInsert === 'object' && resInsert !== null) resultado = resInsert;
        onSuccess(resultado, false)
      }
      
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
      titulo="Empleado" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Nombre completo</Label>
        <Input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Gerber Valencia" />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Teléfono</Label>
        <Input name="telefono" type="number" value={form.telefono} onChange={handleChange} required placeholder="5555-1234" />
      </div>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Fecha de Nacimiento</Label>
        <Input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required />
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">DPI</Label>
        <Input name="dpi" type="number" value={form.dpi} onChange={handleChange} required placeholder="0000 00000 0000" />
      </div>

    </ModalForm>
  )
}