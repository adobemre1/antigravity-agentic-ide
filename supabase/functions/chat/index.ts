import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAIStream, StreamingTextResponse } from "https://esm.sh/ai";
import OpenAI from "https://esm.sh/openai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // 1. Generate embedding for query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: lastMessage.replace(/\n/g, ' '),
    });
    const embedding = embeddingResponse.data[0].embedding;

    // 2. Search for similar documents
    const { data: documents, error } = await supabaseClient.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.5, // Similarity threshold
      match_count: 3, // Top 3 results
    });

    if (error) throw error;

    const context = documents?.map((doc: { content: string }) => doc.content).join('\n---\n') || 'No specific context found.';

    // 3. Construct System Prompt
    const systemPrompt = `You are "Seyhan AI", a helpful, polite, and knowledgeable assistant for the Seyhan Municipality (Seyhan Belediyesi).
    
    Traits:
    - Tone: Official but friendly, citizen-focused.
    - Language: Turkish (Türkçe) primarily, or match user.
    - Goal: Answer questions AND help users navigate the portal.
    
    Capabilities:
    - You can filter the project map/list using the 'filterProjects' tool.
    - You can navigate the user to pages using 'navigate'.
    
    Instructions:
    - Use the provided CONTEXT to answer questions.
    - If a user asks to "show parks" or "find traffic projects", USE THE TOOLS.
    - If the answer is not in context and requires no action, politely apologize.
    
    CONTEXT:
    ${context}
    `;

    // 4. Create Chat Completion Stream
    const tools = [
      {
        type: 'function',
        function: {
          name: 'filterProjects',
          description: 'Filter projects by text search or category, or switch view mode.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Text to search for' },
              category: { type: 'string', description: 'Category filter' },
              view: { type: 'string', enum: ['grid', 'map'], description: 'View mode' },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'navigate',
          description: 'Navigate to a specific route.',
          parameters: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Route path (e.g. /profile, /admin)' },
            },
            required: ['path'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'toggleTheme',
          description: 'Change theme mode.',
          parameters: {
            type: 'object',
            properties: {
              mode: { type: 'string', enum: ['light', 'dark', 'system'] },
            },
          },
        },
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.filter((m: { role: string }) => m.role !== 'system'),
      ],
      tools: tools,
      tool_choice: 'auto',
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream, { headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
