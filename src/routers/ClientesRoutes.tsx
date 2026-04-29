import { Route } from "react-router-dom"

import MaestroClientes from "@/features/clientes/MaestroClientes"

export const ClientesRoutes = (
    <>
        <Route path="/clientes" element={<MaestroClientes />} />
    </>
)