// Hi-anime API Service with comprehensive error handling and caching
// Base API configuration
const HI_ANIME_BASE_URL = 'https://api.hianime.to/anime';
const API_VERSION = 'v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache utility functions
const CacheManager = {
  get: (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Cache read error:', error);
      localStorage.removeItem(key);
      return null;
    }
  },
  
  set: (key, data) => {
    try {
      const cached = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cached));
    } catch (error) {
      console.warn('Cache write error:', error);
      // Clear old cache entries if storage is full
      try {
        const keys = Object.keys(localStorage);
        const hiAnimeKeys = keys.filter(k => k.startsWith('hianime_'));
        hiAnimeKeys.forEach(k => localStorage.removeItem(k));
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (e) {
        console.warn('Failed to clear cache and retry:', e);
      }
    }
  },
  
  clear: () => {
    try {
      const keys = Object.keys(localStorage);
      const hiAnimeKeys = keys.filter(k => k.startsWith('hianime_'));
      hiAnimeKeys.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
};

// Error types for better error handling
class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

class NetworkError extends Error {
  constructor(message, endpoint) {
    super(message);
    this.name = 'NetworkError';
    this.endpoint = endpoint;
  }
}

class CacheError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CacheError';
  }
}

// HTTP client with retry logic
const httpClient = async (endpoint, options = {}) => {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(endpoint, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          endpoint
        );
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.warn(`Attempt ${attempt} failed for ${endpoint}:`, error);
      
      if (attempt === maxRetries) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout', endpoint);
        } else if (error instanceof ApiError) {
          throw error;
        } else {
          throw new NetworkError(`Network error: ${error.message}`, endpoint);
        }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
};

// Data transformation utilities
const transformAnimeData = (anime) => {
  if (!anime) return null;
  
  return {
    id: anime.id || '',
    title: anime.name || anime.title || 'Unknown Title',
    poster: anime.poster || anime.image || '/placeholder-anime.jpg',
    rating: anime.rating?.mal || anime.score || 0,
    totalEpisodes: anime.episodes?.total || anime.totalEpisodes || 0,
    type: anime.type || 'Unknown',
    status: anime.status || 'Unknown',
    genres: anime.genres || [],
    description: anime.description || anime.synopsis || 'No description available',
    year: anime.releaseDate?.year || anime.year || null,
    duration: anime.duration || null,
    studios: anime.studios || [],
    subOrDub: anime.subOrDub || 'sub'
  };
};

const transformSpotlightData = (data) => {
  if (!data || !Array.isArray(data.spotlightAnimes)) return [];
  
  return data.spotlightAnimes.map(anime => ({
    ...transformAnimeData(anime),
    rank: anime.rank || 0,
    otherInfo: anime.otherInfo || []
  }));
};

const transformTrendingData = (data) => {
  if (!data || !Array.isArray(data.trendingAnimes)) return [];
  
  return data.trendingAnimes.map(transformAnimeData).filter(Boolean);
};

const transformTopAiringData = (data) => {
  if (!data || !Array.isArray(data.top10Animes?.today)) return [];
  
  return data.top10Animes.today.map(anime => ({
    ...transformAnimeData(anime),
    rank: anime.rank || 0
  }));
};

// Main API functions
const HiAnimeApi = {
  // Get home page data
  getHomeData: async () => {
    const cacheKey = 'hianime_home_data';
    
    try {
      // Try cache first
      const cached = CacheManager.get(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          fromCache: true
        };
      }
      
      // Fetch from API
      const endpoint = `${HI_ANIME_BASE_URL}/home`;
      const response = await httpClient(endpoint);
      
      if (!response.success) {
        throw new ApiError('API returned unsuccessful response', null, endpoint);
      }
      
      const transformedData = {
        spotlight: transformSpotlightData(response.data),
        trending: transformTrendingData(response.data),
        topAiring: transformTopAiringData(response.data),
        lastUpdated: new Date().toISOString()
      };
      
      // Cache the response
      CacheManager.set(cacheKey, transformedData);
      
      return {
        success: true,
        data: transformedData,
        fromCache: false
      };
      
    } catch (error) {
      console.error('Failed to fetch home data:', error);
      
      // Try to return stale cache as fallback
      try {
        const staleCache = localStorage.getItem(cacheKey);
        if (staleCache) {
          const { data } = JSON.parse(staleCache);
          return {
            success: false,
            data,
            error: error.message,
            fromCache: true,
            isStale: true
          };
        }
      } catch (cacheError) {
        console.warn('Failed to read stale cache:', cacheError);
      }
      
      return {
        success: false,
        error: error.message,
        type: error.name,
        data: {
          spotlight: [],
          trending: [],
          topAiring: [],
          lastUpdated: null
        }
      };
    }
  },
  
  // Get anime details
  getAnimeDetails: async (animeId) => {
    const cacheKey = `hianime_anime_${animeId}`;
    
    try {
      // Try cache first
      const cached = CacheManager.get(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          fromCache: true
        };
      }
      
      // Fetch from API
      const endpoint = `${HI_ANIME_BASE_URL}/info?id=${encodeURIComponent(animeId)}`;
      const response = await httpClient(endpoint);
      
      if (!response.success) {
        throw new ApiError('Failed to fetch anime details', null, endpoint);
      }
      
      const transformedData = transformAnimeData(response.data.anime);
      
      // Cache the response
      CacheManager.set(cacheKey, transformedData);
      
      return {
        success: true,
        data: transformedData,
        fromCache: false
      };
      
    } catch (error) {
      console.error(`Failed to fetch anime details for ${animeId}:`, error);
      
      return {
        success: false,
        error: error.message,
        type: error.name,
        data: null
      };
    }
  },
  
  // Search anime
  searchAnime: async (query, page = 1) => {
    const cacheKey = `hianime_search_${query}_${page}`;
    
    try {
      // Try cache first
      const cached = CacheManager.get(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          fromCache: true
        };
      }
      
      // Fetch from API
      const endpoint = `${HI_ANIME_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`;
      const response = await httpClient(endpoint);
      
      if (!response.success) {
        throw new ApiError('Search request failed', null, endpoint);
      }
      
      const transformedData = {
        results: response.data.animes?.map(transformAnimeData).filter(Boolean) || [],
        currentPage: response.data.currentPage || page,
        totalPages: response.data.totalPages || 1,
        hasNextPage: response.data.hasNextPage || false,
        totalResults: response.data.totalResults || 0
      };
      
      // Cache the response
      CacheManager.set(cacheKey, transformedData);
      
      return {
        success: true,
        data: transformedData,
        fromCache: false
      };
      
    } catch (error) {
      console.error(`Failed to search for "${query}":`, error);
      
      return {
        success: false,
        error: error.message,
        type: error.name,
        data: {
          results: [],
          currentPage: page,
          totalPages: 0,
          hasNextPage: false,
          totalResults: 0
        }
      };
    }
  },
  
  // Utility methods
  clearCache: () => {
    try {
      CacheManager.clear();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Health check
  healthCheck: async () => {
    try {
      const endpoint = `${HI_ANIME_BASE_URL}/home`;
      const response = await httpClient(endpoint);
      return {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default HiAnimeApi;
export { ApiError, NetworkError, CacheError };
