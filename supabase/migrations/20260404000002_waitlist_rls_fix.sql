-- Corrige la politique RLS : le frontend admin utilise la clé anon + auth
-- On remplace la politique service_role par une politique pour les utilisateurs authentifiés

drop policy if exists "Admin lecture waitlist" on public.waitlist;

create policy "Admin lecture waitlist"
  on public.waitlist for select
  using (auth.role() = 'authenticated');
