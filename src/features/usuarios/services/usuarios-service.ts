import apiMultimadera from '../../../services/api-client';
import type { AccionRol, Rol, ModuloRol } from '../models/RoleConAccion';
import type { UsuarioRol, UsuarioRolCompleto, AuthUser, UsuarioVinculado, UsuarioVinculadoCompleto } from '../models/UsuarioRol';

// ── ROLES ──────────────────────────────────────────────

export async function getAllRoles(): Promise<Rol[]> {
    const { data } = await apiMultimadera.get('/roles');
    return data;
}

export async function insertRol(modelo: Omit<Rol, 'idRol'>): Promise<boolean> {
    const { data } = await apiMultimadera.post('/roles', modelo);
    return data;
}

export async function updateRol(idRol: number, modelo: Partial<Rol>): Promise<boolean> {
    const { data } = await apiMultimadera.patch(`/roles/${idRol}`, modelo);
    return data;
}

export async function deleteRol(idRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/roles/${idRol}`);
    return data;
}

// ── ACCIONES POR ROL ───────────────────────────────────

export async function getAccionesByRol(idRol: number): Promise<AccionRol[]> {
    const { data } = await apiMultimadera.get(`/acciones-rol/${idRol}`);
    return data;
}

export async function createAccionRol(modelo: Omit<AccionRol, 'idAccionRol'>): Promise<boolean> {
    const { data } = await apiMultimadera.post('/acciones-rol', modelo);
    return data;
}

export async function deleteAccionRol(idAccionRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/acciones-rol/${idAccionRol}`);
    return data;
}

export async function deleteAllAccionesByRol(idRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/acciones-rol/rol/${idRol}`);
    return data;
}

// ── MODULOS POR ROL ───────────────────────────────────

export async function getModulosByRol(idRol: number): Promise<ModuloRol[]> {
    const { data } = await apiMultimadera.get(`/modulo-rol/${idRol}`);
    return data;
}

export async function createModuloRol(modelo: Omit<ModuloRol, 'idModuloRol'>): Promise<boolean> {
    const { data } = await apiMultimadera.post('/modulo-rol', modelo);
    return data;
}

export async function deleteModuloRol(idModuloRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/modulo-rol/${idModuloRol}`);
    return data;
}

export async function deleteAllModulosByRol(idRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/modulo-rol/rol/${idRol}`);
    return data;
}

// ── USUARIO ROL ────────────────────────────────────────

export async function getAllUsuariosRol(): Promise<UsuarioRolCompleto[]> {
    const { data } = await apiMultimadera.get('/usuarios-rol');
    return data;
}

export async function insertUsuarioRol(modelo: Omit<UsuarioRol, 'idUsuarioRol' | 'fechaCreacion'>): Promise<boolean> {
    const { data } = await apiMultimadera.post('/usuarios-rol', modelo);
    return data;
}

export async function updateUsuarioRol(numeroDeEmpleado: number, idRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.patch(`/usuarios-rol/${numeroDeEmpleado}`, { idRol });
    return data;
}

export async function deleteUsuarioRol(idUsuarioRol: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/usuarios-rol/${idUsuarioRol}`);
    return data;
}

// ── VINCULACIÓN AUTH ───────────────────────────────────

export async function getAuthUsers(): Promise<AuthUser[]> {
    const { data } = await apiMultimadera.get('/auth-usuarios/supabase-users');
    return data;
}

export async function getAllUsuariosVinculados(): Promise<UsuarioVinculadoCompleto[]> {
    const { data } = await apiMultimadera.get('/auth-usuarios/vinculados');
    return data;
}

export async function vincularUsuario(modelo: Omit<UsuarioVinculado, 'idUsuario' | 'fechaCreacion'>): Promise<boolean> {
    const { data } = await apiMultimadera.post('/auth-usuarios/vincular', modelo);
    return data;
}

export async function desvincularUsuario(idUsuario: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/auth-usuarios/desvincular/${idUsuario}`);
    return data;
}

export async function createAuthUser(modelo: { email: string, password: string }): Promise<{ id: string, email: string }> {
    const { data } = await apiMultimadera.post('/auth-usuarios/create', modelo);
    return data;
}

// ── MIS PERMISOS (usuario autenticado) ───────────────────────────────────
export async function getMisPermisos(): Promise<{ acciones: number[]; accionesPorModulo?: Record<number, number[]>; modulos: number[]; rol: string | null; numeroDeEmpleado: number | null }> {
    const { data } = await apiMultimadera.get('/auth-usuarios/mis-permisos');
    return data;
}