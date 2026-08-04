import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { AccionRol, Rol, ModuloRol } from "@/types/Usuarios/RoleConAccion"
import {
  insertRol,
  updateRol,
  getAccionesByRol,
  createAccionRol,
  deleteAllAccionesByRol,
  getModulosByRol,
  createModuloRol,
  deleteAllModulosByRol
} from "@/services/usuarios-service"
import { FaEye, FaPlus, FaEdit, FaTrash, FaUsers, FaBox, FaAddressBook, FaShoppingCart, FaUserShield } from "react-icons/fa"

interface RolesFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  rolEditar: Rol | null
}

const ACCIONES = [
  { idAccion: 1, label: "Ver",       descripcion: "Permite visualizar registros",     icon: <FaEye className="text-blue-500" /> },
  { idAccion: 2, label: "Crear",     descripcion: "Permite crear nuevos registros",    icon: <FaPlus className="text-green-500" /> },
  { idAccion: 3, label: "Actualizar",descripcion: "Permite modificar registros",       icon: <FaEdit className="text-amber-500" /> },
  { idAccion: 4, label: "Eliminar",  descripcion: "Permite eliminar registros",        icon: <FaTrash className="text-red-500" /> },
]

const MODULOS = [
  { idModulo: 1, label: "Empleados", descripcion: "Gestión de personal", icon: <FaUsers className="text-indigo-500" /> },
  { idModulo: 2, label: "Materiales", descripcion: "Catálogo de materiales", icon: <FaBox className="text-orange-500" /> },
  { idModulo: 3, label: "Clientes", descripcion: "Directorio de clientes", icon: <FaAddressBook className="text-emerald-500" /> },
  { idModulo: 4, label: "Pedidos", descripcion: "Órdenes y pedidos", icon: <FaShoppingCart className="text-purple-500" /> },
  { idModulo: 5, label: "Usuarios", descripcion: "Control de accesos y seguridad", icon: <FaUserShield className="text-cyan-500" /> },
]

const FormVacio: Rol = {
  idRol: null,
  descripcion: "",
}

export default function RolesForm({ isOpen, onClose, onSuccess, rolEditar }: RolesFormProps) {
  const esEdicion = !!rolEditar

  const { form, cargando, setCargando, error, handleError, clearError, handleChange } = useForm({
    formVacio: FormVacio,
    itemEditar: rolEditar,
    isOpen,
  })

  // Acciones seleccionadas (idAccion)
  const [accionesSeleccionadas, setAccionesSeleccionadas] = useState<number[]>([])
  const [cargandoAcciones, setCargandoAcciones] = useState(false)

  // Módulos seleccionados (idModulo)
  const [modulosSeleccionados, setModulosSeleccionados] = useState<number[]>([])
  const [cargandoModulos, setCargandoModulos] = useState(false)

  // Al abrir en modo edición, cargar las acciones y módulos actuales del rol
  useEffect(() => {
    if (isOpen && esEdicion && rolEditar?.idRol) {
      setCargandoAcciones(true)
      getAccionesByRol(rolEditar.idRol)
        .then((acc: AccionRol[]) => setAccionesSeleccionadas(acc.map((a) => a.idAccion)))
        .catch(() => setAccionesSeleccionadas([]))
        .finally(() => setCargandoAcciones(false))
        
      setCargandoModulos(true)
      getModulosByRol(rolEditar.idRol)
        .then((mods: ModuloRol[]) => setModulosSeleccionados(mods.map((m) => m.idModulo)))
        .catch(() => setModulosSeleccionados([]))
        .finally(() => setCargandoModulos(false))
    } else if (isOpen) {
      setAccionesSeleccionadas([])
      setModulosSeleccionados([])
    }
  }, [isOpen, rolEditar])

  function toggleAccion(idAccion: number) {
    setAccionesSeleccionadas((prev) =>
      prev.includes(idAccion) ? prev.filter((a) => a !== idAccion) : [...prev, idAccion]
    )
  }

  function toggleModulo(idModulo: number) {
    setModulosSeleccionados((prev) =>
      prev.includes(idModulo) ? prev.filter((m) => m !== idModulo) : [...prev, idModulo]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    setCargando(true)
    try {
      let idRol: number

      if (esEdicion && rolEditar?.idRol) {
        await updateRol(rolEditar.idRol, { descripcion: form.descripcion })
        idRol = rolEditar.idRol
        // Resetear acciones y recrear las seleccionadas
        await Promise.all([
          deleteAllAccionesByRol(idRol),
          deleteAllModulosByRol(idRol)
        ])
      } else {
        // Crear el rol - el backend devuelve boolean; necesitamos obtener el idRol
        // Creamos el rol y luego recargamos para obtener el idRol
        await insertRol({ descripcion: form.descripcion })
        // Nota: si la API devuelve el rol creado, se usaría aquí
        // Por ahora sincronizamos acciones después de recargar en el maestro
        onSuccess()
        onClose()
        return
      }

      // Asignar acciones seleccionadas
      for (const idAccion of accionesSeleccionadas) {
        await createAccionRol({ idAccion, idRol })
      }

      // Asignar módulos seleccionados
      for (const idModulo of modulosSeleccionados) {
        await createModuloRol({ idModulo, idRol })
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
      titulo="Rol"
      esEdicion={esEdicion}
      cargando={cargando}
      error={error}
    >
      {/* Descripción del rol */}
      <div className="col-span-2">
        <Label className="text-gray-700 mb-1">Nombre del Rol</Label>
        <Input
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          placeholder="Administrador, Vendedor, Almacenista..."
        />
      </div>

      {/* Acciones / Permisos */}
      <div className="col-span-2">
        <Label className="text-gray-700 mb-2 block">Permisos Globales</Label>
        {cargandoAcciones ? (
          <p className="text-sm text-gray-400 italic">Cargando permisos...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {ACCIONES.map((accion) => {
              const seleccionado = accionesSeleccionadas.includes(accion.idAccion)
              return (
                <button
                  key={accion.idAccion}
                  type="button"
                  onClick={() => toggleAccion(accion.idAccion)}
                  className={`
                    flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-150
                    ${seleccionado
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {/* Checkbox visual */}
                  <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors
                    ${seleccionado ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}`}>
                    {seleccionado && (
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      {accion.icon}
                      <span className="text-sm font-medium text-gray-800">{accion.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{accion.descripcion}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Módulos */}
      <div className="col-span-2">
        <Label className="text-gray-700 mb-2 block">Módulos con Acceso</Label>
        {cargandoModulos ? (
          <p className="text-sm text-gray-400 italic">Cargando módulos...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {MODULOS.map((modulo) => {
              const seleccionado = modulosSeleccionados.includes(modulo.idModulo)
              return (
                <button
                  key={modulo.idModulo}
                  type="button"
                  onClick={() => toggleModulo(modulo.idModulo)}
                  className={`
                    flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-150
                    ${seleccionado
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {/* Checkbox visual */}
                  <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors
                    ${seleccionado ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}`}>
                    {seleccionado && (
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      {modulo.icon}
                      <span className="text-sm font-medium text-gray-800">{modulo.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{modulo.descripcion}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </ModalForm>
  )
}
