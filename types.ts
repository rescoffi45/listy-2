export type CategoryId = string;

export enum CategoryType {
  Movies = 'Movies',
  TVShows = 'TV Shows',
  Books = 'Books',
  Games = 'Video Games',
  BoardGames = 'Board Games',
  Podcasts = 'Podcasts',
  Music = 'Music',
  Wines = 'Wines',
  Beers = 'Beers',
  Links = 'Links',
  ToDo = 'To-Do'
}

export interface Item {
  id: string;
  category: string; // simplified from enum to allow custom
  title: string;
  image?: string;
  subtitle?: string; // e.g., Author, Year, Platform
  rating?: number;
  addedAt: number;
  completed?: boolean;
  notes?: string;
  externalId?: string;
  metadata?: Record<string, any>;
}

export interface CategoryDef {
  id: string;
  type: string; // acts as the key
  icon: string;
  label: string;
  isSystem?: boolean;
}

export type SortOption = 'title' | 'date' | 'rating' | 'completed';