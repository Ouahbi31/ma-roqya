-- ═══════════════════════════════════════════════════════
-- 002: Admin role, disponibilités, contact messages
-- ═══════════════════════════════════════════════════════

-- 1. Add role column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- Set admin by email
UPDATE public.profiles SET role = 'admin' WHERE email = 'coaching.roqya@gmail.com';

-- 2. Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Create disponibilites table
CREATE TABLE IF NOT EXISTS public.disponibilites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jour integer NOT NULL CHECK (jour BETWEEN 0 AND 6), -- 0=Dim, 1=Lun, ..., 6=Sam
  heure text NOT NULL,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (jour, heure)
);

ALTER TABLE public.disponibilites ENABLE ROW LEVEL SECURITY;

-- Everyone can read slots (Tarifs page needs this)
CREATE POLICY "Disponibilités visibles par tous"
  ON public.disponibilites FOR SELECT
  USING (true);

-- Only admin can manage slots
CREATE POLICY "Admin gère les disponibilités"
  ON public.disponibilites FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin modifie les disponibilités"
  ON public.disponibilites FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin supprime les disponibilités"
  ON public.disponibilites FOR DELETE
  USING (public.is_admin());

-- 4. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nom text NOT NULL,
  email text NOT NULL,
  type text NOT NULL CHECK (type IN ('contact', 'bug', 'suggestion')),
  sujet text NOT NULL,
  message text NOT NULL,
  lu boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message
CREATE POLICY "Tout le monde peut envoyer un message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only admin can read messages
CREATE POLICY "Admin lit les messages"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin());

-- Only admin can update (mark as read)
CREATE POLICY "Admin met à jour les messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin());

-- 5. Seed current availability slots
INSERT INTO public.disponibilites (jour, heure) VALUES
  -- Lundi (1)
  (1, '09:00'), (1, '10:00'), (1, '14:00'), (1, '15:00'), (1, '16:00'),
  -- Mardi (2)
  (2, '09:00'), (2, '10:00'), (2, '14:00'), (2, '15:00'), (2, '16:00'),
  -- Mercredi (3)
  (3, '09:00'), (3, '10:00'), (3, '14:00'), (3, '15:00'), (3, '16:00'),
  -- Jeudi (4)
  (4, '09:00'), (4, '10:00'), (4, '14:00'), (4, '15:00'), (4, '16:00'),
  -- Vendredi (5)
  (5, '09:00'), (5, '10:00'), (5, '14:00'), (5, '15:00')
ON CONFLICT (jour, heure) DO NOTHING;
