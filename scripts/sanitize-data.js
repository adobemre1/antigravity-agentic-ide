import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../src/data');
const files = ['projects_en.json', 'projects_tr.json'];

// Helper to reliably sanitize text
const sanitizeTitle = (text) => {
  return text
    .replace(/^\[TR\] PROJE \d+:\s*/i, '') // Remove prefix like "[TR] PROJE 1:"
    .replace(/^PROJE \d+:\s*/i, '')        // Remove "PROJE 1:"
    .replace(/^\[TR\]\s*/i, '')             // Remove "[TR]"
    .trim();
};

// Helper to sanitize description
const sanitizeDescription = (text) => {
  return text
    .replace(/^\[TR\]\s*/i, '') // Remove "[TR]" prefix
    .trim();
};

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  // Backup
  fs.copyFileSync(filePath, `${filePath}.bak`);
  console.log(`Backed up ${file}`);

  const rawData = fs.readFileSync(filePath, 'utf8');
  const projects = JSON.parse(rawData);

  console.log(`Processing ${projects.length} projects in ${file}...`);

  const uniqueProjects = projects.map((p, index) => {
    // Re-index IDs strictly from 1
    const newId = (index + 1).toString();
    
    // Cycle through images 1-6 for variety if default is used
    // Assuming we have assets/projects/1.jpg to 6.jpg available or placeholders
    // For now, keeping original if it exists, or assigning based on ID
    let image = p.image;
    if (!image || image === '/assets/projects/1.jpg') {
       const imgId = (index % 6) + 1;
       image = `/assets/projects/${imgId}.jpg`;
    }

    return {
      ...p,
      id: newId,
      title: sanitizeTitle(p.title),
      description: sanitizeDescription(p.description),
      image: image
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(uniqueProjects, null, 2));
  console.log(`Sanitized ${uniqueProjects.length} projects in ${file}`);
});
