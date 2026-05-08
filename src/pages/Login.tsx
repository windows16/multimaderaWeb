import { useState } from "react"
import { supabase } from "../supabase/supabase-config"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa"
import { useAuth } from "../hooks/useAuth"
import ErrorAlert from "../components/common/ErrorAlert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const from = location.state?.from?.pathname || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErrorMsg(error.message)
    else navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">

        <div className="mb-7 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-10"/>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
          </div>

          <ErrorAlert error={errorMsg} title="Error al iniciar sesión" />

          <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2">
            <FaSignInAlt size={15} />
            Ingresar
          </Button>

        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 MultiMadera · Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}