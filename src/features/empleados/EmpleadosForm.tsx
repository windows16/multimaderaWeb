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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            {esEdicion ? <FaEdit className="text-amber-600" /> : <FaUserPlus className="text-blue-600" />}
            <h2 className="text-lg font-semibold">{esEdicion ? "Editar Empleado" : "Nuevo Empleado"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-2 gap-4">

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
            <Combobox items={puestos}>
              <ComboboxInput
                placeholder="Selecciona un puesto"
                value={
                  puestos.find(p => p.idPuesto === form.idPuesto)?.puesto || ""
                }/>

              <ComboboxContent>
                <ComboboxEmpty>{isLoading ? "Cargando..." : "No encontrado"}</ComboboxEmpty>
                <ComboboxList>
                  {puestos.map((item) => (
                    <ComboboxItem
                      key={item.idPuesto}
                      value={item.puesto}
                      onClick={() => {
                        setForm((prev) => ({...prev,idPuesto: item.idPuesto}))
                      }}>
                      {item.idPuesto} - {item.puesto}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <ErrorAlert error={error} title="Error al guardar" />

          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={onClose} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}
              className="bg-blue-600">
              {cargando ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}