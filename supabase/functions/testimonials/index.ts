import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('PROJECT_URL')!;
    const supabaseKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    // POST: Criar depoimento
    if (req.method === 'POST') {
      const body = await req.json();
      
      // Criar objeto com campos compatíveis com a tabela
      const testimonialData = {
        name: body.name,
        role: body.role,
        company: body.company,
        content: body.content,
        rating: body.rating || 5,
        image: body.image,
        project: body.project,
        order: body.order || 0,
        published: body.published !== undefined ? body.published : true,
      };
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonialData)
        .select()
        .single();

      if (error) {
        console.error('[Testimonials] Insert error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Depoimento criado com sucesso!', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE: Remover depoimento
    if (req.method === 'DELETE' && id && id !== 'testimonials') {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Depoimento removido com sucesso!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PATCH/PUT: Atualizar depoimento
    if ((req.method === 'PATCH' || req.method === 'PUT') && id && id !== 'testimonials') {
      const body = await req.json();
      
      // Criar objeto com campos compatíveis com a tabela
      const testimonialData: any = {};
      if (body.name !== undefined) testimonialData.name = body.name;
      if (body.role !== undefined) testimonialData.role = body.role;
      if (body.company !== undefined) testimonialData.company = body.company;
      if (body.content !== undefined) testimonialData.content = body.content;
      if (body.rating !== undefined) testimonialData.rating = body.rating;
      if (body.image !== undefined) testimonialData.image = body.image;
      if (body.project !== undefined) testimonialData.project = body.project;
      if (body.order !== undefined) testimonialData.order = body.order;
      if (body.published !== undefined) testimonialData.published = body.published;
      testimonialData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Testimonials] Update error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Depoimento atualizado com sucesso!', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET: Buscar depoimentos
    // Se vier do admin, busca todos; se do site público, só publicados
    const isAdmin = req.headers.get('x-admin-request') === 'true';
    
    let query = supabase.from('testimonials').select('*');
    
    if (!isAdmin) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Para admin, retornar objeto com count; para site, array direto
    if (isAdmin) {
      return new Response(
        JSON.stringify({ testimonials: data || [], count: data?.length || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data || []),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Erro ao processar requisição.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};
