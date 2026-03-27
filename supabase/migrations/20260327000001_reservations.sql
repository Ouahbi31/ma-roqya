CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nom text NOT NULL,
  email text NOT NULL,
  telephone text,
  notes text,
  date_reservation date NOT NULL,
  heure text NOT NULL,
  montant integer NOT NULL DEFAULT 5000,
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  statut text NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'payee', 'annulee', 'remboursee')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Créer une réservation"
  ON public.reservations FOR INSERT WITH CHECK (true);

CREATE POLICY "Voir ses réservations"
  ON public.reservations FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
  );

CREATE POLICY "Admin modifie les réservations"
  ON public.reservations FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin supprime les réservations"
  ON public.reservations FOR DELETE USING (public.is_admin());
