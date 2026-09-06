import { useState } from "react"
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from "react-icons/fa"
import ErrorAlert from "@/components/common/ErrorAlert"
import type { DetallePedido, Pedido } from "@/features/pedidos/models/Pedido"
import { deleteDetallePedido, getDetallesPedido } from "@/features/pedidos/services/pedidos-service"
import DetallesPedidosForm from "./DetallesPedidosForm"
import { useFetch } from "@/hooks/useFetch"
import RecordCount from "@/components/common/RecordCount"
import PageHeader from "@/components/layout/PageHeader"
import FabButton from "@/components/common/FabButton"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function DetallesPedidosMaestro() {
  const { idPedido } = useParams()
  const pedidoId = Number(idPedido)
  const navigate = useNavigate()
  const { items: itemDetalles, error, recargar: obtenerDetalles, handleError, loading } = useFetch(
    () => getDetallesPedido(pedidoId)
  )

  const location = useLocation()
  const pedidoCompleto = location.state?.pedido as Pedido | undefined

  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)

  const hayDetalles = !loading && itemDetalles.length > 0

  function abrirCrear() {
    setModoEdicion(false)
    setModalAbierto(true)
  }

  function abrirEditar() {
    setModoEdicion(true)
    setModalAbierto(true)
  }

  async function cerrarModal() {
    setModalAbierto(false)
    setModoEdicion(false)
    await obtenerDetalles()
  }

  async function eliminarDetalle(detalle: DetallePedido) {
    if (!detalle.idDetallePedido) return
    if (!confirm("¿Desea eliminar este detalle?")) return
    try {
      await deleteDetallePedido(detalle.idDetallePedido)
      await obtenerDetalles()
    } catch (error) {
      handleError(error)
    }
  }

  const subTotal = itemDetalles
    .reduce((acc, item) => acc + (Number(item.total) || 0), 0)

  const exportarPDF = () => {
    if (!hayDetalles) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Albañil: ${pedidoCompleto?.nombreAlbanil ?? "N/A"}`, 14, 22);
    doc.text(`Fecha: ${pedidoCompleto?.fechaInicio ?? "N/A"} al ${pedidoCompleto?.fechaFin}`, 14, 28);
    doc.text(`Dirección: ${pedidoCompleto?.direccion ?? "N/A"}`, 14, 34);

    // Autogenerar leyendo el HTML directamente
    autoTable(doc, {
      html: '#tabla-exportar', // tabla de React
      startY: 45,
      theme: 'striped',
      // Este hook borra la columna de acciones (la número 3, empezando desde 0) en el PDF
      didParseCell: function (data) {
        if (data.column.index === 3) {
          data.cell.styles.halign = 'center'; // Opcional
          data.cell.text = []; // Vaciamos el texto del botón
        }
      }
    });

    doc.save(`Pedido_${pedidoId}.pdf`);
  }

  return (
    <div>
      <Button variant="outline" onClick={() => navigate("/pedidos")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
      </Button>

      <PageHeader 
      title={pedidoCompleto?.direccion ?? "--"} 
      menuOptions={[{
        label: "Exportar a PDF",
        icon: <FaFilePdf className="w-4 h-4 mr-2" />,
        onClick: exportarPDF
      }]} 
      />

      <RecordCount count={loading ? 0 : itemDetalles.length} />
      <ErrorAlert error={error} />

      {/* Contenedor estricto para evitar que rompa el layout de la página */}
      <div className="w-full max-w-[100vw] overflow-hidden rounded-md border bg-white mb-6">
        {/* Envoltura con scroll horizontal solo si es absolutamente necesario */}
        <div className="w-full overflow-x-auto">
          <Table id="tabla-exportar" className="w-full text-xs md:text-sm">
            <TableHeader className="bg-muted/50">
              <TableRow>
                {/* Damos la mayor parte del espacio al material */}
                <TableHead className="font-medium text-left min-w-[120px] md:min-w-[200px]">
                  Material
                </TableHead>
                {/* Reducimos el padding en móviles (px-2) y acortamos el título */}
                <TableHead className="font-medium text-center px-2 w-[60px]">
                  Cant.
                </TableHead>
                <TableHead className="font-medium text-right px-2 min-w-[70px]">
                  Total 
                </TableHead>
                {/* Columna de acción compacta */}
                <TableHead className="font-medium text-center px-2 w-[50px]">
                  <span className="sr-only"></span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Cargando detalles...
                  </TableCell>
                </TableRow>
              ) : itemDetalles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No hay detalles registrados.
                  </TableCell>
                </TableRow>
              ) : (
                itemDetalles.map((item) => (
                  <TableRow key={item.idDetallePedido ?? Math.random()}>
                    {/* Quitamos el whitespace-nowrap para que nombres largos puedan bajar de línea si hace falta */}
                    <TableCell className="font-medium py-3">
                      <span className="line-clamp-2 md:line-clamp-none">
                        {item.material}
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-2 py-3">
                      {item.cantidad}
                    </TableCell>
                    <TableCell className="text-right px-2 py-3 whitespace-nowrap">
                      Q{item.total}
                    </TableCell>
                    <TableCell className="text-center px-2 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 md:h-8 md:w-8"
                        onClick={() => eliminarDetalle(item)}
                        title="Eliminar detalle"
                      >
                        <FaTrash className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="bg-muted/50 font-semibold">
            <TableRow>
              {/* Ocupamos 2 columnas (Material y Cantidad) para empujar el texto a la derecha */}
              <TableCell colSpan={2} className="text-left py-3">
                SubTotal:
              </TableCell>
              {/* Alineado perfectamente con la columna de totales */}
              <TableCell className="text-right px-2 py-3 whitespace-nowrap">
                Q{subTotal}
              </TableCell>
              {/* Celda vacía debajo de la columna de acciones */}
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
          </Table>
        </div>
      </div>

      {/* FAB: editar si hay detalles, crear si no hay */}
      { loading? (<div></div>) : (<FabButton
        onClick={hayDetalles ? abrirEditar : abrirCrear}
        icon={hayDetalles ? <FaEdit size={20} /> : <FaPlus size={20} />}
      />)
      }

      <DetallesPedidosForm
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSuccess={obtenerDetalles}
        detallesEditar={modoEdicion ? itemDetalles : null}
        idPedidoActual={pedidoId}
      />
    </div>
  )
}