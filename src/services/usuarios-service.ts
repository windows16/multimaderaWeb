import apiMultimadera from './api-client';
import type { RolConAccion } from '../types/Usuarios/RoleConAccion';

// ── ROLES ──────────────────────────────────────────────

export async function getAllRoles(): Promise<RolConAccion[]> {
    const { data } = await apiMultimadera.get('/usuarios');
    return data;
}

export async function getAllRolesWithAcciones(): Promise<RolConAccion[]> {
    const { data } = await apiMultimadera.get('/usuarios/roles/acciones');
    return data;
}

export async function insertRol(modelo: Omit<RolConAccion, 'idRol'>): Promise<RolConAccion> {
    const { data } = await apiMultimadera.post('/usuarios', modelo);
    return data;
}

export async function updateRol(idRol: number, modelo: Partial<RolConAccion>): Promise<RolConAccion> {
    const { data } = await apiMultimadera.patch(`/usuarios/${idRol}`, modelo);
    return data;
}

export async function deleteRol(idRol: number): Promise<{ mensaje: string }> {
    const { data } = await apiMultimadera.delete(`/usuarios/${idRol}`);
    return data;
}