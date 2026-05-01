import axios from "axios";
import { supabase } from "../supabase/supabase-config";

const apiMultimadera = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

// interceptor para agregar el token automaticamente
apiMultimadera.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isLoggingOut = false;

// interceptor para manejar errores de autenticacion
apiMultimadera.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        console.warn("🔒 Sesión expirada");
        await supabase.auth.signOut();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiMultimadera;