// Helper pour appeler les endpoints /api/admin/* avec le JWT Supabase de l'utilisateur courant.
import { supabase } from './supabase';

async function getAuthHeader(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${token}` };
}

export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const auth = await getAuthHeader();
  return fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...auth,
      ...(init.headers || {}),
    },
  });
}

export async function adminGet<T = unknown>(path: string): Promise<T> {
  const r = await adminFetch(path, { method: 'GET' });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || `HTTP ${r.status}`);
  }
  return r.json();
}

export async function adminPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const r = await adminFetch(path, { method: 'POST', body: JSON.stringify(body) });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || `HTTP ${r.status}`);
  }
  return r.json();
}

export async function adminPatch<T = unknown>(path: string, body: unknown): Promise<T> {
  const r = await adminFetch(path, { method: 'PATCH', body: JSON.stringify(body) });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || `HTTP ${r.status}`);
  }
  return r.json();
}
