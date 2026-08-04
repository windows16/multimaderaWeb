export interface Rol {
    descripcion: string
    idRol?: number | null
}

export interface AccionRol {
    idAccionRol?: number | null
    idAccion: number
    idRol: number
}

export interface ModuloRol {
    idModuloRol?: number | null
    idModulo: number
    idRol: number
}