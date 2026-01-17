import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('Error: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and OPENAI_API_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding;
}

async function embedProjects() {
  console.log('Starting ingestion...');

  try {
    const projectsPath = path.resolve(__dirname, '../src/data/projects_tr.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

    console.log(`Found ${projectsData.length} projects to embed.`);

    for (const project of projectsData) {
      const { id, title, description, content, category } = project;
      
      // Construct a meaningful text chunk
      const textToEmbed = `Proje Adı: ${title}\nKategori: ${category}\nAçıklama: ${description}\nDetaylar: ${content}`;

      console.log(`Embedding: ${title}...`);
      const embedding = await generateEmbedding(textToEmbed);

      const { error } = await supabase.from('documents').insert({
        content: textToEmbed,
        metadata: { project_id: id, title, category },
        embedding
      });

      if (error) {
        console.error(`Failed to insert ${title}:`, error.message);
      }
    }

    console.log('Ingestion complete!');
  } catch (err) {
    console.error('Ingestion failed:', err);
  }
}

embedProjects();
