import { Link } from "react-router-dom"
import { FaBoxes, FaClipboardList, FaUsers, FaUserCog, FaArrowRight } from "react-icons/fa"
import { usePermisos } from "@/hooks/usePermisos"
import { Modulos } from "@/constants/modulos" 
import { Loading, LoadingError } from "@/components/common/LoadingState"
import { useAuthStore } from "@/store/authStore"


const accesosRapidos = [
  {
    title: "Materiales",
    description: "Consulta inventario y gestión de insumos.",
    to: "/materiales",
    icon: <FaBoxes className="text-2xl text-amber-600" />,
    moduloId: Modulos.materiales,
  },
  {
    title: "Pedidos",
    description: "Revisa el estado de pedidos y operaciones activas.",
    to: "/pedidos",
    icon: <FaClipboardList className="text-2xl text-blue-600" />,
    moduloId: Modulos.pedidos,
  },
  {
    title: "Usuarios",
    description: "Administra usuarios, roles y permisos del sistema.",
    to: "/usuarios/auth",
    icon: <FaUserCog className="text-2xl text-violet-600" />,
    moduloId: Modulos.usuarios,
  },
  {
    title: "Clientes",
    description: "Consulta clientes y tipos de cliente.",
    to: "/clientes",
    icon: <FaUsers className="text-2xl text-emerald-600" />,
    moduloId: Modulos.clientes,
  },
]

const resumen = [
  { label: "Accesos rápidos", value: accesosRapidos.length },
  { label: "Modulos", value: Object.keys(Modulos).length }
  
]

export default function Inicio() {

  const { user } = useAuthStore()

  const { permisos, loading, error } = usePermisos()

  if (loading) {
    return (
      <Loading />
    )
  }

  if (error){
    return (
      <LoadingError error={error} onRetry={() => window.location.reload()} />
    )
  }
  
  const accesosVisibles = accesosRapidos.filter((item) =>
    permisos?.modulos.includes(item.moduloId)
  )

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Inicio</p>
            <h1 className="text-3xl font-bold text-slate-800">
              Hola, {user?.email?.split("@")[0].split(/[._-]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")}
            </h1>
          </div>
          <p className="text-sm text-slate-500">Panel de acceso rápido</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {resumen.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Accesos rápidos</h2>
        {accesosVisibles.length === 0 ? (
          <p className="text-sm text-slate-500">No tenés accesos rápidos disponibles.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {accesosVisibles.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                  {item.icon}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                  <FaArrowRight className="text-slate-400 transition group-hover:text-amber-600" />
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}