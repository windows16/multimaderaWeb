
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash, FaPlus } from "react-icons/fa"
import type { Puesto } from "@/types/Empleados/Puesto"
import { getAllPuestos, deletePuesto } from "../../services/empleados-service"
import { ExportToExcel } from "@/utils/ExportToExcel"
import PuestosForm from "./PuestosForm"
import ErrorAlert from "@/components/common/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/common/SearchBar"
import FabButton from "@/components/common/FabButton"
import PageHeader from "@/components/layout/PageHeader"
import RecordCount from "@/components/common/RecordCount"
import CardGrid from "@/components/layout/CardGrid"

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
    <div>

      <PageHeader
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
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por puesto, descripcion..."/>

      <RecordCount count={loading ? 0 : puestosFiltrados.length} />

      <ErrorAlert error={error}/>
      
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

      <FabButton
        onClick={() => {  
          setPuestoSeleccionado(null)
          setModalPuestoAbierto(true) 
        }}
        icon={<FaPlus  size={20} />}
      />

      {/* MODALES */}
      <PuestosForm
        isOpen={modalPuestoAbierto}
        onClose={() => { setModalPuestoAbierto(false); setPuestoSeleccionado(null) }}
        onSuccess={obtenerPuesto}
        puestoEditar={PuestoSeleccionado} />
    </div>
  )
}