import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('PROJECT_URL')!;
    const supabaseKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // POST: Criar lead (interesse em imóvel)
    if (req.method === 'POST') {
      const body = await req.json();
      const { error } = await supabase.from('contacts').insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        interest: body.interest || 'Agendamento de reunião',
        message: body.message || `Interesse no projeto: ${body.projectTitle || 'Não especificado'}`,
        pipeline_stage: 'qualificado', // Leads de imóveis já entram qualificados
        desired_locations: body.desiredLocations ? [body.desiredLocations] : null,
        max_budget: body.maxBudget,
        typology: body.typology,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Reunião agendada com sucesso! Entraremos em contato em breve.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

