
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import AppRoutes from "../routers/AppRoutes"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"



export default function MainLayout() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

    const toggleSubMenu = (name: string) => {
    setOpenSubMenu(prev => (prev === name ? null : name))
    }

    const links = [
        { name: "Inicio", path: "/" },

        { name: "Herramientas", path: "/herramientas" },

        {name: "Pedidos", path: "/pedidos" },

        { name: "Clientes", 
            children: [
                { name: "Clientes", path: "/clientes" },
                { name: "Tipos de Cliente", path: "/tipos-cliente"}
            ],
        },
        { name: "Personal", 
            children: [
                { name: "Empleados", path: "/empleados" },
                { name: "Puestos", path: "/empleados/puestos" },
            ],
        },
        { name: "Usuarios", 
            children: [
            { name: "Roles", path: "/usuarios/roles" }
            ],
        },
        {name: "Inicio de Sesión", path: "/sesion" }

    ]

    return (
        <div className="min-h-screen bg-gray-50">
    
            {/* --- NAVBAR --- */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold text-blue-500 tracking-tight">
                        Multi<span className="text-slate-800">Madera</span>
                        </span>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                    {links.map((link) =>
                        link.children ? (
                        <DropdownMenu key={link.name}>
                            <DropdownMenuTrigger className="font-medium text-slate-600 hover:text-amber-700">
                            {link.name}
                            </DropdownMenuTrigger>
        
                            <DropdownMenuContent>
                            {link.children.map((child) => (
                                <DropdownMenuItem
                                key={child.path}
                                onClick={() => navigate(child.path)}
                                className="cursor-pointer"
                                >
                                {child.name}
                                </DropdownMenuItem>
                            ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        ) : (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                            `font-medium ${
                                isActive
                                ? "text-amber-700 font-semibold"
                                : "text-slate-600 hover:text-amber-700"
                            }`
                            }
                        >
                            {link.name}
                        </NavLink>
                        )
                    )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-slate-600 hover:text-amber-700 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {links.map((link) =>
                    link.children ? (
                        <div key={link.name}>
                        {/* Botón principal */}
                        <button
                            onClick={() => toggleSubMenu(link.name)}
                            className="w-full flex justify-between items-center px-3 py-2 text-slate-600 hover:text-amber-700">
                            {link.name}
                            <span>{openSubMenu === link.name ? "−" : "+"}</span>
                        </button>
    
                        {/* Submenu */}
                        {openSubMenu === link.name && (
                            <div className="ml-4 space-y-1">
                            {link.children.map((child) => (
                                <NavLink
                                key={child.path}
                                to={child.path}
                                onClick={() => setIsMenuOpen(false)} // cerrar menu al navegar
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-sm ${
                                    isActive? "text-amber-700 font-semibold" : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                                    }` 
                                }>
                                {child.name}
                                </NavLink>
                            ))}
                            </div>
                        )}
                        </div>
                    ) : (
                        <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)} // 🔥 importante
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-md ${
                            isActive
                                ? "text-amber-700 font-semibold"
                                : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                            }`
                        }
                        >
                        {link.name}
                        </NavLink>
                    )
                    )}
                </div>
                </div>
            )}
            </nav>
    
            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="max-w-7xl mx-auto py-12 px-4">
            <AppRoutes />
            </main>
        </div>
    )
}