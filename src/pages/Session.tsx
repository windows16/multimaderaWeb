import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Mail, Shield, LogOut } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { FaUserShield } from "react-icons/fa"

export default function Session() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">

          <CardTitle>Mi Cuenta</CardTitle>
          <CardDescription>
            Información de la sesión actual
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Correo electrónico</p>
              <p className="font-medium break-all">{user.email}</p>

            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaUserShield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">subapase role</p>
              <p className="font-medium">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium text-green-600">Sesión activa</p>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}