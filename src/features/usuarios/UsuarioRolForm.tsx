import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { UsuarioRolCompleto } from "@/types/Usuarios/UsuarioRol"
import { insertUsuarioRol, updateUsuarioRol } from "@/services/usuarios-service"
import { getAllEmpleados } from "@/services/empleados-service"
import { getAllRoles } from "@/services/usuarios-service"
import { useQuery } from "@tanstack/react-query"
import { ComboboxField } from "@/components/common/ComboboxField"
import type { Empleado } from "@/types/Empleados/Empleado"
import type { Rol } from "@/types/Usuarios/RoleConAccion"

interface UsuarioRolFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  usuarioRolEditar: UsuarioRolCompleto | null
  numeroDeEmpleado: number
}

const FormVacio: Omit<UsuarioRolCompleto, 'idUsuarioRol' | 'fechaCreacion'> = {
  numeroDeEmpleado: 0,
  idRol: 0,
}

export default function UsuarioRolForm({ isOpen, onClose, onSuccess, usuarioRolEditar, numeroDeEmpleado }: UsuarioRolFormProps) {
  const esEdicion = !!usuarioRolEditar

  const { form, setForm, cargando, setCargando, error, handleError, clearError } = useForm({
    formVacio: { ...FormVacio, numeroDeEmpleado } as UsuarioRolCompleto,
    itemEditar: usuarioRolEditar,
    isOpen,
  })

  // Asegurarnos de que el numeroDeEmpleado esté en el form incluso si se abre para crear
  useEffect(() => {
    if (isOpen && !esEdicion) {
      setForm((prev) => ({ ...prev, numeroDeEmpleado }))
    }
  }, [isOpen, esEdicion, numeroDeEmpleado, setForm])

  // Cargar Roles
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles-list"],
    queryFn: getAllRoles,
    enabled: isOpen
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()

    if (!form.numeroDeEmpleado || form.numeroDeEmpleado === 0) {
      handleError(new Error("Debe seleccionar un empleado"))
      return
    }

    if (!form.idRol || form.idRol === 0) {
      handleError(new Error("Debe seleccionar un rol"))
      return
    }

    setCargando(true)
    try {
      if (esEdicion && usuarioRolEditar) {
        await updateUsuarioRol(form.numeroDeEmpleado, form.idRol)
      } else {
        await insertUsuarioRol({
          numeroDeEmpleado: form.numeroDeEmpleado,
          idRol: form.idRol,
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
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titulo="Asignación de Rol"
      esEdicion={esEdicion}
      cargando={cargando}
      error={error}
    >
      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Empleado</Label>
        <div className="p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 font-medium">
          {form.numeroDeEmpleado && form.tblPersonal?.nombre ? `${form.numeroDeEmpleado} - ${form.tblPersonal?.nombre || "Desconocido"}` : `No. Empleado: ${form.numeroDeEmpleado}`}
        </div>
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Rol a asignar</Label>
        <ComboboxField
          items={roles}
          selectedValue={form.idRol === 0 ? null : form.idRol}
          getValue={(r: Rol) => r.idRol!}
          getLabel={(r: Rol) => r.descripcion}
          renderItem={(r: Rol) => r.descripcion}
          placeholder="Selecciona un rol..."
          isLoading={isLoadingRoles}
          onChange={(data) => setForm((prev) => ({ ...prev, idRol: data as number }))}
        />
      </div>
    </ModalForm>
  )
}
