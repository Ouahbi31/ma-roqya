-- Table liste d'attente pour les programmes
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  programme_slug text not null,
  position integer, -- calculé à l'insertion
  discount_percent integer, -- 50 ou 30 selon la position
  notified boolean default false, -- true quand l'email de lancement a été envoyé
  created_at timestamptz default now(),
  unique(email, programme_slug)
);

-- Position auto-incrémentée par programme
create or replace function public.set_waitlist_position()
returns trigger language plpgsql as $$
begin
  select coalesce(max(position), 0) + 1
    into new.position
    from public.waitlist
   where programme_slug = new.programme_slug;

  -- Paliers de remise
  if new.position <= 10 then
    new.discount_percent := 50;
  elsif new.position <= 50 then
    new.discount_percent := 30;
  else
    new.discount_percent := 0;
  end if;

  return new;
end;
$$;

create trigger trg_waitlist_position
  before insert on public.waitlist
  for each row execute function public.set_waitlist_position();

-- Accès public en écriture (inscription sans compte)
alter table public.waitlist enable row level security;

create policy "Inscription waitlist publique"
  on public.waitlist for insert
  with check (true);

-- Seul l'admin (service role) peut lire
create policy "Admin lecture waitlist"
  on public.waitlist for select
  using (auth.role() = 'service_role');
