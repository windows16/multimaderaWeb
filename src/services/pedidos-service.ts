import type { Pedido, DetallePedido, CreatePedidoDto, UpdatePedidoDto, CreateDetallePedidoDto, UpdateDetallePedidoDto } from '@/types/Pedidos/Pedido';
import apiMultimadera from './api-client';

// Pedidos

export async function getAllPedidos(): Promise<Pedido[]> {
    const { data } = await apiMultimadera.get("/pedidos");
    return data;
}

export async function getPedidoById(idPedido: number): Promise<Pedido> {
    const { data } = await apiMultimadera.get(`/pedidos/${idPedido}`);
    return data;
}

export async function insertPedido(pedido: CreatePedidoDto): Promise<Pedido> {
    const { data } = await apiMultimadera.post("/pedidos", pedido);
    return data;
}

export async function updatePedido(idPedido: number, pedido: UpdatePedidoDto): Promise<Pedido> {
    const { data } = await apiMultimadera.patch(`/pedidos/${idPedido}`, pedido);
    return data;
}

export async function deletePedido(idPedido: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/pedidos/${idPedido}`);
    return data;
}

export async function cancelarPedido(idPedido: number): Promise<Pedido> {
    const { data } = await apiMultimadera.patch(`/pedidos/${idPedido}/cancelar`);
    return data;
}

// Detalles de Pedidos

export async function getDetallesPedido(idPedido: number): Promise<DetallePedido[]> {
    const { data } = await apiMultimadera.get("/detalles-pedidos", {
        params: { idPedido }
    });
    return data;
}

export async function getDetallePedidoById(idDetallePedido: number): Promise<DetallePedido> {
    const { data } = await apiMultimadera.get(`/detalles-pedidos/${idDetallePedido}`);
    return data;
}

export async function insertDetallePedido({ idDetallePedido, material, ...detalle }: DetallePedido) {
    const { data } = await apiMultimadera.post("/detalles-pedidos", detalle);
    return data;
}

export async function updateDetallePedido(idDetallePedido: number, { material, ...detalle }: DetallePedido) {
    const { data } = await apiMultimadera.patch(`/detalles-pedidos/${idDetallePedido}`, detalle);
    return data;
}

export async function deleteDetallePedido(idDetallePedido: number): Promise<boolean> {
    const { data } = await apiMultimadera.delete(`/detalles-pedidos/${idDetallePedido}`);
    return data;
}
