export interface Empleado {
  nombre: string
  telefono: string
  fechaNacimiento: string
  dpi: string
  numeroDeEmpleado?: number | null
}

export type FormEmpleado = Pick<Empleado, "numeroDeEmpleado" | "nombre" | "telefono" | "fechaNacimiento" | "dpi" >


