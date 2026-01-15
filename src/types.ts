export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  categories: string[];
}

export interface CategoryMap {
  [key: string]: string; // category id -> display name (i18n key)
}
