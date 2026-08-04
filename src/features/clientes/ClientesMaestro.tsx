
import { useState } from "react"
import { FaEdit, FaFileExcel, FaPhone, FaTrash, FaWhatsapp } from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import CardGrid from "@/components/layout/CardGrid"
import type { Cliente } from "@/types/Clientes/Cliente"
import { deleteCliente, getAllClientes } from "@/services/clientes-service"
import ClientesForm from "./ClientesForm"
import { usePaginacion } from "@/hooks/usePaginacion"
import { Paginacion } from "@/components/common/Paginacion"
import { useBusqueda } from "@/hooks/useBusqueda"
import MaestroLayout from "@/components/layout/MaestroLayout"
import { limpiarTelefono, telefonoParaWhatsapp } from "@/utils/telefono"

export default function ClientesMaestro() {

  const { 
    items: itemCliente, loading, page, setPage, meta, recargar: obtenerClientes,
    error, handleError
  } = usePaginacion<Cliente>({ 
    fetchFn: getAllClientes, 
    initialLimit: 10
  })

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
    <MaestroLayout
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
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      recordCount={meta.total}
      error={error}
      loading={loading}
      paginacion={
        <Paginacion
          page={page}
          totalPages={meta.totalPages > 0 ? meta.totalPages : Math.ceil((meta.total || 1) / 10)}
          onChange={setPage}
        />
      }
      onAgregar={() => {
        setClienteSeleccionado(null)
        setModalClienteAbierto(true)
      }}
    >
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
          },
          {
            label: "Llamar",
            icon: <FaPhone className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => {
              const numero = limpiarTelefono(item.telefono)
              if (!numero) return
              window.location.href = `tel:${numero}`
            }
          },
          {
            label: "WhatsApp",
            icon: <FaWhatsapp className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => {
              const numero = telefonoParaWhatsapp(item.telefono)
              if (!numero) return
              window.open(`https://wa.me/${numero}`, "_blank", "noopener,noreferrer")
            }
          },
        ]}
        renderContent={(item) => (
          <>
            <div className="flex items-center gap-1.5">
              <FaPhone className="text-blue-500" /> 
              <span>Tel: {item.telefono? item.telefono : "N/A"}</span>
            </div>
            <p>Tipo de cliente: {item.tipoCliente || "--"}</p>
          </>
        )}
      />

      <ClientesForm
        isOpen={modalClienteAbierto}
        onClose={() => { setModalClienteAbierto(false); setClienteSeleccionado(null) }}
        onSuccess={obtenerClientes}
        clienteEditar={ClienteSeleccionado} />
    </MaestroLayout>
  )
}