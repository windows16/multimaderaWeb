
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash, FaPlus} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { Cliente } from "@/types/Clientes/Cliente"
import { deleteCliente, getAllClientes } from "@/services/clientes-service"
import ClientesForm from "./ClientesForm"
import SearchBar from "@/components/common/SearchBar"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import { usePaginacion } from "@/hooks/usePaginacion"
import { Paginacion } from "@/components/common/Paginacion"
import { useError } from "@/hooks/useError"
import { useBusqueda } from "@/hooks/useBusqueda"

export default function ClientesMaestro() {

  const { 
    items: itemCliente, loading, page, setPage, meta, recargar: obtenerClientes 
  } = usePaginacion<Cliente>({ 
    fetchFn: getAllClientes, 
    initialLimit: 10
  })
  const { error, handleError } = useError()

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
            label: "Exportar a Excel",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: clientesFiltrados,
              fileName: "Cliente.xlsx",
              sheetName: "Cliente"
            }),
          }
        ]}
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por nombre, teléfono, tipo..."/>
      
      <RecordCount count={loading ? 0 : meta.total} />

      <CardGrid
        items={clientesFiltrados}
        isLoading={loading}
        getKey={(item) => item.numeroDeCliente ?? 0}
        getTitulo={(item) => `${item.numeroDeCliente} - ${item.nombre}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setClienteSeleccionado(item); setModalClienteAbierto(true) }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarCliente(item)
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Teléfono: {item.telefono}</p>
            <p>Tipo de cliente: {item.tipoCliente || "--"}</p>
          </>
        )}
      />
    <Paginacion 
      page={page}
      totalPages={meta.totalPages > 0 ? meta.totalPages : Math.ceil((meta.total || 1) / 10)}
      onChange={setPage}
    />

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