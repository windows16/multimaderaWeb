import { Modulos } from "@/constants/modulos"

export interface NavChild {
  name: string
  path: string
}

export interface NavLink {
  name: string
  path?: string
  moduloId: number | null // null = siempre visible, sin restricción
  children?: NavChild[]
}

export const links: NavLink[] = [
  { name: "Inicio", path: "/", moduloId: null },
  {
    name: "Materiales",
    moduloId: Modulos.materiales,
    children: [
      { name: "Materiales", path: "/materiales" },
      { name: "Inventario", path: "/inventario" },
    ],
  },
  { name: "Pedidos", path: "/pedidos", moduloId: Modulos.pedidos },
  {
    name: "Clientes",
    moduloId: Modulos.clientes,
    children: [
      { name: "Clientes", path: "/clientes" },
      { name: "Tipos de Cliente", path: "/tipos-cliente" },
    ],
  },
  {
    name: "Empleados",
    moduloId: Modulos.empleados,
    children: [
      { name: "Empleados", path: "/empleados/personas" },
      { name: "Puestos", path: "/empleados/puestos" },
      { name: "Historial Laboral", path: "/empleados/historial" },
    ],
  },
  {
    name: "Usuarios",
    moduloId: Modulos.usuarios,
    children: [
      { name: "Usuarios", path: "/usuarios/auth" },
      { name: "Roles", path: "/usuarios/roles" },
    ],
  },
  {
    name: "Reportes",
    moduloId: null,
    children: [
      { name: "Pedidos Activos", path: "/reportes/pedidos-activos" },
      { name: "Historial de Pedidos", path: "/reportes/historial-pedidos" },
      { name: "Clientes Activos", path: "/reportes/clientes-activos" },
    ],
  },
  { name: "Inicio de Sesión", path: "/sesion", moduloId: null },
]