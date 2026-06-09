import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import CardGrid from "@/components/layout/CardGrid"
import type { Material } from "@/types/Materiales/Material"
import { deleteMaterial, getAllMateriales } from "@/services/materiales-service"
import MaterialesForm from "./MaterialesForm"
import { usePaginacion } from "@/hooks/usePaginacion"
import { Paginacion } from "@/components/common/Paginacion"
import { useBusqueda } from "@/hooks/useBusqueda"
import MaestroLayout from "@/components/layout/MaestroLayout"

export default function MaterialesMaestro() {
  
  const { 
      items: itemMaterial, loading, page, setPage, meta, recargar: obtenerMateriales,
       error, handleError
    } = usePaginacion<Material>({ 
      fetchFn: getAllMateriales, 
      initialLimit: 10
    })
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
    <MaestroLayout
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
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      searchPlaceholder="Buscar por descripcion, precio..."
      recordCount={materialesFiltrados.length}
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
        setMaterialSeleccionado(null)
        setModalMaterialAbierto(true)
      }}
    >
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
          <p>Precio de alquiler: Q{item.precioAlquiler}</p>
        )}
      />

      <MaterialesForm
        isOpen={modalMaterialAbierto}
        onClose={() => { setModalMaterialAbierto(false); setMaterialSeleccionado(null) }}
        onSuccess={obtenerMateriales}
        materialEditar={MaterialSeleccionado}
      />
    </MaestroLayout>
  )
}