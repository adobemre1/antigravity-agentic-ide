import type { Project } from '../types';

export type UserRole = 'citizen' | 'investor' | 'tourist';
export type DeviceType = 'mobile' | 'desktop' | 'tablet';

export type IntentCategory = 
  | 'commute' 
  | 'bills' 
  | 'leisure' 
  | 'health' 
  | 'official' 
  | 'tourism'
  | 'investment' // Added for Investor
  | 'general';

export interface IntentScore {
  category: IntentCategory;
  score: number; // 0.0 to 1.0 (Weighted)
  reason: string; // "It's Monday Morning + Citizen Role"
  suggestedAction?: string; 
  suggestedLink?: string; // Added for Direct Navigation
  icon?: string; // Icon name
}

export interface UserContext {
  role: UserRole;
  timeOfDay?: number;
  dayOfWeek?: number;
  deviceType?: DeviceType;
}

export class IntentEngine {
  private now: Date;
  private context: UserContext;

  constructor(context?: UserContext) {
    this.now = new Date();
    this.context = context || { role: 'citizen', deviceType: 'desktop' };
  }

  public setContext(context: UserContext) {
    this.context = { ...this.context, ...context };
  }

  // Detect temporal context
  private getTimeContext() {
    const hour = this.context.timeOfDay ?? this.now.getHours();
    const day = this.context.dayOfWeek ?? this.now.getDay(); // 0 = Sunday
    const date = this.now.getDate();

    const isWeekend = day === 0 || day === 6;
    const isMorning = hour >= 6 && hour < 10;
    const isLunch = hour >= 11 && hour < 14;
    const isEvening = hour >= 17 && hour < 22;
    const isBillPeriod = date >= 1 && date <= 5;

    return { isWeekend, isMorning, isLunch, isEvening, isBillPeriod };
  }

  // Main prediction function with WEIGHTED SCORING ⚖️
  public predict(): IntentScore[] {
    const ctx = this.getTimeContext();
    const { role } = this.context;
    
    const scores: IntentScore[] = [];

    // --- BASE SCORING (Time & Date) ---

    // 1. Bill Payment
    if (ctx.isBillPeriod && role === 'citizen') {
      scores.push({
        category: 'bills',
        score: 0.95, // High confidence
        reason: "Start of Month (Bill Period)",
        suggestedAction: "Pay Bills",
        suggestedLink: "/payment",
        icon: "CreditCard"
      });
    }

    // 2. Commute (Citizen + Weekday Rush Hour)
    if (role === 'citizen' && !ctx.isWeekend && (ctx.isMorning || ctx.isEvening)) {
      scores.push({
        category: 'commute',
        score: 0.85,
        reason: ctx.isMorning ? "Morning Commute" : "Evening Traffic",
        suggestedAction: "Check Traffic",
        suggestedLink: "/map?layer=traffic",
        icon: "Car"
      });
    }

    // 3. Leisure (Any Role + Weekend/Lunch)
    if (ctx.isWeekend || ctx.isLunch) {
      let score = 0.6;
      if (ctx.isWeekend) score += 0.2;
      if (role === 'tourist') score += 0.15; // Tourists love leisure

      scores.push({
        category: 'leisure',
        score: Math.min(score, 1.0),
        reason: ctx.isWeekend ? "Weekend Vibes" : "Lunch Break",
        suggestedAction: "Find Parks",
        suggestedLink: "/map?filter=park",
        icon: "Tree"
      });
    }

    // 4. Investment (Investor + Business Hours)
    if (role === 'investor' && !ctx.isWeekend && !ctx.isEvening) {
      scores.push({
        category: 'investment',
        score: 0.9,
        reason: "Business Hours (Investor)",
        suggestedAction: "View Tenders",
        suggestedLink: "/projects?category=infrastructure",
        icon: "Briefcase"
      });
    }

    // 5. Tourism (Tourist + Day)
    if (role === 'tourist' && !ctx.isEvening) {
      scores.push({
        category: 'tourism',
        score: 0.88,
        reason: "Exploring Seyhan",
        suggestedAction: "Cultural Tour",
        suggestedLink: "/projects?category=culture",
        icon: "Compass"
      });
    }

    // Fallback
    if (scores.length === 0) {
      scores.push({ 
        category: 'general', 
        score: 0.1, 
        reason: 'Default', 
        suggestedAction: 'Explore Projects', 
        suggestedLink: '/projects',
        icon: "Search" 
      });
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  public getTopIntent(): IntentScore {
    return this.predict()[0];
  }

  // Smart Sort based on Intent
  public sortProjects(projects: Project[], activeIntent: IntentCategory): Project[] {
    return [...projects].sort((a, b) => {
      return this.getProjectRelevance(b, activeIntent) - this.getProjectRelevance(a, activeIntent);
    });
  }

  private getProjectRelevance(project: Project, intent: IntentCategory): number {
    const cats = project.categories.map(c => c.toLowerCase());
    
    // Weighted semantic map
    const map: Record<IntentCategory, string[]> = {
      commute: ['transport', 'infrastructure', 'road', 'parking'],
      bills: ['finance', 'service', 'utility', 'e-payment'],
      leisure: ['park', 'culture', 'art', 'social', 'event'],
      health: ['health', 'emergency', 'hospital'],
      official: ['zoning', 'legal', 'announcement', 'municipal'],
      tourism: ['culture', 'transport', 'history', 'landmark'],
      investment: ['infrastructure', 'construction', 'zoning', 'tender'],
      general: []
    };

    const keywords = map[intent] || [];
    // 10 points for direct match, 0 for no match
    // Tie-break with stats.views or just random sort stability
    const matches = keywords.filter(k => cats.some(c => c.includes(k))).length;
    
    return matches * 10 + (project.stats?.likes || 0) * 0.01;
  }
}

// Singleton for easy import, but class is exported for context injection
export const intentEngine = new IntentEngine();

