import { createClient } from 'jsr:@supabase/supabase-js@2';

// Proxy para N8N - Agendar reunião
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Chamar webhook do N8N para criar evento no Google Calendar
    const n8nUrl = 'https://mferro.app.n8n.cloud/webhook/schedule-meeting';
    
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const n8nData = await n8nResponse.json();

    if (!n8nResponse.ok) {
      throw new Error(n8nData.error || 'Erro ao criar evento no calendário');
    }

    // Salvar lead no Supabase
    const supabaseUrl = Deno.env.get('PROJECT_URL')!;
    const supabaseKey = Deno.env.get('SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('contacts').insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      interest: body.interest || 'Agendamento de reunião',
      message: body.message || `Reunião agendada para ${body.startTime}`,
      pipeline_stage: 'visita', // Já tem reunião agendada
      source: body.source || 'project',
      source_id: body.sourceId,
      source_title: body.sourceTitle,
      source_url: body.sourceUrl,
      desired_locations: body.desiredLocations ? [body.desiredLocations] : null,
      max_budget: body.maxBudget,
      typology: body.typology,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        eventId: n8nData.eventId,
        eventLink: n8nData.eventLink,
        meetLink: n8nData.meetLink,
        message: n8nData.message || 'Reunião agendada com sucesso! Você receberá um email de confirmação.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[Schedule Meeting] Error:', err);
    return new Response(
      JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Erro ao agendar reunião.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

