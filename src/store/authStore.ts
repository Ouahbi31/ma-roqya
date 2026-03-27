import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  prenom: string;
  email: string;
  avatar_url: string | null;
  is_premium: boolean;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, prenom: string) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await get().fetchProfile();
    return { error: null };
  },

  register: async (email, password, prenom) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { prenom },
        emailRedirectTo: window.location.origin + '/login',
      },
    });
    if (error) return { error: error.message };
    // Le profil sera créé automatiquement par le trigger SQL handle_new_user
    // L'utilisateur doit confirmer son email avant de pouvoir se connecter
    return { error: null };
  },

  loginWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  fetchProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    set({ user });
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) set({ profile: data as Profile });
  },

  initialize: async () => {
    set({ loading: true });

    // ══ MODE DÉMO ══ Supprimer ce bloc en production
    if (localStorage.getItem('ruqya_demo_premium') === 'true') {
      set({
        user: { id: 'demo-user-001', email: 'demo@ma-roqya.fr' } as User,
        profile: {
          id: 'demo-user-001',
          prenom: 'Abdellah',
          email: 'demo@ma-roqya.fr',
          avatar_url: null,
          is_premium: true,
        },
        loading: false,
      });
      return;
    }
    // ══ FIN MODE DÉMO ══

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user });
      await get().fetchProfile();
    }
    set({ loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile();
      } else {
        set({ user: null, profile: null });
      }
    });
  },
}));
