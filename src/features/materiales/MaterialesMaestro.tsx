
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash, FaPlus} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import ErrorAlert from "@/components/common/ErrorAlert"
import SearchBar from "@/components/common/SearchBar"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import CardGrid from "@/components/layout/CardGrid"
import type { Material } from "@/types/Materiales/Material"
import { deleteMaterial, getAllMateriales } from "@/services/materiales-service"
import MaterialesForm from "./MaterialesForm"
import { useError } from "@/hooks/useError"
import { usePaginacion } from "@/hooks/usePaginacion"
import { Paginacion } from "@/components/common/Paginacion"
import { useBusqueda } from "@/hooks/useBusqueda"

export default function MaterialesMaestro() {
  
  const { 
      items: itemMaterial, loading, page, setPage, meta, recargar: obtenerMateriales 
    } = usePaginacion<Material>({ 
      fetchFn: getAllMateriales, 
      initialLimit: 10
    })
  const { error, handleError } = useError()
  const { busqueda, setBusqueda, itemsFiltrados: materialesFiltrados } = useBusqueda(itemMaterial)
    
    
 // Modal crear / editar
  const [modalMaterialAbierto, setModalMaterialAbierto] = useState(false)
  const [MaterialSeleccionado, setMaterialSeleccionado] = useState<Material| null>(null)


  async function eliminarMaterial(material: Material) {
    if (!material.idMaterial) return
    if (!confirm(`¿Desea eliminar el material ${material.descripcion}?`)) return
    try {
      await deleteMaterial(material.idMaterial)
      await obtenerMateriales()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <PageHeader
        title="Materiales"
        menuOptions={[
          {
            label: "Exportar a Excel",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: materialesFiltrados,
              fileName: "Material.xlsx",
              sheetName: "Material"
            }),
          }
        ]}
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por descripcion, precio..."/>
      
      <RecordCount count={loading ? 0 : materialesFiltrados.length} />

      <CardGrid
        items={materialesFiltrados}
        isLoading={loading}
        getKey={(item) => item.idMaterial ?? 0}
        getTitulo={(item) => `${item.idMaterial} - ${item.descripcion}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { 
              setMaterialSeleccionado(item)
              setModalMaterialAbierto(true) 
            }
          },
          {
            label: "Eliminar",
            icon: <FaTrash className="w-3.5 h-3.5 mr-2" />,
            className: "text-red-500 focus:text-red-500 focus:bg-red-50",
            separator: true,
            onClick: (item) => eliminarMaterial(item)
          }
        ]}
        renderContent={(item) => (
          <>
            <p>Precio de alquiler: Q{item.precioAlquiler}</p>
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
          setMaterialSeleccionado(null)
          setModalMaterialAbierto(true)
        }}
        icon={<FaPlus  size={20} />}
      />
      <ErrorAlert error={error} title="Error" />

      <MaterialesForm
        isOpen={modalMaterialAbierto}
        onClose={() => { setModalMaterialAbierto(false); setMaterialSeleccionado(null) }}
        onSuccess={obtenerMateriales}
        materialEditar={MaterialSeleccionado} />
    </div>
  )
}