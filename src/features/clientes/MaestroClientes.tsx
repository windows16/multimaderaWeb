
import { useState } from "react"
import { FaEdit, FaUserPlus,FaFileExcel, FaTrash } from "react-icons/fa"

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
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/ErrorAlert"
import type { Cliente } from "@/types/Clientes/Cliente"
import { deleteCliente, getAllClientes } from "@/services/clientes-service"
import ClientesForm from "./ClientesForm"
import { useFetch } from "@/hooks/useFetch"
import { useFiltro } from "@/hooks/useFiltro"

export default function MaestroClientes() {

  const { items: itemCliente, error, recargar: obtenerClientes, handleError } = useFetch<Cliente>(getAllClientes)
    const {
      campoFiltro, setCampoFiltro,
      valorFiltro, setValorFiltro,
      valorCombobox, setValorCombobox,
      valoresFiltro,
      itemsFiltrados: clientesFiltrados,
      limpiarFiltro,
    } = useFiltro(itemCliente)

 // Modal crear / editar
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false)
  const [ClienteSeleccionado, setClienteSeleccionado] = useState<Omit<Cliente,"tipoCliente"> | null>(null)

  

  async function eliminarCliente(cliente: Cliente) {
    if (!cliente.numeroDeCliente) return
    if (!confirm(`¿Desea eliminar el cliente ${cliente.nombre}?`)) return
    try {
      await deleteCliente(cliente.numeroDeCliente)
      await obtenerClientes()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Clientes</h1>
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
            <SelectItem value="numeroDeCliente">numeroDeCliente</SelectItem>
            <SelectItem value="nombre">nombre</SelectItem>
            <SelectItem value="telefono">telefono</SelectItem>
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
          onClick={() => { limpiarFiltro() }}
          className="bg-blue-600">
          Limpiar Filtro
        </Button>
      </div>

      <div className="flex items-center  justify-end mb-6">
        <div className="flex gap-2">
          
          <Button onClick={() => {  
            setClienteSeleccionado(null)
            setModalClienteAbierto(true)
          }}
            className="bg-blue-600"><FaUserPlus />
            Nuevo
          </Button>

          <Button onClick={() => 
            ExportToExcel({
              data: clientesFiltrados,
              fileName: "Cliente.xlsx",
              sheetName: "Cliente"
            })
          } className="bg-green-600"><FaFileExcel/>
            Exportar
          </Button>
          
        </div>
      </div>

      {/* TARJETAS */}
      <div className="my-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clientesFiltrados.map((item) => (
          <Card
            key={item.numeroDeCliente}
            className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex items-start justify-between">
              <CardTitle className="text-lg flex-1 truncate pr-2">
                {item.numeroDeCliente} - {item.nombre}
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
                      setClienteSeleccionado(item)
                      setModalClienteAbierto(true)
                    }}
                  >
                    <FaEdit className="w-3.5 h-3.5 mr-2" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={() => {
                      eliminarCliente(item)
                    }}>
                    <FaTrash className="w-3.5 h-3.5 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-1 text-sm text-gray-500">
                <p>Teléfono: {item.telefono}</p>
                <p>Tipo de cliente: {item.tipoCliente}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ErrorAlert error={error} title="Error" />

      {/* MODALES */}
      <ClientesForm
        isOpen={modalClienteAbierto}
        onClose={() => { setModalClienteAbierto(false); setClienteSeleccionado(null) }}
        onSuccess={obtenerClientes}
        clienteEditar={ClienteSeleccionado} />
    </div>
  )
}