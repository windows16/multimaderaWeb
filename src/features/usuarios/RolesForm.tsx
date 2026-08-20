import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@/hooks/useForm"
import ModalForm from "@/components/layout/ModalForm"
import type { AccionRol, Rol } from "@/types/Usuarios/RoleConAccion"
import {
  insertRol,
  updateRol,
  getAccionesByRol,
  createAccionRol,
  deleteAccionRol,
} from "@/services/usuarios-service"
import { FaEye, FaPlus, FaEdit, FaTrash, FaUsers, FaBox, FaAddressBook, FaShoppingCart, FaUserShield } from "react-icons/fa"
import { Modulos } from "@/constants/modulos"
import { Acciones } from "@/constants/acciones"

interface RolesFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  rolEditar: Rol | null
}

const ACCIONES = [
  { idAccion: Acciones.ver, label: "Ver",       descripcion: "Permite visualizar registros",    icon: <FaEye className="text-blue-500" /> },
  { idAccion: Acciones.crear, label: "Crear",     descripcion: "Permite crear nuevos registros",    icon: <FaPlus className="text-green-500" /> },
  { idAccion: Acciones.actualizar, label: "Actualizar",descripcion: "Permite modificar registros",       icon: <FaEdit className="text-amber-500" /> },
  { idAccion: Acciones.eliminar, label: "Eliminar",  descripcion: "Permite eliminar registros",        icon: <FaTrash className="text-red-500" /> },
]

const MODULOS = [
  { idModulo: Modulos.empleados, label: "Empleados", descripcion: "Gestión de personal", icon: <FaUsers className="text-indigo-500" /> },
  { idModulo: Modulos.materiales, label: "Materiales", descripcion: "Catálogo de materiales", icon: <FaBox className="text-orange-500" /> },
  { idModulo: Modulos.clientes, label: "Clientes", descripcion: "Directorio de clientes", icon: <FaAddressBook className="text-emerald-500" /> },
  { idModulo: Modulos.pedidos, label: "Pedidos", descripcion: "Órdenes y pedidos", icon: <FaShoppingCart className="text-purple-500" /> },
  { idModulo: Modulos.usuarios, label: "Usuarios", descripcion: "Control de accesos y seguridad", icon: <FaUserShield className="text-cyan-500" /> },
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

  // Acciones (estado actual y original)
  const [AccionesRol, setAccionesRol] = useState<AccionRol[]>([])
const [cargandoAcciones, setCargandoAcciones] = useState(false)

// Acciones seleccionadas por módulo
const [accionesSeleccionadas, setAccionesSeleccionadas] = useState<Record<number, number[]>>({})

useEffect(() => {
  if (isOpen && esEdicion && rolEditar?.idRol) {
    setCargandoAcciones(true)
    getAccionesByRol(rolEditar.idRol)
      .then((acc: AccionRol[]) => {
        setAccionesRol(acc)
        const porModulo = acc.reduce((result, accion) => {
          const moduloId = accion.idModulo
          const actuales = result[moduloId] ?? []
          result[moduloId] = [...new Set([...actuales, accion.idAccion])]
          return result
        }, {} as Record<number, number[]>)
        setAccionesSeleccionadas(porModulo)
      })
      .catch(() => {
        setAccionesRol([])
        setAccionesSeleccionadas({})
      })
      .finally(() => setCargandoAcciones(false))
  } else if (isOpen) {
    setAccionesRol([])
    setAccionesSeleccionadas({})
  }
}, [isOpen, rolEditar, esEdicion])

function toggleAccion(idModulo: number, idAccion: number) {
  setAccionesSeleccionadas((prev) => {
    const actuales = prev[idModulo] ?? []
    const nuevaLista = actuales.includes(idAccion)
      ? actuales.filter((a) => a !== idAccion)
      : [...actuales, idAccion]

    return {
      ...prev,
      [idModulo]: nuevaLista,
    }
  })
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
    } else {
      await insertRol({ descripcion: form.descripcion })
      onSuccess()
      onClose()
      return
    }

    const idsAccionesRol = new Set(AccionesRol.map((a) => `${a.idModulo}:${a.idAccion}`))

    for (const modulo of MODULOS) {
      const accionesModulo = accionesSeleccionadas[modulo.idModulo] ?? []
      for (const idAccion of accionesModulo) {
        const clave = `${modulo.idModulo}:${idAccion}`
          if (!idsAccionesRol.has(clave)) {
          await createAccionRol({ idAccion, idModulo: modulo.idModulo, idRol })
          }
        }
      }

    const accionesAEliminar = AccionesRol.filter((accion) => {
      const accionesActuales = accionesSeleccionadas[accion.idModulo] ?? []
      return !accionesActuales.includes(accion.idAccion)
    })

    for (const accion of accionesAEliminar) {
      if (accion.idAccionRol) {
        await deleteAccionRol(accion.idAccionRol)
      }
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

      {/* Acciones por módulo */}
      {esEdicion ? (
        <div className="col-span-2 space-y-4">
          <Label className="text-gray-700 mb-2 block">Permisos por Módulo</Label>
          {cargandoAcciones ? (
            <p className="text-sm text-gray-400 italic">Cargando permisos...</p>
          ) : (
            <div className="space-y-4">
              {MODULOS.map((modulo) => {
                const seleccionadas = accionesSeleccionadas[modulo.idModulo] ?? []

                return (
                  <div key={modulo.idModulo} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-3 flex items-center gap-2">
                      {modulo.icon}
                      <span className="text-sm font-semibold text-gray-800">{modulo.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {ACCIONES.map((accion) => {
                        const seleccionado = seleccionadas.includes(accion.idAccion)
                        return (
                          <button
                            key={`${modulo.idModulo}-${accion.idAccion}`}
                            type="button"
                            onClick={() => toggleAccion(modulo.idModulo, accion.idAccion)}
                            className={`
                              flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-150
                              ${seleccionado
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                              }
                            `}
                          >
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
                              <p className="mt-0.5 text-xs text-gray-500">{accion.descripcion}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="col-span-2">
          <p className="text-sm text-gray-400 italic">Solo es posible asignar permisos en modo edición.</p>
        </div>
      )}
    </ModalForm>
  )
}