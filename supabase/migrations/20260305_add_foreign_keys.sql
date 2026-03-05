-- ==========================================
-- Migration: Indices e Constraints de Validacao
-- Data: 2026-03-05
-- ==========================================
-- NOTA: O schema e essencialmente flat (contacts, projects, insights, testimonials
-- sao tabelas independentes). contacts.source_id e polimorfico (pode referenciar
-- projects ou insights dependendo de contacts.source), por isso NAO se aplica FK directa.
-- Esta migration foca em indices de performance e constraints de validacao.

-- Indices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_contacts_pipeline_stage ON public.contacts(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_insights_category ON public.insights(category);

-- Constraint de validacao de email
ALTER TABLE public.contacts
  ADD CONSTRAINT chk_contacts_email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Newsletter unique constraint (idempotente — so adiciona se nao existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'newsletter_subscribers_email_key'
  ) THEN
    ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);
  END IF;
END $$;
