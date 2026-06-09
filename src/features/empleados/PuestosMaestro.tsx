
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash } from "react-icons/fa"
import type { Puesto } from "@/types/Empleados/Puesto"
import { getAllPuestos, deletePuesto } from "../../services/empleados-service"
import { ExportToExcel } from "@/utils/ExportToExcel"
import PuestosForm from "./PuestosForm"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import CardGrid from "@/components/layout/CardGrid"
import MaestroLayout from "@/components/layout/MaestroLayout"

export default function PuestosMaestro() {

  const { items: itemPuesto, error, recargar: obtenerPuesto, handleError, loading } = useFetch<Puesto>(getAllPuestos)
  const { busqueda, setBusqueda, itemsFiltrados: puestosFiltrados } = useBusqueda(itemPuesto)

 // Modal crear / editar
  const [modalPuestoAbierto, setModalPuestoAbierto] = useState(false)
  const [PuestoSeleccionado, setPuestoSeleccionado] = useState<Puesto | null>(null)


  async function eliminarPuesto(puesto: Puesto) {
    if (!puesto.idPuesto) return
    if (!confirm(`¿Desea eliminar el puesto ${puesto.puesto}?`)) return
    try {
      await deletePuesto(puesto.idPuesto)
      await obtenerPuesto()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <MaestroLayout
      title="Puestos"
      menuOptions={[
        {
          label: "Exportar",
          icon: <FaFileExcel className="mr-2 text-green-600" />,
          onClick: () => ExportToExcel({
              data: puestosFiltrados,
              fileName: "Puesto.xlsx",
              sheetName: "Puesto"
            }),
        }
      ]}
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      searchPlaceholder="Buscar por puesto, descripcion..."
      recordCount={loading ? 0 : puestosFiltrados.length}
      error={error}
      loading={loading}
      onAgregar={() => {
        setPuestoSeleccionado(null)
        setModalPuestoAbierto(true)
      }}
    >
      <CardGrid
        items={puestosFiltrados}
        isLoading={loading}
        getKey={(item) => item.idPuesto ?? 0}
        getTitulo={(item) => `${item.idPuesto} - ${item.puesto}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { setPuestoSeleccionado(item); setModalPuestoAbierto(true) }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarPuesto(item)
          }
        ]}
        renderContent={(item) => (
          <p>Descripcion: {item.descripcion}</p>
        )}
      />

      <PuestosForm
        isOpen={modalPuestoAbierto}
        onClose={() => { setModalPuestoAbierto(false); setPuestoSeleccionado(null) }}
        onSuccess={obtenerPuesto}
        puestoEditar={PuestoSeleccionado} />
    </MaestroLayout>
  )
}