
import { Routes } from "react-router-dom"
import { PublicRoutes } from "./PublicRoutes"
import { ProtectedRoutes } from "./ProtectedRoutes"

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes}
      {ProtectedRoutes}
    </Routes>
  )
}