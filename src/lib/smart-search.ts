import Fuse from 'fuse.js';
import type { Project } from '../types';

/**
 * Smart Search Engine 🧠
 * Implements "Algorithmic Navigation" using Fuse.js for fuzzy matching
 * and weighted scoring to predict user intent.
 */

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
  keys: [
    { name: 'title', weight: 0.7 },       // Title is most important
    { name: 'category', weight: 0.2 },    // Category is secondary
    { name: 'description', weight: 0.1 }  // Description for context
  ]
};

// Track last known project count to know when to re-index
let lastProjectCount = 0;
let fuseInstance: Fuse<Project> | null = null;

export function initializeSearchEngine(projects: Project[]) {
  // Re-initialize if count changed or first run
  if (!fuseInstance || projects.length !== lastProjectCount) {
    fuseInstance = new Fuse(projects, FUSE_OPTIONS);
    lastProjectCount = projects.length;
    console.log('[SmartSearch] Engine updated with', projects.length, 'items');
  }
}

// Semantic Map: Maps "User Intent Words" to "System Keywords"
const SEMANTIC_MAP: Record<string, string[]> = {
  // Safety & Family
  'safe': ['park', 'security', 'lighting'],
  'kids': ['park', 'playground', 'school', 'education'],
  'family': ['park', 'social', 'culture'],
  'fun': ['culture', 'art', 'festival', 'event'],
  
  // Official
  'pay': ['tax', 'debt', 'finance'],
  'bill': ['water', 'tax', 'finance'],
  'job': ['career', 'tender', 'employment'],
  'work': ['coworking', 'office', 'job'],
  'official': ['municipality', 'mayor', 'announcement'],
  
  // Infrastructure
  'road': ['asphalt', 'transport', 'traffic'],
  'fix': ['maintenance', 'repair', 'road'],
  'dirty': ['cleaning', 'waste', 'recycling'],
  'green': ['park', 'tree', 'energy', 'solar']
};

export function searchProjects(query: string, projects: Project[]): Project[] {
  if (!query.trim()) return projects;

  // Ensure engine is up to date with latest data
  initializeSearchEngine(projects);

  // 1. Semantic Expansion
  const terms = query.toLowerCase().split(' ');
  let expandedQuery = query;
  
  terms.forEach(term => {
    const related = SEMANTIC_MAP[term];
    if (related) {
      // Add related terms to the query to boost fuzzy match
      expandedQuery += ` ${related.join(' ')}`;
    }
  });

  // 2. Run Fuse with Expanded Query
  const results = fuseInstance?.search(expandedQuery);
  
  return results?.map(result => result.item) || [];
}

export function getRecommendedProjects(projects: Project[], count = 3): Project[] {
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
