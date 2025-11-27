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

    // POST: Criar novo contato
    if (req.method === 'POST') {
      const body = await req.json();
      const { error } = await supabase.from('contacts').insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        interest: body.interest,
        message: body.message,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Contato enviado com sucesso!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE: Remover contato
    if (req.method === 'DELETE' && id && id !== 'contacts') {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Contato removido com sucesso!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PATCH/PUT: Atualizar contato (pipeline stage, notes, etc)
    if ((req.method === 'PATCH' || req.method === 'PUT') && id && id !== 'contacts') {
      const body = await req.json();
      
      // Normalizar campos camelCase para snake_case
      const updateData: any = {};
      
      // Pipeline stage
      if (body.pipeline_stage) updateData.pipeline_stage = body.pipeline_stage;
      if (body.pipelineStage) updateData.pipeline_stage = body.pipelineStage;
      
      // Desired locations
      if (body.desired_locations) updateData.desired_locations = body.desired_locations;
      if (body.desiredLocations) updateData.desired_locations = body.desiredLocations;
      
      // Max budget
      if (body.max_budget) updateData.max_budget = body.max_budget;
      if (body.maxBudget) updateData.max_budget = body.maxBudget;
      
      // Outros campos
      if (body.typology) updateData.typology = body.typology;
      if (body.notes) updateData.notes = body.notes;
      if (body.name) updateData.name = body.name;
      if (body.email) updateData.email = body.email;
      if (body.phone) updateData.phone = body.phone;
      if (body.interest) updateData.interest = body.interest;
      if (body.message) updateData.message = body.message;
      if (body.classifications) updateData.classifications = body.classifications;
      if (body.source) updateData.source = body.source;
      if (body.source_id) updateData.source_id = body.source_id;
      if (body.source_title) updateData.source_title = body.source_title;
      if (body.source_url) updateData.source_url = body.source_url;
      
      const { error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('[Contacts PUT] Error:', error.message);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Atualizado com sucesso!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET: Listar contatos
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mapear campos snake_case para camelCase que o frontend espera
    const mappedData = (data || []).map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      interest: contact.interest,
      message: contact.message,
      createdAt: contact.created_at, // snake_case -> camelCase
      timestamp: new Date(contact.created_at).getTime(),
      pipelineStage: contact.pipeline_stage,
      desiredLocations: contact.desired_locations,
      maxBudget: contact.max_budget,
      typology: contact.typology,
      notes: contact.notes,
      classifications: contact.classifications || [],
      source: contact.source,
      sourceId: contact.source_id,
      sourceTitle: contact.source_title,
      sourceUrl: contact.source_url,
    }));

    return new Response(
      JSON.stringify({ contacts: mappedData, count: mappedData.length }),
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
