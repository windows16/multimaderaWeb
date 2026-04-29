

import { Button } from "@/components/ui/button"
import { useAuth } from "../hooks/useAuth"


export default function Session() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div>
      <div className="text-gray-700">
        <p>{user.email}</p>
      </div>
      <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={logout}>Cerrar Sesión</Button>
      </div>
    </div>
  )
}