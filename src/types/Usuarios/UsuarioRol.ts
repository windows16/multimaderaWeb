export interface UsuarioRol {
    idUsuarioRol?: number | null
    numeroDeEmpleado: number
    idRol: number
    fechaCreacion?: string | Date
}

export interface UsuarioRolCompleto extends UsuarioRol {
    tblPersonal?: {
        nombre: string
    }
    tblRoles?: {
        descripcion: string | null
    }
}

export interface AuthUser {
    id: string
    email: string
}

export interface UsuarioVinculado {
    idUsuario?: number | null
    numeroDeEmpleado: number
    auth_users_id: string
    fechaCreacion?: string | Date
}

export interface UsuarioVinculadoCompleto extends UsuarioVinculado {
    tblPersonal?: {
        nombre: string
    }
    email?: string 
    tblUsuarioRol?: UsuarioRolCompleto | null
}
