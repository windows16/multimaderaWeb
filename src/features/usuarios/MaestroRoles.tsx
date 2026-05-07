
import { useEffect, useState } from "react"
import { getAllRolesWithAcciones} from "../../services/usuarios-service"

import { getErrorMessage } from "../../utils/Functions"
import { FaEdit, FaUserMinus, FaUserPlus,FaFileExcel } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import { ExportToExcel } from "../../utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { RolConAccion } from "@/types/Usuarios/RoleConAccion"

export default function MaestroRoles() {

  const [itemRolConAcciones, setRolConAcciones] = useState<RolConAccion[]>([])
  const [campoFiltro, setCampoFiltro] = useState("")
  const [valorFiltro, setValorFiltro] = useState("")
  const [valorCombobox, setValorCombobox] = useState("") 
  const [error, setError] = useState<string | null>(null)

//   // Modal crear / editar
//   const [modalRolConAccionesAbierto, setModalRolConAccionesAbierto] = useState(false)
//   const [rolConAccionSeleccionado, setRolConAccionSeleccionado] = useState<RolConAccion | null>(null)

//   // Modal baja
//   const [bajaModalAbierto, setBajaModalAbierto] = useState(false)
//   const [empleadoParaBaja, setEmpleadoParaBaja] = useState<RolConAccion | null>(null)

  const valoresFiltro = campoFiltro
    ? [...new Set(itemRolConAcciones.map((emp) => emp[campoFiltro as keyof RolConAccion]?.toString()))]
    : []

  const rolesFiltrados = itemRolConAcciones.filter((emp) => {
    if (!campoFiltro || !valorFiltro) return true
    const valor = emp[campoFiltro as keyof RolConAccion]?.toString().toLowerCase()
    return valor?.includes(valorFiltro.toLowerCase())
  })

  useEffect(() => {
      obtenerRolesConAcciones()
  }, [])

  async function obtenerRolesConAcciones() {
    try {
    const data = await getAllRolesWithAcciones()
    setRolConAcciones(data)
    } catch (error) {
      setError(getErrorMessage(error))
    }
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">RolConAcciones</h1>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mb-6">
        <Select
          value={campoFiltro}
          onValueChange={(value) => {
            setCampoFiltro(value)
            setValorFiltro("")
          }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="rol">Rol</SelectItem>
            <SelectItem value="accion">Acción</SelectItem>
          </SelectContent>
        </Select>

        <Combobox items={valoresFiltro}>
          <ComboboxInput
            placeholder="Escribe para filtrar..."
            value={valorCombobox}
            onChange={(e) => setValorCombobox(e.target.value)}/>

          <ComboboxContent>
            <ComboboxEmpty>No encontrado</ComboboxEmpty>

            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  key={item}
                  value={item}
                  onClick={() => {setValorCombobox(item); setValorFiltro(item)}}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Button
          onClick={() => { setCampoFiltro(""); setValorFiltro(""); setValorCombobox("") }}
          className="bg-blue-600">
          Limpiar Filtro
        </Button>
      </div>
      <div className="flex items-center  justify-end mb-6">
        <div className="flex gap-2">
          <Button onClick={() => {  }}
            className="bg-blue-600"><FaUserPlus />
            Nuevo
          </Button>

          <Button onClick={() => 
            ExportToExcel({
              data: rolesFiltrados,
              fileName: "Roles.xlsx",
              sheetName: "RolConAcciones",
              mapFn: (r) => ({
                rol: r.idRol + " - " + r.rol,
                accion: r.idAccion + " -" + r.accion
              }),
            })
          } className="bg-green-600"><FaFileExcel/>
            Exportar
          </Button>
          
        </div>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {rolesFiltrados.length} {rolesFiltrados.length !== 1? "registros" : "registro"} 
      </div>
      
      {/* TARJETAS */}
      <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rolesFiltrados.map((item) => (
          <Card
            
            className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex items-start justify-between">
              <CardTitle className="text-lg flex-1 truncate pr-2">
                {item.idRol} - {item.rol}
              </CardTitle>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition text-xl leading-none tracking-widest">
                    ⋮
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      
                    }}
                  >
                    <FaEdit className="w-3.5 h-3.5 mr-2" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={() => {

                    }}>
                      
                    <FaUserMinus className="w-3.5 h-3.5 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-1 text-sm text-gray-500">
              <p>Acción: {item.idAccion} - {item.accion}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <ErrorAlert error={error} title="Error" />
      
      {/* MODALES */}
      {/* <EmpleadosForm
        isOpen={modalEmpleadosAbierto}
        onClose={() => { setModalEmpleadosAbierto(false); setEmpleadoSeleccionado(null) }}
        onSuccess={obtenerRolesConAcciones}
        empleadoEditar={empleadoSeleccionado} />

      <BajaEmpleadosForm
        isOpen={bajaModalAbierto}
        onClose={() => { setBajaModalAbierto(false); setEmpleadoParaBaja(null) }}
        onSuccess={obtenerRolesConAcciones}
        empleado={empleadoParaBaja} /> */}

    </div>
  )
}