import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read projects data safely
const projectsPath = path.join(__dirname, '../src/data/projects_en.json');
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

// Default URL or from ENV
const BASE_URL = process.env.VITE_APP_URL || 'https://seyhan-portal.netlify.app';

console.log(`Generating sitemap for ${projects.length} projects...`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${projects.map(p => `  <url>
    <loc>${BASE_URL}/project/${p.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`Sitemap generated at ${outputPath}`);
