
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

interface TriggerProps {
  abierto: boolean
  onToggle: () => void
  cantidadActivos: number
  className?: string
}

interface PanelProps {
  abierto: boolean
  onLimpiar: () => void
  cantidadActivos: number
  children: React.ReactNode
}

export const PanelFiltros = {
  Trigger: function({ abierto, onToggle, cantidadActivos, className }: TriggerProps) { 
    return (
      <div className={`${className}`}>
        <Button
          variant="outline"
          onClick={onToggle}
          className={cantidadActivos > 0 ? "border-primary text-primary" : ""}
        >
          {abierto ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          {abierto ? "Cerrar" : "Filtros"}
          {cantidadActivos > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
              {cantidadActivos}
            </span>
          )}
        </Button>
      </div>
    )
  },
  Panel: function({ abierto, onLimpiar, cantidadActivos, children }: PanelProps) { 
    return (
      <div className={`print:hidden transition-all duration-200 overflow-hidden ${
      abierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}>
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Filtros</span>
          {cantidadActivos > 0 && (
            <button
              onClick={onLimpiar}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {children}
        </div>
      </div>
    </div>
    )
  }
}
