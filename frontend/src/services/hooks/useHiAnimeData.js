// Custom hooks for Hi-anime API data management with loading states and error handling
import { useState, useEffect, useCallback, useRef } from 'react';
import HiAnimeApi from '../hiAnimeApi';

// Loading states enum
const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  STALE: 'stale' // Data is stale but still usable
};

// Main hook for home data (Spotlight, Trending, Top Airing)
export const useHiAnimeHomeData = () => {
  const [state, setState] = useState({
    data: {
      spotlight: [],
      trending: [],
      topAiring: []
    },
    loading: LoadingState.IDLE,
    error: null,
    lastUpdated: null,
    fromCache: false,
    isStale: false
  });
  
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchHomeData = useCallback(async (forceRefresh = false) => {
    // Clear any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // Don't fetch if already loading (unless force refresh)
    if (state.loading === LoadingState.LOADING && !forceRefresh) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      loading: LoadingState.LOADING,
      error: null
    }));

    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        HiAnimeApi.clearCache();
      }
      
      const response = await HiAnimeApi.getHomeData();
      
      // Check if component is still mounted
      if (!mountedRef.current) return;
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: LoadingState.SUCCESS,
          error: null,
          lastUpdated: response.data.lastUpdated,
          fromCache: response.fromCache,
          isStale: response.isStale || false
        }));
      } else {
        // Handle partial success (stale data available)
        if (response.data && response.isStale) {
          setState(prev => ({
            ...prev,
            data: response.data,
            loading: LoadingState.STALE,
            error: response.error,
            lastUpdated: response.data.lastUpdated,
            fromCache: true,
            isStale: true
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: LoadingState.ERROR,
            error: response.error || 'Failed to load anime data'
          }));
        }
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        loading: LoadingState.ERROR,
        error: error.message || 'Network error occurred'
      }));
    }
  }, [state.loading]);

  // Initial data fetch
  useEffect(() => {
    fetchHomeData();
    
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const retry = useCallback(() => {
    fetchHomeData(true);
  }, [fetchHomeData]);

  const refresh = useCallback(() => {
    fetchHomeData(true);
  }, [fetchHomeData]);

  return {
    // Data
    spotlight: state.data.spotlight,
    trending: state.data.trending,
    topAiring: state.data.topAiring,
    
    // Loading states
    loading: state.loading === LoadingState.LOADING,
    success: state.loading === LoadingState.SUCCESS,
    error: state.loading === LoadingState.ERROR,
    stale: state.loading === LoadingState.STALE,
    idle: state.loading === LoadingState.IDLE,
    
    // Additional info
    errorMessage: state.error,
    lastUpdated: state.lastUpdated,
    fromCache: state.fromCache,
    isStale: state.isStale,
    
    // Actions
    retry,
    refresh
  };
};

// Hook for anime details
export const useAnimeDetails = (animeId) => {
  const [state, setState] = useState({
    data: null,
    loading: LoadingState.IDLE,
    error: null,
    fromCache: false
  });
  
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchAnimeDetails = useCallback(async () => {
    if (!animeId) return;
    
    // Clear any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({
      ...prev,
      loading: LoadingState.LOADING,
      error: null
    }));

    try {
      const response = await HiAnimeApi.getAnimeDetails(animeId);
      
      if (!mountedRef.current) return;
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: LoadingState.SUCCESS,
          error: null,
          fromCache: response.fromCache
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: LoadingState.ERROR,
          error: response.error || 'Failed to load anime details'
        }));
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        loading: LoadingState.ERROR,
        error: error.message || 'Network error occurred'
      }));
    }
  }, [animeId]);

  // Fetch data when animeId changes
  useEffect(() => {
    if (animeId) {
      fetchAnimeDetails();
    } else {
      setState({
        data: null,
        loading: LoadingState.IDLE,
        error: null,
        fromCache: false
      });
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [animeId, fetchAnimeDetails]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const retry = useCallback(() => {
    fetchAnimeDetails();
  }, [fetchAnimeDetails]);

  return {
    data: state.data,
    loading: state.loading === LoadingState.LOADING,
    success: state.loading === LoadingState.SUCCESS,
    error: state.loading === LoadingState.ERROR,
    errorMessage: state.error,
    fromCache: state.fromCache,
    retry
  };
};

// Hook for anime search
export const useAnimeSearch = () => {
  const [state, setState] = useState({
    data: {
      results: [],
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      totalResults: 0
    },
    loading: LoadingState.IDLE,
    error: null,
    query: '',
    fromCache: false
  });
  
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const search = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        data: {
          results: [],
          currentPage: 1,
          totalPages: 1,
          hasNextPage: false,
          totalResults: 0
        },
        loading: LoadingState.IDLE,
        error: null,
        query: ''
      }));
      return;
    }
    
    // Clear any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({
      ...prev,
      loading: LoadingState.LOADING,
      error: null,
      query: query.trim()
    }));

    try {
      const response = await HiAnimeApi.searchAnime(query.trim(), page);
      
      if (!mountedRef.current) return;
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: LoadingState.SUCCESS,
          error: null,
          fromCache: response.fromCache
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: LoadingState.ERROR,
          error: response.error || 'Search failed'
        }));
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        loading: LoadingState.ERROR,
        error: error.message || 'Search error occurred'
      }));
    }
  }, []);

  const clear = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      data: {
        results: [],
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        totalResults: 0
      },
      loading: LoadingState.IDLE,
      error: null,
      query: '',
      fromCache: false
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const retry = useCallback(() => {
    if (state.query) {
      search(state.query, state.data.currentPage);
    }
  }, [search, state.query, state.data.currentPage]);

  const loadNextPage = useCallback(() => {
    if (state.query && state.data.hasNextPage && state.loading !== LoadingState.LOADING) {
      search(state.query, state.data.currentPage + 1);
    }
  }, [search, state.query, state.data.hasNextPage, state.data.currentPage, state.loading]);

  return {
    // Data
    results: state.data.results,
    currentPage: state.data.currentPage,
    totalPages: state.data.totalPages,
    hasNextPage: state.data.hasNextPage,
    totalResults: state.data.totalResults,
    query: state.query,
    
    // Loading states
    loading: state.loading === LoadingState.LOADING,
    success: state.loading === LoadingState.SUCCESS,
    error: state.loading === LoadingState.ERROR,
    idle: state.loading === LoadingState.IDLE,
    
    // Additional info
    errorMessage: state.error,
    fromCache: state.fromCache,
    
    // Actions
    search,
    clear,
    retry,
    loadNextPage
  };
};

// Utility hook for API health monitoring
export const useApiHealth = () => {
  const [state, setState] = useState({
    status: 'unknown',
    loading: false,
    lastCheck: null,
    error: null
  });
  
  const mountedRef = useRef(true);

  const checkHealth = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const response = await HiAnimeApi.healthCheck();
      
      if (!mountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        status: response.status,
        loading: false,
        lastCheck: response.timestamp,
        error: response.success ? null : response.error
      }));
    } catch (error) {
      if (!mountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        status: 'unhealthy',
        loading: false,
        lastCheck: new Date().toISOString(),
        error: error.message
      }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    status: state.status,
    loading: state.loading,
    lastCheck: state.lastCheck,
    error: state.error,
    isHealthy: state.status === 'healthy',
    isUnknown: state.status === 'unknown',
    checkHealth
  };
};

// Export loading state enum for external use
export { LoadingState };
