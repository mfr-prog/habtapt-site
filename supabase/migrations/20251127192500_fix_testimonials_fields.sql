-- ============================================
-- FIX: Ajustar campos da tabela testimonials
-- ============================================

-- Renomear 'text' para 'content' (mais semântico)
ALTER TABLE public.testimonials 
  RENAME COLUMN text TO content;

-- Adicionar campo 'project' para informações do projeto
ALTER TABLE public.testimonials 
  ADD COLUMN IF NOT EXISTS project TEXT;

-- Adicionar campo 'order' para ordenação customizada
ALTER TABLE public.testimonials 
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Renomear 'image_url' para 'image' (consistência com frontend)
ALTER TABLE public.testimonials 
  RENAME COLUMN image_url TO image;

COMMENT ON COLUMN public.testimonials.content IS 'Testimonial text content';
COMMENT ON COLUMN public.testimonials.project IS 'Project information or additional context';
COMMENT ON COLUMN public.testimonials."order" IS 'Custom display order';

