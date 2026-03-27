-- Allow admin to see all profiles
CREATE POLICY "Admin voit tous les profils"
  ON public.profiles FOR SELECT USING (public.is_admin());
