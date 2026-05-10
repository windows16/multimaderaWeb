
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
import { deleteStockMaterial, getAllStockMateriales } from "@/services/materiales-service"
import type { StockMaterial } from "@/types/Materiales/StockMaterial"
import StockMaterialesForm from "./StockMaterialesForm"

export default function StockMaterialesMaestro() {

  const { items: itemStock, error, recargar: obtenerStockMateriales, handleError } = useFetch<StockMaterial>(getAllStockMateriales)
  const { busqueda, setBusqueda, itemsFiltrados: stockFiltrados } = useBusqueda(itemStock)

 // Modal crear / editar
  const [modalStockMaterialAbierto, setModalStockMaterialAbierto] = useState(false)
  const [StockMaterialSeleccionado, setStockMaterialSeleccionado] = useState<StockMaterial| null>(null)


  async function eliminarMaterial(stock: StockMaterial) {
    if (!stock.idMaterial) return
    if (!confirm(`¿Desea eliminar el stock de ${stock.material}?`)) return
    try {
      await deleteStockMaterial(stock.idMaterial)
      await obtenerStockMateriales()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <PageHeader
        title="StockMateriales"
        menuOptions={[
          {
            label: "Exportar a Excel",
            icon: <FaFileExcel className="mr-2 text-green-600" />,
            onClick: () => ExportToExcel({
              data: stockFiltrados,
              fileName: "StockMaterial.xlsx",
              sheetName: "StockMaterial"
            }),
          }
        ]}
      />

      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar por material"/>
      
      <RecordCount count={stockFiltrados.length} />

      <CardGrid
        items={stockFiltrados}
        getKey={(item) => item.idMaterial ?? 0}
        getTitulo={(item) => `${item.idMaterial} - ${item.material}`}
        cardOptions={[
          {
            label: "Editar",
            icon: <FaEdit className="w-3.5 h-3.5 mr-2" />,
            onClick: (item) => { 
              setStockMaterialSeleccionado(item)
              setModalStockMaterialAbierto(true) 
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
            <p>Stock: {item.stock}</p>
          </>
        )}
      />

      <FabButton
        onClick={() => {  
          setStockMaterialSeleccionado(null)
          setModalStockMaterialAbierto(true)
        }}
        icon={<FaPlus  size={20} />}
      />
      <ErrorAlert error={error} title="Error" />

      <StockMaterialesForm
        isOpen={modalStockMaterialAbierto}
        onClose={() => { setModalStockMaterialAbierto(false); setStockMaterialSeleccionado(null) }}
        onSuccess={obtenerStockMateriales}
        stockMaterialEditar={StockMaterialSeleccionado} />
    </div>
  )
}