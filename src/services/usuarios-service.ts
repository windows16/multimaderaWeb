
import apiMultimadera from './api-client';

// Usuarios

export async function getAllRolesWithAcciones(){
    const { data } = await apiMultimadera.get("/usuarios/acciones/all");
    return data;
}

