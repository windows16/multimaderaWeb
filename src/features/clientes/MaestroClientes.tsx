
import { useState } from "react"
import { FaEdit, FaUserPlus,FaFileExcel, FaTrash} from "react-icons/fa"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/ErrorAlert"
import type { Cliente } from "@/types/Clientes/Cliente"
import { deleteCliente, getAllClientes } from "@/services/clientes-service"
import ClientesForm from "./ClientesForm"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/SearchBar"

export default function MaestroClientes() {

  const { items: itemCliente, error, recargar: obtenerClientes, handleError } = useFetch<Cliente>(getAllClientes)
  const { busqueda, setBusqueda, itemsFiltrados: clientesFiltrados } = useBusqueda(itemCliente)

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
        <div className="text-sm text-gray-600">
            {clientesFiltrados.length} {clientesFiltrados.length !== 1? "registros" : "registro"} 
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
      
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, teléfono, tipo..."/>
          
        <div className="flex gap-3">

          <Button onClick={() => {
            setClienteSeleccionado(null)
            setModalClienteAbierto(true)
          }} className="bg-blue-600">
            <FaUserPlus /> Nuevo Cliente
          </Button>

          <Button onClick={() =>
            ExportToExcel({
              data: clientesFiltrados,
              fileName: "Cliente.xlsx",
              sheetName: "Cliente"
            })
          } className="bg-green-600">
            <FaFileExcel /> Exportar
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
                {item.nombre}
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
                    }}>
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