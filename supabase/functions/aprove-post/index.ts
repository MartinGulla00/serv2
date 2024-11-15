// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Inicializar cliente
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Only POST requests are allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();
    const payload = JSON.parse(formData.get('payload') as string);
    // Extraer la información de la acción
    const action = payload.actions[0];
    const actionValue = action.value; // "approve" o "reject"
    const postId = action.block_id; // ID del post asociado

    // Procesar la acción según el valor del botón
    if (actionValue === 'approve') {
      await supabase.from('posts').update({ approved: true }).eq('id', postId);
    } else if (actionValue === 'reject') {
      await supabase.from('posts').delete().eq('id', postId);
    }

    // Responder a Slack
    return new Response(
      JSON.stringify({
        text: `Post ${actionValue === 'approve' ? 'approved' : 'rejected'} successfully!`,
        replace_original: true,
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
