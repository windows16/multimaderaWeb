// types/filtros.ts
export type Operador = "includes" | "equals" | "gte" | "lte"

export interface ConfigFiltro<T> {
  campo: keyof T
  operador: Operador
  valor: string
}