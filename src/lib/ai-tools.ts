import { z } from 'zod';

// Define the schema for the tools
export const filterProjectsSchema = z.object({
  query: z.string().optional().describe('Text to search for in projects'),
  category: z.string().optional().describe('Category to filter by (e.g., technology, urban, agriculture)'),
  view: z.enum(['grid', 'map']).optional().describe('View mode to switch to'),
});

export const navigateSchema = z.object({
  path: z.string().describe('The path to navigate to (e.g., "/profile", "/admin", "/")'),
});

export const themeSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']).describe('The theme mode to specificy'),
});

// Tool Definitions for Vercel AI SDK
export const clientTools = {
  filterProjects: {
    description: 'Filter projects by text or category, or switch view mode.',
    parameters: filterProjectsSchema,
  },
  navigate: {
    description: 'Navigate the user to a specific page.',
    parameters: navigateSchema,
  },
  toggleTheme: {
    description: 'Change the application theme.',
    parameters: themeSchema,
  },
  resetFilters: {
    description: 'Clear all search queries and category filters.',
    parameters: z.object({}),
  },
};

// System Prompt describing the Persona
export const SEYHAN_SYSTEM_PROMPT = `
You are the "Seyhan AI Assistant", a helpful, intelligent, and action-oriented agent for the Seyhan Municipality Project Portal.

**Your Capabilities:**
1.  **Answer Questions**: You know about the 99+ projects (Seyhan AI-Traffic, Digital Twin, etc.).
2.  **Control the UI**: You can filter the project list, switch to map view, and navigate to pages.

**Rules:**
- If a user asks to "see parks" or "find technology projects", call the \`filterProjects\` tool.
- If a user wants to "go to the profile" or "login", call the \`navigate\` tool.
- Always be polite, concise, and professional.
- If the user speaks Turkish, reply in Turkish. If English, reply in English.
- Your goal is to make the portal finding experience "Zero Friction".

**Personality:**
- Modern, Efficient, Transpaent (Seyhan Municipality Values).
- Use emojis sparingly but effectively 🚀.
`;

/**
 * CLIENT-SIDE EXECUTOR
 * This function handles the actual execution of tools on the client.
 * It interacts with the Zustand store and React Router.
 */
export async function executeClientTool(
  toolName: string, 
  args: Record<string, unknown>, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeMethods: any, 
  navigateFn: (path: string) => void
) {
  console.log(`[AI-Agent] Executing tool: ${toolName}`, args);

  switch (toolName) {
    case 'filterProjects':
      if (args.query !== undefined) storeMethods.setSearchQuery(args.query);
      
      // Handle view mode via Custom Event (HomePage listens to this)
      if (args.view) {
          window.dispatchEvent(new CustomEvent('ai-view-change', { detail: args.view }));
      }
      return `Filtered projects by "${args.query || 'all'}" and view "${args.view || 'current'}"`;

    case 'navigate':
      navigateFn(args.path as string);
      return `Navigated to ${args.path}`;

    case 'resetFilters':
        storeMethods.setSearchQuery('');
        if (storeMethods.clearSelectedCategories) {
            storeMethods.clearSelectedCategories();
        }
        return 'Filters reset.';

    default:
      return 'Tool not found.';
  }
}
