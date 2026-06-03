import apiMultimadera from './api-client';
import type { Rol } from '../types/Usuarios/RoleConAccion';

// ── ROLES ──────────────────────────────────────────────

export async function getAllRoles(): Promise<Rol[]> {
    const { data } = await apiMultimadera.get('/roles');
    return data;
}

export async function getAllRolesWithAcciones(): Promise<Rol[]> {
    const { data } = await apiMultimadera.get('/roles/roles/acciones');
    return data;
}

export async function insertRol(modelo: Omit<Rol, 'idRol'>): Promise<Rol> {
    const { data } = await apiMultimadera.post('/roles', modelo);
    return data;
}

export async function updateRol(idRol: number, modelo: Partial<Rol>): Promise<Rol> {
    const { data } = await apiMultimadera.patch(`/roles/${idRol}`, modelo);
    return data;
}

export async function deleteRol(idRol: number): Promise<{ mensaje: string }> {
    const { data } = await apiMultimadera.delete(`/roles/${idRol}`);
    return data;
}