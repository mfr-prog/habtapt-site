-- ============================================
-- TABELA: contacts (formulário de contato)
-- ============================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  pipeline_stage TEXT DEFAULT 'novo',
  desired_locations TEXT[],
  max_budget TEXT,
  typology TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access contacts" ON public.contacts;
CREATE POLICY "Service role full access contacts" 
ON public.contacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert contacts" ON public.contacts;
CREATE POLICY "Public can insert contacts" 
ON public.contacts FOR INSERT WITH CHECK (true);

COMMENT ON TABLE public.contacts IS 'Contact form submissions';

-- ============================================
-- TABELA: projects (portfólio de projetos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  location TEXT,
  area TEXT,
  status TEXT DEFAULT 'Concluído',
  year INTEGER,
  client TEXT,
  images TEXT[],
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access projects" ON public.projects;
CREATE POLICY "Service role full access projects" 
ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read published projects" ON public.projects;
CREATE POLICY "Public can read published projects" 
ON public.projects FOR SELECT USING (published = true);

COMMENT ON TABLE public.projects IS 'Portfolio projects';

-- ============================================
-- TABELA: insights (blog/artigos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'HABTA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_insights_published ON public.insights(published);
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON public.insights(created_at DESC);

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access insights" ON public.insights;
CREATE POLICY "Service role full access insights" 
ON public.insights FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read published insights" ON public.insights;
CREATE POLICY "Public can read published insights" 
ON public.insights FOR SELECT USING (published = true);

COMMENT ON TABLE public.insights IS 'Blog posts and insights';

-- ============================================
-- TABELA: testimonials (depoimentos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(published);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access testimonials" ON public.testimonials;
CREATE POLICY "Service role full access testimonials" 
ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;
CREATE POLICY "Public can read published testimonials" 
ON public.testimonials FOR SELECT USING (published = true);

COMMENT ON TABLE public.testimonials IS 'Client testimonials';

