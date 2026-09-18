import { getMisPermisos } from "@/features/usuarios/services/usuarios-service";
import { useEffect, useState } from "react";
import { useError } from "./useError";

interface Permisos {
  acciones: number[];
  modulos: number[];
  rol: string | null;
  numeroDeEmpleado: number | null;
}

export function usePermisos() {
  const [permisos, setPermisos] = useState<Permisos | null>(null);
  const [loading, setCargando] = useState(true);
  const { error, handleError, clearError } = useError();

  useEffect(() => {
    let mounted = true;
    const fetchPermisos = async () => {
      clearError();
      try {
        const data = await getMisPermisos();
        if (mounted) setPermisos(data);
      } catch (err) {
        handleError(err);
        if (mounted) setPermisos(null);
      } finally {
        if (mounted) setCargando(false);
      }
    };
    fetchPermisos();
    return () => { mounted = false; };
  }, []);

  return { permisos, loading, error, handleError };
}