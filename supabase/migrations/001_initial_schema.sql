-- RuqyaGuide - Schéma initial de la base de données

-- Extension pour UUID
create extension if not exists "uuid-ossp";

-- Profils utilisateurs (extension de auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  prenom text not null default '',
  email text not null default '',
  avatar_url text,
  is_premium boolean not null default false,
  subscription_id text,
  subscription_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Les utilisateurs modifient leur propre profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Insertion profil à l'inscription"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger pour créer le profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, prenom, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'prenom', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Articles
create table public.articles (
  id uuid primary key default uuid_generate_v4(),
  titre text not null,
  categorie text not null check (categorie in ('ayn', 'sihr', 'mass', 'prevention', 'healing')),
  niveau text not null check (niveau in ('beginner', 'intermediate', 'advanced')),
  resume text not null default '',
  contenu text not null default '',
  temps_lecture integer not null default 5,
  est_premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.articles enable row level security;

create policy "Articles visibles par tous"
  on public.articles for select
  using (true);

-- Douas
create table public.douas (
  id uuid primary key default uuid_generate_v4(),
  titre text not null,
  texte_arabe text not null,
  transliteration text not null default '',
  traduction text not null default '',
  audio_url text,
  categorie text not null check (categorie in ('daily', 'healing', 'sleep', 'morning')),
  created_at timestamptz not null default now()
);

alter table public.douas enable row level security;

create policy "Douas visibles par tous"
  on public.douas for select
  using (true);

-- Favoris douas
create table public.favoris_douas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  dua_id uuid references public.douas on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, dua_id)
);

alter table public.favoris_douas enable row level security;

create policy "Voir ses propres favoris"
  on public.favoris_douas for select
  using (auth.uid() = user_id);

create policy "Ajouter ses propres favoris"
  on public.favoris_douas for insert
  with check (auth.uid() = user_id);

create policy "Supprimer ses propres favoris"
  on public.favoris_douas for delete
  using (auth.uid() = user_id);

-- Quiz
create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  texte_fr text not null,
  texte_ar text not null default '',
  categorie text not null check (categorie in ('ayn', 'sihr', 'mass', 'general')),
  ordre integer not null default 0
);

alter table public.quiz_questions enable row level security;

create policy "Questions visibles par tous"
  on public.quiz_questions for select
  using (true);

create table public.quiz_resultats (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  score integer not null,
  recommandations jsonb,
  created_at timestamptz not null default now()
);

alter table public.quiz_resultats enable row level security;

create policy "Voir ses propres résultats"
  on public.quiz_resultats for select
  using (auth.uid() = user_id);

create policy "Sauvegarder ses résultats"
  on public.quiz_resultats for insert
  with check (auth.uid() = user_id);

-- Forum
create table public.forum_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  titre text not null,
  contenu text not null,
  categorie text not null check (categorie in ('testimonials', 'questions', 'help', 'douas')),
  created_at timestamptz not null default now()
);

alter table public.forum_posts enable row level security;

create policy "Posts visibles par tous"
  on public.forum_posts for select
  using (true);

create policy "Créer un post (authentifié)"
  on public.forum_posts for insert
  with check (auth.uid() = user_id);

create table public.forum_replies (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.forum_posts on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  contenu text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_replies enable row level security;

create policy "Réponses visibles par tous"
  on public.forum_replies for select
  using (true);

create policy "Créer une réponse (authentifié)"
  on public.forum_replies for insert
  with check (auth.uid() = user_id);

-- Premium: Conversations & Messages
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "Voir ses propres conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations on delete cascade not null,
  sender_id uuid references auth.users on delete cascade not null,
  contenu text not null,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Voir les messages de ses conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- Consultations
create table public.consultations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  date_heure timestamptz not null,
  lien_video text,
  statut text not null default 'pending' check (statut in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.consultations enable row level security;

create policy "Voir ses propres consultations"
  on public.consultations for select
  using (auth.uid() = user_id);

create policy "Créer une consultation"
  on public.consultations for insert
  with check (auth.uid() = user_id);

-- Programmes personnalisés
create table public.programmes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  formulaire_data jsonb not null default '{}',
  pdf_url text,
  created_at timestamptz not null default now()
);

alter table public.programmes enable row level security;

create policy "Voir ses propres programmes"
  on public.programmes for select
  using (auth.uid() = user_id);

create policy "Créer un programme"
  on public.programmes for insert
  with check (auth.uid() = user_id);

-- Suivi émotionnel
create table public.suivi_entrees (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  semaine date not null,
  humeur integer not null check (humeur between 1 and 5),
  symptomes text[] default '{}',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.suivi_entrees enable row level security;

create policy "Voir son propre suivi"
  on public.suivi_entrees for select
  using (auth.uid() = user_id);

create policy "Ajouter une entrée de suivi"
  on public.suivi_entrees for insert
  with check (auth.uid() = user_id);

-- Abonnements Stripe
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  stripe_subscription_id text not null,
  statut text not null default 'active' check (statut in ('active', 'cancelled', 'past_due', 'trialing')),
  debut timestamptz not null default now(),
  fin timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Voir ses propres abonnements"
  on public.subscriptions for select
  using (auth.uid() = user_id);
