-- Adicionar campos de tracking de origem do lead
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS source_id TEXT,
ADD COLUMN IF NOT EXISTS source_title TEXT,
ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Criar índice para buscas por origem
CREATE INDEX IF NOT EXISTS idx_contacts_source 
ON public.contacts(source);

COMMENT ON COLUMN public.contacts.source IS 'Origem do lead: contact_form, project, insight, newsletter';
COMMENT ON COLUMN public.contacts.source_id IS 'ID do projeto/insight de origem';
COMMENT ON COLUMN public.contacts.source_title IS 'Título do projeto/insight de origem';
COMMENT ON COLUMN public.contacts.source_url IS 'URL de origem do lead';

