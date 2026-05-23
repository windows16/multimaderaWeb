import { Route } from "react-router-dom"

import ReporteMaestro from "@/features/reporteria/ReporteMaestro"

export const ReporteriaRoutes = (
    <>
        <Route path="/reporteria" element={<ReporteMaestro />} />
    </>
)
