
import { useState } from "react"
import { FaEdit,FaFileExcel, FaTrash} from "react-icons/fa"
import { ExportToExcel } from "@/utils/ExportToExcel"
import { useFetch } from "@/hooks/useFetch"
import { useBusqueda } from "@/hooks/useBusqueda"
import CardGrid from "@/components/layout/CardGrid"
import { deleteStockMaterial, getAllStockMateriales } from "../services/materiales-service"
import type { StockMaterial } from "@/features/materiales/models/StockMaterial"
import StockMaterialesForm from "./StockMaterialesForm"
import MaestroLayout from "@/components/layout/MaestroLayout"

export default function StockMaterialesMaestro() {

  const { items: itemStock, error, recargar: obtenerStockMateriales, handleError, loading } = useFetch<StockMaterial>(getAllStockMateriales)
  const { busqueda, setBusqueda, itemsFiltrados: stockFiltrados } = useBusqueda(itemStock)

 // Modal crear / editar
  const [modalStockMaterialAbierto, setModalStockMaterialAbierto] = useState(false)
  const [StockMaterialSeleccionado, setStockMaterialSeleccionado] = useState<StockMaterial| null>(null)


  async function eliminarMaterial(stock: StockMaterial) {
    if (!stock.idStock) return
    if (!confirm(`¿Desea eliminar el stock de ${stock.material}?`)) return
    try {
      await deleteStockMaterial(stock.idStock)
      await obtenerStockMateriales()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <MaestroLayout
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
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      recordCount={stockFiltrados.length}
      error={error}
      loading={loading}
      onAgregar={() => {
        setStockMaterialSeleccionado(null)
        setModalStockMaterialAbierto(true)
      }}
    >
      <CardGrid
        items={stockFiltrados}
        isLoading={loading}
        getKey={(item) => item.idMaterial ?? 0}
        getTitulo={(item) => `${item.material}`}
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
            <p>en stock: {item.stock}</p>
          </>
        )}
      />

      <StockMaterialesForm
        isOpen={modalStockMaterialAbierto}
        onClose={() => { setModalStockMaterialAbierto(false); setStockMaterialSeleccionado(null) }}
        onSuccess={obtenerStockMateriales}
        stockMaterialEditar={StockMaterialSeleccionado} />
    </MaestroLayout>
  )
}