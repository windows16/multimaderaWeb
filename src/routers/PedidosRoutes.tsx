import { Route } from "react-router-dom"

import PedidosMaestro from "@/features/pedidos/PedidosMaestro"
import DetallesPedidosMaestro from "@/features/pedidos/DetallesPedidosMaestro"

export const PedidosRoutes = (
    <>
        <Route path="/pedidos" element={<PedidosMaestro />} />
        <Route
      path="/pedidos/:idPedido"
      element={<DetallesPedidosMaestro />}
    />
    </>
)
