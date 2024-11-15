// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const { username, description, createdAt, imageUrl, postId } =
      await req.json();

    // URL del Webhook de Slack
    const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');

    if (!slackWebhookUrl) {
      return new Response('SLACK_WEBHOOK_URL not configured', {
        status: 500,
        headers: corsHeaders,
      });
    }
    // Payload para Slack
    const payload = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'New post!',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Username:*\n${username}`,
            },
            {
              type: 'mrkdwn',
              text: `*Created at:*\n${createdAt}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Description:*\n${description}`,
            },
          ],
        },
        {
          type: 'image',
          image_url: imageUrl,
          alt_text: 'delicious tacos',
        },
        {
          type: 'actions',
          block_id: postId,
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                emoji: true,
                text: 'Approve',
              },
              style: 'primary',
              value: 'approve',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                emoji: true,
                text: 'Reject',
              },
              style: 'danger',
              value: 'reject',
            },
          ],
        },
      ],
    };

    // Enviar la solicitud a Slack
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.text();
      return new Response(`Slack API error: ${error}`, {
        status: 500,
        headers: corsHeaders,
      });
    }
    return new Response('Message sent to Slack!', {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notify-post' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
