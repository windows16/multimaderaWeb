export interface Empleado {
  nombre: string
  telefono: string
  fechaNacimiento: string
  dpi: string
  idPuesto?: number | null
  puesto?: string | null
  numeroDeEmpleado?: number | null
}

export type FormEmpleado = Pick<Empleado, "numeroDeEmpleado" | "nombre" | "telefono" | "fechaNacimiento" | "dpi" | "idPuesto" >

