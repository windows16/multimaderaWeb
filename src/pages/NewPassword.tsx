import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabase-config"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ErrorAlert from "../components/common/ErrorAlert"

export default function NewPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [infoMsg, setInfoMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  // Password strength validations
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
  }

  const isPasswordStrong = Object.values(validations).every(Boolean)
  const passwordsMatch = password !== "" && password === confirm

  useEffect(() => {
    const checkSession = async () => {
      // Try to obtain session from URL if Supabase SDK exposes getSessionFromUrl
      try {
        // @ts-ignore
        if (typeof supabase.auth.getSessionFromUrl === "function") {
          // attempt to parse URL and store session
          // @ts-ignore
          await supabase.auth.getSessionFromUrl({ storeSession: true })
        }
      } catch (err) {
        // ignore
      }

      const { data } = await supabase.auth.getSession()
      if (data.session) setReady(true)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setInfoMsg("")

    if (!isPasswordStrong) {
      setErrorMsg("La contraseña no cumple los requisitos de seguridad")
      return
    }

    if (!passwordsMatch) {
      setErrorMsg("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) setErrorMsg(error.message)
      else {
        setInfoMsg("Contraseña actualizada correctamente. Serás redirigido al inicio de sesión.")
        setTimeout(() => navigate('/login'), 2000)
      }
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.567-3-3.5-3S5 9.343 5 11v2h14v-2c0-1.657-1.567-3-3.5-3S12 9.343 12 11z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Establecer nueva contraseña</h1>
          <p className="text-sm text-gray-500 mt-1">Completa el formulario para actualizar tu contraseña.</p>
        </div>

        {!ready && (
          <div className="text-center text-sm text-gray-500 mb-4">
            Esperando la validación del enlace de recuperación... Si abriste este enlace desde el correo, espera unos segundos.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            {/* Password requirements */}
            <div className="mt-2 text-sm text-gray-500">
              <p className="font-medium text-gray-700 mb-1">La contraseña debe contener:</p>
              <ul className="ml-4 space-y-1">
                <li className={validations.length ? "text-green-600" : "text-gray-400"}>
                  {validations.length ? "✔" : "•"} Mínimo 8 caracteres
                </li>
                <li className={validations.upper ? "text-green-600" : "text-gray-400"}>
                  {validations.upper ? "✔" : "•"} Al menos una letra mayúscula
                </li>
                <li className={validations.lower ? "text-green-600" : "text-gray-400"}>
                  {validations.lower ? "✔" : "•"} Al menos una letra minúscula
                </li>
                <li className={validations.number ? "text-green-600" : "text-gray-400"}>
                  {validations.number ? "✔" : "•"} Al menos un número
                </li>
                <li className={validations.special ? "text-green-600" : "text-gray-400"}>
                  {validations.special ? "✔" : "•"} Al menos un carácter especial (ej. !@#$%)
                </li>
              </ul>
            </div>
            <label className="text-sm font-medium text-gray-600">Nueva contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              disabled={!ready}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Confirmar contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              disabled={!ready}
            />

            {!passwordsMatch && confirm.length > 0 && (
              <div className="text-sm text-red-500 mt-1">Las contraseñas no coinciden</div>
            )}

          </div>

          <ErrorAlert error={errorMsg} title="Error" />

          {infoMsg && (
            <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">{infoMsg}</div>
          )}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium" disabled={!ready || loading || !isPasswordStrong || !passwordsMatch}>
              Actualizar contraseña
            </Button>
            <Button type="button" variant="secondary" className="h-11 rounded-xl" onClick={() => navigate('/login')}>
              Cancelar
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">© 2025 MultiMadera · Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
