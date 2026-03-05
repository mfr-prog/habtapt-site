-- ==========================================
-- FIX: RLS Policies — restringir acesso
-- ==========================================

-- CONTACTS: Anon pode inserir (formulário público), mas NÃO pode ler/update/delete
-- Apenas service_role pode ler todos
DROP POLICY IF EXISTS "Service role full access contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public can insert contacts" ON public.contacts;

CREATE POLICY "Service role full access contacts"
  ON public.contacts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Anon can insert contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

-- PROJECTS: Público pode ler publicados, service_role faz tudo
DROP POLICY IF EXISTS "Service role full access projects" ON public.projects;
DROP POLICY IF EXISTS "Public can read published projects" ON public.projects;

CREATE POLICY "Service role full access projects"
  ON public.projects FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can read published projects"
  ON public.projects FOR SELECT
  USING (published = true);

-- INSIGHTS: Mesmo padrão
DROP POLICY IF EXISTS "Service role full access insights" ON public.insights;
DROP POLICY IF EXISTS "Public can read published insights" ON public.insights;

CREATE POLICY "Service role full access insights"
  ON public.insights FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can read published insights"
  ON public.insights FOR SELECT
  USING (published = true);

-- TESTIMONIALS: Mesmo padrão
DROP POLICY IF EXISTS "Service role full access testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;

CREATE POLICY "Service role full access testimonials"
  ON public.testimonials FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public can read published testimonials"
  ON public.testimonials FOR SELECT
  USING (published = true);

-- NEWSLETTER_SUBSCRIBERS: Anon pode inserir, service_role faz tudo
DROP POLICY IF EXISTS "Service role full access" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Service role full access newsletter"
  ON public.newsletter_subscribers FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Anon can subscribe newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);
