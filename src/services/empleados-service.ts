
import type { FormPuesto, Puesto } from '@/types/Empleados/Puesto';
import type { Empleado, FormEmpleado } from '../types/Empleados/Empleado'
import type { FormHistoricoLaboral, HistoricoLaboral } from '../types/Empleados/HistoricoLaboral'
import apiMultimadera from './api-client';

// Empleados

export async function getAllEmpleados(): Promise<Empleado[]> {
  const { data } = await apiMultimadera.get("/empleados");
  return data;
}

export async function getAllEstadosEmpleados(): Promise<Empleado[]> {
  const { data } = await apiMultimadera.get("/empleados/estados");
  return data;
}

export async function getEmpleadoById(
  numeroDeEmpleado: number
): Promise<Empleado> {
  const { data } = await apiMultimadera.get(`/empleados/${numeroDeEmpleado}`);
  return data;
}

export async function deleteEmpleado(
  numeroDeEmpleado: number
): Promise<boolean> {
  const { data } = await apiMultimadera.delete(`/empleados/${numeroDeEmpleado}`);
  return data;
}
 
export async function insertEmpleado({numeroDeEmpleado, ...Data}: FormEmpleado) {
  const { data } = await apiMultimadera.post("/empleados", Data);
  return data;
}

export async function updateEmpleado({numeroDeEmpleado, ...Data}: FormEmpleado) {
  const { data } = await apiMultimadera.patch(`/empleados/${numeroDeEmpleado}`, Data);
  return data;
}

// Empleados - Puestos

export async function getAllPuestos(): Promise<Puesto[]> {
  const { data } = await apiMultimadera.get("/puestos");
  return data;
}

export async function getPuestoById(idPuesto: number): Promise<Puesto> {
  const { data } = await apiMultimadera.get(`/puestos/${idPuesto}`);
  return data;
}

export async function insertPuesto({ idPuesto, ...Data }: FormPuesto) {
  const { data } = await apiMultimadera.post("/puestos", Data);
  return data;
}

export async function updatePuesto({ idPuesto, ...Data }: FormPuesto) {
  const { data } = await apiMultimadera.patch(`/puestos/${idPuesto}`, Data);
  return data;
}

export async function deletePuesto(idPuesto: number): Promise<boolean> {
  const { data } = await apiMultimadera.delete(`/puestos/${idPuesto}`);
  return data;
}

// Historial Laboral

export async function getAllHistoricoEmpleados(): Promise<HistoricoLaboral[]> {
  const { data } = await apiMultimadera.get("/historico-empleados");
  return data;
}

export async function insertHistoricoEmpleado({ idHistorial, ...Data }: FormHistoricoLaboral) {
  const { data } = await apiMultimadera.post("/historico-empleados", Data);
  return data;
}

export async function updateHistoricoEmpleado({ idHistorial, ...Data }: FormHistoricoLaboral) {
  const { data } = await apiMultimadera.patch(`/historico-empleados/${idHistorial}`, Data);
  return data;
}
