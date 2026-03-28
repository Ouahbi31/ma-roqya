CREATE TABLE IF NOT EXISTS public.article_overrides (
  id text PRIMARY KEY, -- matches the article id from hardcoded data
  title text,
  excerpt text,
  category text,
  deleted boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.article_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde lit les overrides" ON public.article_overrides FOR SELECT USING (true);
CREATE POLICY "Admin gère les overrides" ON public.article_overrides FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin modifie les overrides" ON public.article_overrides FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin supprime les overrides" ON public.article_overrides FOR DELETE USING (public.is_admin());
