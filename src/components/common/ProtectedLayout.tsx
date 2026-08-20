import { useAuthStore } from "@/store/authStore"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export function ProtectedLayout() {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return <div className="spinner" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}