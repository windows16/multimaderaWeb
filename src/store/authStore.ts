import { create } from "zustand"
import { supabase } from "../supabase/supabase-config"
import type { User, Session } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialize: () => void
  logout: () => Promise<void>
  login: (email:string, password:string) => Promise<{error: Error | null}>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
      })
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null })
    })
  },
  login: async (email:string, password:string) =>  {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return {error}
  },
  logout: async () => {
    await supabase.auth.signOut()
  },
}))