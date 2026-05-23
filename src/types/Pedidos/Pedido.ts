export interface Pedido {
  idPedido: number;
  fechaInicio: string;
  fechaFin: string;
  direccion: string;
  propietario: number;
  nombrePropietario: string;
  albanil: number;
  nombreAlbanil: string;
  cancelado: boolean;
  activo?: boolean;
}

export interface DetallePedido {
  idDetallePedido: number | null;
  idPedido: number;
  idMaterial: number | null;
  cantidad?: number | null;
  total?: number | null;
  material?: string | null;
}

export type DetallesPedidoForm = Omit<DetallePedido, "material">;

export interface CreatePedidoDto {
  fechaInicio: string;
  fechaFin: string;
  direccion: string;
  propietario?: number | null;
  albanil?: number | null;
}

export interface UpdatePedidoDto {
  fechaInicio?: string;
  fechaFin?: string;
  direccion?: string;
  propietario?: number | null;
  albanil?: number | null;
  activo?: boolean;
  cancelado?: boolean;
}

export interface CreateDetallePedidoDto {
  idPedido: number;
  idMaterial: number;
  cantidad: number;
}

export interface UpdateDetallePedidoDto {
  idPedido?: number;
  idMaterial?: number;
  cantidad?: number;
}


