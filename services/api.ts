import { CategoryType } from '../types';
import { 
  TMDB_API_KEY, 
  THEGAMESDB_API_KEY, 
  PODCAST_INDEX_KEY, 
  PODCAST_INDEX_SECRET 
} from '../constants';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  metadata?: any;
}

// --- Helper Utilities ---

async function sha1(str: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
  return Array.from(new Uint8Array(hash))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');
}

// --- API Implementations ---

export const searchTMDB = async (query: string, type: 'movie' | 'tv'): Promise<SearchResult[]> => {
  if (!query) return [];
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.results || []).map((item: any) => ({
      id: item.id.toString(),
      title: type === 'movie' ? item.title : item.name,
      subtitle: (type === 'movie' ? item.release_date : item.first_air_date)?.split('-')[0] || 'Unknown',
      image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : undefined,
      metadata: item
    }));
  } catch (e) {
    console.error("TMDB Error", e);
    return [];
  }
};

export const searchGoogleBooks = async (query: string): Promise<SearchResult[]> => {
  if (!query) return [];
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.items || []).map((item: any) => {
      const info = item.volumeInfo || {};
      return {
        id: item.id,
        title: info.title || 'Unknown Title',
        subtitle: info.authors?.join(', ') || info.publishedDate?.split('-')[0] || '',
        image: info.imageLinks?.thumbnail?.replace('http:', 'https:') || undefined,
        metadata: info
      };
    });
  } catch (e) {
    console.error("Books Error", e);
    return [];
  }
};

export const searchTheGamesDB = async (query: string): Promise<SearchResult[]> => {
  if (!query) return [];
  try {
    // TheGamesDB often blocks direct browser requests via CORS. 
    // We use a CORS proxy to bypass this for the frontend application.
    const targetUrl = `https://api.thegamesdb.net/v1/Games/ByGameName?apikey=${THEGAMESDB_API_KEY}&name=${encodeURIComponent(query)}&fields=overview,publishers,genres&include=boxart`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(proxyUrl);
    
    if (!res.ok) throw new Error(`Status ${res.status}`);
    
    const json = await res.json();
    const games = json.data?.games || [];
    const boxarts = json.include?.boxart?.data || {};
    const baseUrl = json.include?.boxart?.base_url?.original || '';

    return games.map((game: any) => {
      // Find the first boxart for this game
      const gameBoxarts = boxarts[game.id];
      const boxart = gameBoxarts && gameBoxarts.length > 0 ? gameBoxarts[0] : null;
      const imageUrl = boxart ? `${baseUrl}${boxart.filename}` : undefined;

      return {
        id: game.id.toString(),
        title: game.game_title,
        subtitle: game.release_date ? game.release_date.split('-')[0] : 'Unknown',
        image: imageUrl,
        metadata: game
      };
    });
  } catch (e) {
    console.error("TheGamesDB Error", e);
    // Fallback if API fails (e.g. CORS or limit reached)
    return searchMock(query, CategoryType.Games); 
  }
};

export const searchPodcastIndex = async (query: string): Promise<SearchResult[]> => {
  if (!query) return [];
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const authString = PODCAST_INDEX_KEY + PODCAST_INDEX_SECRET + timestamp;
    const authHash = await sha1(authString);

    // Note: User-Agent cannot be set in browser fetch usually, but some proxies/browsers might allow it.
    // If this fails with CORS, a proxy similar to TheGamesDB would be needed, 
    // but PodcastIndex requires header forwarding which simple proxies might not support.
    const headers = {
      'X-Auth-Key': PODCAST_INDEX_KEY,
      'X-Auth-Date': timestamp,
      'Authorization': authHash
    };

    const res = await fetch(`https://api.podcastindex.org/api/1.0/search/byterm?q=${encodeURIComponent(query)}`, {
      headers
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    return (data.feeds || []).map((feed: any) => ({
      id: feed.id.toString(),
      title: feed.title,
      subtitle: feed.author || 'Unknown Author',
      image: feed.image,
      metadata: feed
    }));

  } catch (e) {
    console.error("PodcastIndex Error", e);
    return searchMock(query, CategoryType.Podcasts);
  }
};

export const searchMock = async (query: string, category: CategoryType): Promise<SearchResult[]> => {
  await new Promise(r => setTimeout(r, 600)); // Simulate latency
  
  // Minimal fallback for types without real APIs yet
  return [
    { id: `m-${Date.now()}`, title: `${query} (Mock)`, subtitle: 'Add manually', image: 'https://picsum.photos/200/300' }
  ];
};

export const searchContent = async (query: string, category: CategoryType): Promise<SearchResult[]> => {
  switch (category) {
    case CategoryType.Movies:
      return searchTMDB(query, 'movie');
    case CategoryType.TVShows:
      return searchTMDB(query, 'tv');
    case CategoryType.Books:
      return searchGoogleBooks(query);
    case CategoryType.Games:
      return searchTheGamesDB(query);
    case CategoryType.Podcasts:
      return searchPodcastIndex(query);
    default:
      return searchMock(query, category);
  }
};