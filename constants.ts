import { CategoryType, CategoryDef } from './types';

export const TMDB_API_KEY = 'ef5d138e190f392876196b60d31eee5c';
export const THEGAMESDB_API_KEY = '3ec38215a61bb9516d7458f8fbb4e9dbd08cb92c259c1f8e73c0de66c78f9c06';
export const PODCAST_INDEX_KEY = 'YPP8ZYNGCHS2JU5F7H5K';
export const PODCAST_INDEX_SECRET = '2XkU^Aar4uxRR6Tb75UqUW8GES#yxPTpsMERZvh4';

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: 'todo', type: CategoryType.ToDo, icon: 'CheckSquare', label: 'To-Do', isSystem: true },
  { id: 'movies', type: CategoryType.Movies, icon: 'Film', label: 'Movies', isSystem: true },
  { id: 'tv', type: CategoryType.TVShows, icon: 'Tv', label: 'TV Shows', isSystem: true },
  { id: 'music', type: CategoryType.Music, icon: 'Music', label: 'Music Artists', isSystem: true },
  { id: 'podcasts', type: CategoryType.Podcasts, icon: 'Mic', label: 'Podcasts', isSystem: true },
  { id: 'books', type: CategoryType.Books, icon: 'Book', label: 'Books', isSystem: true },
  { id: 'boardgames', type: CategoryType.BoardGames, icon: 'Dices', label: 'Boardgames', isSystem: true },
  { id: 'wines', type: CategoryType.Wines, icon: 'Wine', label: 'Wines', isSystem: true },
  { id: 'games', type: CategoryType.Games, icon: 'Gamepad2', label: 'Games', isSystem: true },
  { id: 'beers', type: CategoryType.Beers, icon: 'Beer', label: 'Beers', isSystem: true },
  { id: 'links', type: CategoryType.Links, icon: 'LinkIcon', label: 'Links', isSystem: true },
];

export const INITIAL_ITEMS = [
  {
    id: '1',
    category: CategoryType.Movies,
    title: 'Top Gun: Maverick',
    subtitle: '2022',
    image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17dbH.jpg',
    addedAt: Date.now(),
    completed: true,
    rating: 9
  },
  {
    id: '2',
    category: CategoryType.Movies,
    title: 'Everything Everywhere All At Once',
    subtitle: '2022',
    image: 'https://image.tmdb.org/t/p/w500/rKtDFPbfHfUbArZ6OOOKsXcv0Bm.jpg',
    addedAt: Date.now() - 10000,
    completed: true,
    rating: 10
  },
  {
    id: '3',
    category: CategoryType.Movies,
    title: 'The Whale',
    subtitle: '2022',
    image: 'https://image.tmdb.org/t/p/w500/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg',
    addedAt: Date.now() - 20000,
    completed: false
  },
  {
    id: '4',
    category: CategoryType.Books,
    title: 'Project Hail Mary',
    subtitle: 'Andy Weir',
    image: 'https://books.google.com/books/content?id=zQAxEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    addedAt: Date.now(),
    completed: true
  },
  {
    id: '5',
    category: CategoryType.TVShows,
    title: 'The Last of Us',
    subtitle: '2023',
    image: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyve4z0w4T/uC6.jpg',
    addedAt: Date.now(),
    completed: false
  }
];