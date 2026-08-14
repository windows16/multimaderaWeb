export interface HistoricoLaboral {
  idHistorial: number;
  numeroDeEmpleado: number;
  idPuesto: number;
  fechaInicio: string;
  fechaFin: string | null;
  tipoMovimiento: string;
  motivo: string;
  puesto: string | null;
  nombreEmpleado: string;
  fechaCreacion?: string;
}

export interface FormHistoricoLaboral {
  idHistorial?: number | null;
  numeroDeEmpleado: number | null;
  idPuesto: number | null;
  fechaInicio: string;
  fechaFin: string | null;
  tipoMovimiento: string;
  motivo: string;
}
