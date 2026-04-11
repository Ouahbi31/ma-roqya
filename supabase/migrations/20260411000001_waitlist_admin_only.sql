-- Sécurité : restreindre les opérations admin sur waitlist aux vrais admins
-- Avant : auth.role() = 'authenticated' permettait à TOUT user logué de lire/supprimer
-- Maintenant : seuls les admins (via public.is_admin()) peuvent

drop policy if exists "Admin lecture waitlist" on public.waitlist;
drop policy if exists "Admin suppression waitlist" on public.waitlist;

create policy "Admin lecture waitlist"
  on public.waitlist for select
  using (public.is_admin());

create policy "Admin suppression waitlist"
  on public.waitlist for delete
  using (public.is_admin());

-- Note : la politique INSERT publique reste (anyone can join the waitlist via /api/waitlist-join)
