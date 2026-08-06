import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { UsuarioVinculado, AuthUser } from "@/types/Usuarios/UsuarioRol"
import { vincularUsuario, getAuthUsers } from "@/services/usuarios-service"
import { getAllEmpleados } from "@/services/empleados-service"
import { useQuery } from "@tanstack/react-query"
import { ComboboxField } from "@/components/common/ComboboxField"
import type { Empleado } from "@/types/Empleados/Empleado"

interface VincularCuentaFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const FormVacio: Omit<UsuarioVinculado, 'idUsuario' | 'fechaCreacion'> = {
  numeroDeEmpleado: 0,
  auth_users_id: "",
}

export default function VincularCuentaForm({ isOpen, onClose, onSuccess }: VincularCuentaFormProps) {
  const { form, setForm, cargando, setCargando, error, handleError, clearError } = useForm({
    formVacio: FormVacio as UsuarioVinculado,
    itemEditar: null,
    isOpen,
  })

  // Cargar Empleados
  const { data: empleados = [], isLoading: isLoadingEmpleados } = useQuery({
    queryKey: ["empleados-list"],
    queryFn: getAllEmpleados,
    enabled: isOpen
  })

  // Cargar Usuarios de Auth
  const { data: authUsers = [], isLoading: isLoadingAuth } = useQuery({
    queryKey: ["auth-users-list"],
    queryFn: getAuthUsers,
    enabled: isOpen
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()

    if (!form.numeroDeEmpleado || form.numeroDeEmpleado === 0) {
      handleError(new Error("Debe seleccionar un empleado"))
      return
    }

    if (!form.auth_users_id) {
      handleError(new Error("Debe seleccionar una cuenta de correo (Supabase Auth)"))
      return
    }

    setCargando(true)
    try {
      await vincularUsuario({
        numeroDeEmpleado: form.numeroDeEmpleado,
        auth_users_id: form.auth_users_id,
      })
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
      titulo="usuario vinculado"
      esEdicion={false}
      cargando={cargando}
      error={error}
    >
      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Empleado</Label>
        <ComboboxField
          items={empleados}
          selectedValue={form.numeroDeEmpleado === 0 ? null : form.numeroDeEmpleado}
          getValue={(e: Empleado) => e.numeroDeEmpleado!}
          getLabel={(e: Empleado) => `${e.numeroDeEmpleado} - ${e.nombre}`}
          renderItem={(e: Empleado) => `${e.numeroDeEmpleado} - ${e.nombre}`}
          placeholder="Selecciona el empleado..."
          isLoading={isLoadingEmpleados}
          onChange={(data) => setForm((prev) => ({ ...prev, numeroDeEmpleado: data as number }))}
        />
        <p className="text-xs text-gray-500 mt-1">El empleado al que se le dará acceso al sistema.</p>
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Cuenta de Correo (Auth)</Label>
        <ComboboxField
          items={authUsers}
          selectedValue={form.auth_users_id === "" ? null : form.auth_users_id}
          getValue={(u: AuthUser) => u.id}
          getLabel={(u: AuthUser) => u.email}
          renderItem={(u: AuthUser) => u.email}
          placeholder="Selecciona el correo registrado..."
          isLoading={isLoadingAuth}
          onChange={(data) => setForm((prev) => ({ ...prev, auth_users_id: data as string }))}
        />
        <p className="text-xs text-gray-500 mt-1">La cuenta registrada en Supabase Authentication.</p>
      </div>
    </ModalForm>
  )
}
