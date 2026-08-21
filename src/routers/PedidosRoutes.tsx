import { Route } from "react-router-dom"

import PedidosMaestro from "@/features/pedidos/components/PedidosMaestro"
import DetallesPedidosMaestro from "@/features/pedidos/components/DetallesPedidosMaestro"

export const PedidosRoutes = (
    <>
        <Route path="/pedidos" element={<PedidosMaestro />} />
        <Route
      path="/pedidos/:idPedido"
      element={<DetallesPedidosMaestro />}
    />
    </>
)
