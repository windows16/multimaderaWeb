import { Label } from "@/components/ui/label"
import ModalForm from "@/components/layout/ModalForm"
import { useForm } from "@/hooks/useForm"
import { createAuthUser } from "@/features/usuarios/services/usuarios-service"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface CreateAuthUserFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const FormVacio = {
  email: "",
  password: "",
  confirm: ""
}

export default function CreateAuthUserForm({ isOpen, onClose, onSuccess }: CreateAuthUserFormProps) {
  const { form, setForm, cargando, setCargando, error, handleError, clearError } = useForm({ formVacio: FormVacio as any, itemEditar: null, isOpen })
  const [confirm, setConfirm] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()

    const email = form.email?.trim()
    const password = form.password || ""

    if (!email) {
      handleError(new Error("El correo es requerido"))
      return
    }
    if (password.length < 6) {
      handleError(new Error("La contraseña debe tener al menos 6 caracteres"))
      return
    }
    if (password !== confirm) {
      handleError(new Error("Las contraseñas no coinciden"))
      return
    }

    setCargando(true)
    try {
      await createAuthUser({ email, password })
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
    <ModalForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} titulo="Crear cuenta (Auth)" esEdicion={false} cargando={cargando} error={error}>
      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Correo</Label>
        <Input name="email" value={form.email} onChange={(e) => setForm((p: any) => ({ ...p, email: e.target.value }))} required/>
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Contraseña</Label>
        <Input name="password" type="password" value={form.password} onChange={(e) => setForm((p: any) => ({ ...p, password: e.target.value }))} required/>
        <p className="text-xs text-gray-500 mt-1">La contraseña temporaria asignada al usuario. Se le puede pedir cambiarla.</p>
      </div>

      <div className="col-span-2">
        <Label className="block text-gray-700 mb-1">Confirmar contraseña</Label>
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required/>
      </div>
    </ModalForm>
  )
}
