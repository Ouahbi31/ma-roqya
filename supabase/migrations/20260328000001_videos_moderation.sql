-- Table videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  youtube_id text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vidéos visibles par tous" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admin gère les vidéos" ON public.videos FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin modifie les vidéos" ON public.videos FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin supprime les vidéos" ON public.videos FOR DELETE USING (public.is_admin());

-- Ensure forum_posts table exists (in case initial migration was incomplete)
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  titre text NOT NULL,
  contenu text NOT NULL,
  categorie text NOT NULL CHECK (categorie IN ('testimonials', 'questions', 'help', 'douas')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Add missing columns to forum_posts
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS user_name text NOT NULL DEFAULT 'Anonyme';
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS replies_count integer NOT NULL DEFAULT 0;

-- Add moderation column
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS statut text NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete'));

-- Update forum_posts RLS: users see only approved posts, admin sees all
DROP POLICY IF EXISTS "Posts visibles par tous" ON public.forum_posts;
DROP POLICY IF EXISTS "Tout le monde peut lire les posts" ON public.forum_posts;
CREATE POLICY "Voir les posts approuvés" ON public.forum_posts FOR SELECT USING (statut = 'approuve' OR public.is_admin());

-- Update insert policy to allow any authenticated user
DROP POLICY IF EXISTS "Créer un post (authentifié)" ON public.forum_posts;
DROP POLICY IF EXISTS "Utilisateurs connectés peuvent poster" ON public.forum_posts;
CREATE POLICY "Utilisateurs connectés peuvent poster" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admin can update (approve/reject)
DROP POLICY IF EXISTS "Admin modère les posts" ON public.forum_posts;
CREATE POLICY "Admin modère les posts" ON public.forum_posts FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admin supprime les posts" ON public.forum_posts;
CREATE POLICY "Admin supprime les posts" ON public.forum_posts FOR DELETE USING (public.is_admin());
