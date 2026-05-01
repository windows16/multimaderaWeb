import { Route } from "react-router-dom"

import ClientesMaestro from "@/features/clientes/ClientesMaestro"
import TiposClienteMaestro from "@/features/clientes/TiposClienteMaestro"

export const ClientesRoutes = (
    <>
        <Route path="/clientes" element={<ClientesMaestro />} />
        <Route path="/tipos-cliente" element={<TiposClienteMaestro />} />
    </>
)