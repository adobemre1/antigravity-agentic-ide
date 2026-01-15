import fs from 'fs';
import path from 'path';

const ORIGINALS_DIR = '/Users/emrecnyngmail.com/Desktop/araştır/src/data/originals';
const TARGET_DIR = '/Users/emrecnyngmail.com/Desktop/araştır/src/data';

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Helper to sanitize text
const clean = (text) => text ? text.replace(/\r/g, '').trim() : '';

const processFiles = () => {
    // Check if ORIGINALS_DIR exists
    if (!fs.existsSync(ORIGINALS_DIR)) {
        console.error(`Error: Originals directory not found at ${ORIGINALS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(ORIGINALS_DIR).filter(f => f.startsWith('Proje_') && f.endsWith('.txt'));
    const projects = [];
    const taxonomy = {};

    console.log(`Found ${files.length} project files.`);

    files.forEach(file => {
        const content = fs.readFileSync(path.join(ORIGINALS_DIR, file), 'utf-8');
        const lines = content.split('\n');

        // Extract ID from filename (Proje_1_... -> 1)
        const idMatch = file.match(/Proje_(\d+)_/);
        const id = idMatch ? idMatch[1] : '0';

        // Extract Title
        let title = clean(lines[0]);
        if (title.startsWith('Proje Adı:') || title.startsWith('# ')) {
             title = clean(title.replace(/^(Proje Adı:|# )/, ''));
        }

        // Extract Description
        let description = '';
        let capturing = false;
        
        for (const line of lines) {
            const l = clean(line);
            if (l.match(/^(Proje Tanımı|Amaç|Özet)/i)) {
                capturing = true;
                continue;
            }
            if (capturing) {
                if (l.match(/^[A-ZİĞÜŞÖÇ ]{3,}:/)) { 
                   capturing = false;
                   break;
                }
                if (l) description += l + ' ';
            }
        }
        if (!description) {
            for (let i = 1; i < lines.length; i++) {
                if (clean(lines[i])) {
                    description += clean(lines[i]) + ' ';
                    if (lines[i+1] && !clean(lines[i+1])) break; 
                }
            }
        }

        // Categories mapping
        let categories = ['general']; 
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('tarım') || lowerTitle.includes('gıda') || lowerTitle.includes('tohum')) categories.push('agriculture');
        if (lowerTitle.includes('dijital') || lowerTitle.includes('teknoloji') || lowerTitle.includes('yapay') || lowerTitle.includes('siber')) categories.push('technology');
        if (lowerTitle.includes('kadın') || lowerTitle.includes('genç') || lowerTitle.includes('çocuk') || lowerTitle.includes('yaşlı') || lowerTitle.includes('engelli')) categories.push('social');
        if (lowerTitle.includes('sanat') || lowerTitle.includes('kültür') || lowerTitle.includes('müze')) categories.push('culture');
        if (lowerTitle.includes('sağlık') || lowerTitle.includes('spor')) categories.push('health');
        if (lowerTitle.includes('afet') || lowerTitle.includes('acil') || lowerTitle.includes('yangın') || lowerTitle.includes('deprem')) categories.push('disaster');
        if (lowerTitle.includes('seyhan') || lowerTitle.includes('kent') || lowerTitle.includes('belediye')) categories.push('urban');

        if (categories.length > 1) categories = categories.filter(c => c !== 'general');

        projects.push({
            id,
            title,
            description: clean(description).substring(0, 300) + (description.length > 300 ? '...' : ''),
            image: `/assets/projects/${id}.jpg`, 
            categories
        });
        
        categories.forEach(c => taxonomy[c] = c.charAt(0).toUpperCase() + c.slice(1));
    });

    projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    fs.writeFileSync(path.join(TARGET_DIR, 'projects_raw.json'), JSON.stringify(projects, null, 2));
    
    // English placeholder
    const projectsEn = projects.map(p => ({
        ...p,
        title: `[TR] ${p.title}`,
        description: `[TR] ${p.description}`
    }));
    fs.writeFileSync(path.join(TARGET_DIR, 'projects_en.json'), JSON.stringify(projectsEn, null, 2));
    
    fs.writeFileSync(path.join(TARGET_DIR, 'taxonomy.json'), JSON.stringify(taxonomy, null, 2));

    console.log('JSON generation complete.');
};

processFiles();
