-- Adicionar campo de classificação de leads
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS classifications TEXT[];

-- Criar índice para buscas por classificação
CREATE INDEX IF NOT EXISTS idx_contacts_classifications 
ON public.contacts USING GIN(classifications);

COMMENT ON COLUMN public.contacts.classifications IS 'Classificações do lead: Comprador, Vendedor, Inquilino, Arrendatário';

