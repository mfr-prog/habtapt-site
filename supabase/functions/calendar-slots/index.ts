// Proxy para N8N - Buscar horários disponíveis
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate') || new Date().toISOString().split('T')[0];
    const endDate = url.searchParams.get('endDate') || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0];

    // Chamar webhook do N8N
    const n8nUrl = `https://mferro.app.n8n.cloud/webhook/calendar-slots?startDate=${startDate}&endDate=${endDate}`;
    
    const response = await fetch(n8nUrl);
    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[Calendar Slots] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar horários disponíveis.', slots: [], count: 0 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

