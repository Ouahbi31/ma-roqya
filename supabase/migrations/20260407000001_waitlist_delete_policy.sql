-- Ajoute la politique RLS pour permettre aux admins authentifiés de supprimer des inscriptions waitlist

create policy "Admin suppression waitlist"
  on public.waitlist for delete
  using (auth.role() = 'authenticated');
