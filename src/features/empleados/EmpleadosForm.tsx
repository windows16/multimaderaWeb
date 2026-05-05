import { useQuery } from "@tanstack/react-query"
import { FaTimes, FaEdit, FaUserPlus } from "react-icons/fa"
import { getAllPuestos, insertEmpleado, updateEmpleado } from "../../services/empleados-service"
import type { Empleado, FormEmpleado } from "../../types/Empleados/Empleado"
import ErrorAlert from "../../components/ErrorAlert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { useForm } from "@/hooks/useForm"
import { ComboboxField } from "@/components/ComboboxField"
import ModalForm from "@/components/ModalForm"


interface EmpleadosFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  empleadoEditar: Empleado | null
}

const FormVacio: FormEmpleado = {
  numeroDeEmpleado: null,
  nombre: "",
  telefono: "",
  fechaNacimiento: "",
  dpi: "",
  idPuesto: null
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

  const { data: puestos = [], isLoading } = useQuery({
    queryKey: ["puestos"],
    queryFn: getAllPuestos,
    enabled: isOpen 
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      
      if (esEdicion && empleadoEditar) {
        await updateEmpleado({ ...form })
      } else {
        await insertEmpleado({...form as Omit<FormEmpleado, "numeroDeEmpleado">})
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
      titulo="Empleado" esEdicion={esEdicion} cargando={cargando} error={error}>

      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Nombre completo</Label>
        <Input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Gerber Valencia" />
      </div>

      <div>
        <Label className="text-gray-700 mb-1">Teléfono</Label>
        <Input name="telefono" type="number" value={form.telefono} onChange={handleChange} required placeholder="5555-1234" />
      </div>

      <div>
        <Label className="text-gray-700 mb-1">Fecha de Nacimiento</Label>
        <Input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required />
      </div>

      <div>
        <Label className="block text-gray-700 mb-1">DPI</Label>
        <Input name="dpi" type="number" value={form.dpi} onChange={handleChange} required placeholder="0000 00000 0000" />
      </div>

      <div>
        <Label className="block text-gray-700 mb-1">Puesto</Label>
        <ComboboxField
          items={puestos}
          selectedValue={form.idPuesto}
          getValue={(p) => p.idPuesto}
          getLabel={(p) => p.puesto}
          renderItem={(p) => `${p.idPuesto} - ${p.puesto}`}
          placeholder="Selecciona un puesto"
          isLoading={isLoading}
          onChange={(data) => setForm((prev) => ({ ...prev, idPuesto: data as number }))}
        />
      </div>

    </ModalForm>
  )
}