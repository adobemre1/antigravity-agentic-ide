export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  categories: string[];
  coordinates?: number[] | [number, number];
  stats?: {
    likes: number;
    shares: number;
  };
  budget?: number; // Added for InvestorView
  status?: 'ongoing' | 'completed' | 'planned'; // Added for InvestorView
  
  // Trust & Transparency Layer
  verificationHash?: string;
  lastAudited?: string;
  auditLog?: {
    id: string;
    date: string;
    action: string;
    actor: string;
    status: 'completed' | 'current' | 'future';
  }[];
}

export interface CategoryMap {
  [key: string]: string; // category id -> display name (i18n key)
}
