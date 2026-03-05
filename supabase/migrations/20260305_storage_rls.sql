-- Storage RLS policies for HABTA image buckets
-- Buckets: make-4b2936bc-projects, make-4b2936bc-insights, make-4b2936bc-testimonials, make-4b2936bc-units
-- Public read access; authenticated users can upload/update/delete.

-- =============================================================================
-- SELECT (public read)
-- =============================================================================

CREATE POLICY "Public read access for project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'make-4b2936bc-projects');

CREATE POLICY "Public read access for insight images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'make-4b2936bc-insights');

CREATE POLICY "Public read access for testimonial images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'make-4b2936bc-testimonials');

CREATE POLICY "Public read access for unit images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'make-4b2936bc-units');

-- =============================================================================
-- INSERT (authenticated only)
-- =============================================================================

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'make-4b2936bc-projects');

CREATE POLICY "Authenticated users can upload insight images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'make-4b2936bc-insights');

CREATE POLICY "Authenticated users can upload testimonial images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'make-4b2936bc-testimonials');

CREATE POLICY "Authenticated users can upload unit images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'make-4b2936bc-units');

-- =============================================================================
-- UPDATE (authenticated only)
-- =============================================================================

CREATE POLICY "Authenticated users can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-projects')
  WITH CHECK (bucket_id = 'make-4b2936bc-projects');

CREATE POLICY "Authenticated users can update insight images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-insights')
  WITH CHECK (bucket_id = 'make-4b2936bc-insights');

CREATE POLICY "Authenticated users can update testimonial images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-testimonials')
  WITH CHECK (bucket_id = 'make-4b2936bc-testimonials');

CREATE POLICY "Authenticated users can update unit images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-units')
  WITH CHECK (bucket_id = 'make-4b2936bc-units');

-- =============================================================================
-- DELETE (authenticated only)
-- =============================================================================

CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-projects');

CREATE POLICY "Authenticated users can delete insight images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-insights');

CREATE POLICY "Authenticated users can delete testimonial images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-testimonials');

CREATE POLICY "Authenticated users can delete unit images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'make-4b2936bc-units');
