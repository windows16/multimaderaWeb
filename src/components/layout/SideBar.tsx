import { useState } from "react"
import { NavLink } from "react-router-dom"
import AppRoutes from "../../routers/AppRoutes"
import { FaChevronDown } from "react-icons/fa"

const links = [
  { name: "Inicio", path: "/" },
  { name: "Materiales", children: [{ name: "Materiales", path: "/materiales" }, { name: "Inventario", path: "/inventario" }] },
  { name: "Pedidos", path: "/pedidos" },
  { name: "Clientes", children: [{ name: "Clientes", path: "/clientes" }, { name: "Tipos de Cliente", path: "/tipos-cliente" }] },
  { name: "Empleados", children: [{ name: "Empleados", path: "/empleados" }, { name: "Puestos", path: "/empleados/puestos" }] },
  { name: "Usuarios", children: [{ name: "Roles", path: "/usuarios/roles" }] },
  { name: "Reportes", 
    children: [
      { name: "Pedidos Activos", path: "/reportes/pedidos-activos" },
      { name: "Historial de Pedidos", path: "/reportes/historial-pedidos" },
      { name: "Clientes Activos", path: "/reportes/clientes-activos" },
    ]
    
  },
  { name: "Inicio de Sesión", path: "/sesion" },
]

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false)   // solo desktop
  const [mobileOpen, setMobileOpen] = useState(false) // solo móvil
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const closeAll = () => { setMobileOpen(false); setOpenSubMenu(null) }

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
      {links.map(link =>
        link.children ? (
          <div key={link.name}>
            <button
              onClick={() => setOpenSubMenu(prev => prev === link.name ? null : link.name)}
              title={!mobile && collapsed ? link.name : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 hover:bg-gray-100 ${!mobile && collapsed ? "justify-center" : "justify-between"}`}>
              <span className="flex items-center gap-2.5">
                <MenuIcon name={link.name} />
                {(mobile || !collapsed) && link.name}
              </span>
              {(mobile || !collapsed) && (
                <span className={`text-[10px] text-slate-400 transition-transform ${openSubMenu === link.name ? "rotate-180" : ""}`}><FaChevronDown /></span>
              )}
            </button>
            {(mobile || !collapsed) && openSubMenu === link.name && (
              <div className="ml-8 space-y-0.5 mt-0.5">
                {link.children.map(child => (
                  <NavLink key={child.path} to={child.path} onClick={closeAll}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 rounded-md text-sm ${isActive ? "text-amber-700 font-medium bg-amber-50" : "text-slate-500 hover:bg-gray-100"}`
                    }
                  >{child.name}</NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink key={link.path} to={link.path} onClick={closeAll}
            title={!mobile && collapsed ? link.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg
              ${!mobile && collapsed ? "justify-center" : ""}
              ${isActive ? "text-amber-700 bg-amber-50" : "text-slate-600 hover:bg-gray-100"}`
            }>
            <MenuIcon name={link.name} />
            {(mobile || !collapsed) && link.name}
          </NavLink>
        )
      )}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR DESKTOP (md+) ── */}
      <aside className={`
        hidden md:flex flex-col fixed top-0 left-0 h-screen z-40
        bg-white border-r border-gray-100
        transition-all duration-200
        ${collapsed ? "w-[52px]" : "w-56"}`}>
        <div className="h-13 flex items-center gap-2 px-3 border-b border-gray-100 flex-shrink-0 h-[52px]">
          <button
            onClick={() => { setCollapsed(p => !p); setOpenSubMenu(null) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-gray-100 flex-shrink-0">
            <HamburgerIcon />
          </button>
          {!collapsed && (
            <span className="font-semibold text-lg text-blue-600 whitespace-nowrap overflow-hidden">
              Multi<span className="text-slate-800">Madera</span>
            </span>
          )}
        </div>
        <NavContent />
      </aside>

      {/* ── OVERLAY EN MOVIL ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={closeAll} />
      )}

      {/* ── SIDEBAR Movil (drawer) ── */}
      <aside className={`
        md:hidden fixed top-0 left-0 h-screen w-56 z-40
        flex flex-col bg-white border-r border-gray-100
        transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-[52px] flex items-center gap-2 px-3 border-b border-gray-100 flex-shrink-0">
          <button onClick={closeAll} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-gray-100">
            <CloseIcon />
          </button>
          <span className="font-semibold text-lg text-blue-600">
            Multi<span className="text-slate-800">Madera</span>
          </span>
        </div>
        <NavContent mobile />
      </aside>

      {/* ── TOPBAR MOVILA ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-[52px] z-20 bg-white border-b border-gray-100 flex items-center px-3 gap-2">
        <button onClick={() => setMobileOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-gray-100">
          <HamburgerIcon />
        </button>
        <span className="font-semibold text-lg text-blue-600">
          Multi<span className="text-slate-800">Madera</span>
        </span>
      </header>

      {/* ── CONTENIDO ── */}
      <main className={`
        flex-1 min-h-screen py-10 px-6
        pt-[calc(52px+2.5rem)] md:pt-10
        transition-all duration-200
        ${collapsed ? "md:ml-[52px]" : "md:ml-56"}
      `}>
        <AppRoutes />
      </main>
    </div>
  )
}

function MenuIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    "Inicio": "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
    "Materiales": "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    "Pedidos": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    "Clientes": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
    "Empleados": "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    "Usuarios": "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    "Reportes": "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    "Inicio de Sesión": "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
  }
  const d = icons[name] ?? "M4 6h16M4 12h16M4 18h16"
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

const HamburgerIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)