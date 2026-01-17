import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // NEEDS SERVICE ROLE KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting migration...');

  try {
    const projectsPath = path.resolve(__dirname, '../src/data/projects_tr.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

    console.log(`Found ${projectsData.length} projects to migrate.`);

    for (const project of projectsData) {
      const { id, title, description, content, image, category, status, location } = project;

      // Check if exists
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('id', id)
        .single();

      if (existing) {
        console.log(`Skipping existing project: ${title}`);
        continue;
      }

      const { error } = await supabase.from('projects').insert({
        id, // Use same ID from JSON to preserve links
        title,
        description,
        content,
        image_url: image,
        category,
        status: status || 'planned',
        location_lat: location?.lat,
        location_lng: location?.lng,
        votes_count: 0
      });

      if (error) {
        console.error(`Failed to insert ${title}:`, error.message);
      } else {
        console.log(`Migrated: ${title}`);
      }
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
