import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, background: '#333', color: '#fff', padding: 16, borderRadius: 8 }}>
      <p>Nueva versión disponible</p>
      <button onClick={() => updateServiceWorker(true)}>Actualizar</button>
      <button onClick={() => setNeedRefresh(false)}>Cerrar</button>
    </div>
  )
}