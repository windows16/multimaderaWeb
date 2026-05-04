
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash, FaPlus} from "react-icons/fa"

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
import RecordCount from "@/components/RecordCount"
import PageHeader from "@/components/PageHeader"
import FabButton from "@/components/FabButton"

export default function ClientesMaestro() {

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
      <PageHeader
        title="Clientes"
        menuOptions={[
          {
            label: "Exportar",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: clientesFiltrados,
              fileName: "Cliente.xlsx",
              sheetName: "Cliente"
            }),
          }
        ]}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, teléfono, tipo..."/>
      </div>
      
      <RecordCount count={clientesFiltrados.length} />

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
                <p>Tipo de cliente: {item.tipoCliente || "--"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <FabButton
        onClick={() => {  
          setClienteSeleccionado(null)
          setModalClienteAbierto(true)
        }}
        icon={<FaPlus  size={20} />}
      />
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