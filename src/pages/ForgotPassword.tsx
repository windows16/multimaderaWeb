import { useState } from "react"
import { supabase } from "../supabase/supabase-config"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ErrorAlert from "../components/common/ErrorAlert"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [infoMsg, setInfoMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setInfoMsg("")
    setLoading(true)

    try {
      // Send recovery email that redirects to the app's new-password page
      const redirectTo = window.location.origin + "/recuperar/nueva"
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) setErrorMsg(error.message)
      else setInfoMsg(
        "Si existe una cuenta con ese email, se envió un correo con las instrucciones para restablecer la contraseña. Revisa tu bandeja de entrada."
      )
    } catch (err: any) {
      setErrorMsg(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">

        <div className="mb-7 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m-4 4 4 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Recuperar contraseña</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresa tu correo y te enviaremos un enlace para restablecer la contraseña.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Correo electrónico</label>
            <Input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <ErrorAlert error={errorMsg} title="Error al solicitar recuperación" />

          {infoMsg && (
            <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">{infoMsg}</div>
          )}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium" disabled={loading}>
              Enviar enlace
            </Button>
            <Button type="button" variant="secondary" className="h-11 rounded-xl" onClick={() => navigate('/login')}>
              Volver
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">© 2025 MultiMadera · Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
