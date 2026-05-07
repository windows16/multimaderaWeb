
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash, FaPlus} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import SearchBar from "@/components/common/SearchBar"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import type { Herramienta } from "@/types/Materiales/Herramientas"
import { deleteHerramienta, getAllHerramientas } from "@/services/materiales-service"
import HerramientasForm from "./HerramientasForm"

export default function HerramientasMaestro() {

  const { items: itemHerramienta, error, recargar: obtenerHerramientas, handleError } = useFetch<Herramienta>(getAllHerramientas)
  const { busqueda, setBusqueda, itemsFiltrados: herramientasFiltrados } = useBusqueda(itemHerramienta)

 // Modal crear / editar
  const [modalHerramientaAbierto, setModalHerramientaAbierto] = useState(false)
  const [HerramientaSeleccionado, setHerramientaSeleccionado] = useState<Herramienta| null>(null)


  async function eliminarHerramienta(herramienta: Herramienta) {
    if (!herramienta.idHerramienta) return
    if (!confirm(`¿Desea eliminar el herramienta ${herramienta.descripcion}?`)) return
    try {
      await deleteHerramienta(herramienta.idHerramienta)
      await obtenerHerramientas()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <PageHeader
        title="Herramientas"
        menuOptions={[
          {
            label: "Exportar a Excel",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: herramientasFiltrados,
              fileName: "Herramienta.xlsx",
              sheetName: "Herramienta"
            }),
          }
        ]}
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por descripcion, precio..."/>
      
      <RecordCount count={herramientasFiltrados.length} />

      <CardGrid
        items={herramientasFiltrados}
        getKey={(item) => item.idHerramienta ?? 0}
        getTitulo={(item) => `${item.idHerramienta} - ${item.descripcion}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { 
              setHerramientaSeleccionado(item)
              setModalHerramientaAbierto(true) 
            }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarHerramienta(item)
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Precio de alquiler: Q{item.precioAlquiler}</p>
          </>
        )}
      />

      <FabButton
        onClick={() => {  
          setHerramientaSeleccionado(null)
          setModalHerramientaAbierto(true)
        }}
        icon={<FaPlus  size={20} />}
      />
      <ErrorAlert error={error} title="Error" />

      <HerramientasForm
        isOpen={modalHerramientaAbierto}
        onClose={() => { setModalHerramientaAbierto(false); setHerramientaSeleccionado(null) }}
        onSuccess={obtenerHerramientas}
        herramientaEditar={HerramientaSeleccionado} />
    </div>
  )
}