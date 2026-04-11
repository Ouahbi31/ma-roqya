// Helper d'authentification pour les endpoints /api/admin/*
// Vérifie le JWT Supabase fourni dans le header Authorization et que l'utilisateur est admin.
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

/**
 * Vérifie que l'appelant est admin.
 * @returns { ok: true, user } ou { ok: false, status, error }
 */
export async function requireAdmin(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Missing Authorization header' };
  }
  const token = authHeader.slice(7);

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, error: 'Invalid token' };
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (profileErr || profile?.role !== 'admin') {
    return { ok: false, status: 403, error: 'Forbidden: admin only' };
  }

  return { ok: true, user: userData.user };
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
