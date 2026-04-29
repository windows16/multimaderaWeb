import { useState } from "react"
import { supabase } from "../supabase/supabase-config"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../hooks/useAuth"
import ErrorAlert from "../components/ErrorAlert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user , loading } = useAuth()
  const from = location.state?.from?.pathname || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <span className="text-gray-400 text-sm">Cargando...</span>
          </div>
      )
  }
  
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
   <div className="max-w-md mx-auto mt-24 bg-white shadow-xl rounded-2xl p-8">

      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Iniciar sesión
      </h1>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Correo electrónico
          </label>

          <Input
            type="email"
            placeholder="ejemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-gray-600">
            Contraseña
          </label>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-700">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* ERROR */}
        <ErrorAlert error={errorMsg} title="error al iniciar sesion" />

        {/* BUTTON */}
        <Button className="w-full bg-blue-600">
          Ingresar
        </Button>

      </form>
    </div>
  )
}