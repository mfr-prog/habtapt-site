-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON public.newsletter_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy: Anon can only insert (for public subscriptions)
CREATE POLICY "Public can subscribe" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.newsletter_subscribers IS 'Stores newsletter subscription emails with timestamps';

