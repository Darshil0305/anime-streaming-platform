import React, { useEffect, useState } from "react";

// Dummy UI - replace with your real imported components if you have them!
const Header = ({ toggleTheme, isDark }) => (
  <header className="backdrop-blur-xl bg-white/[0.15] dark:bg-black/30 shadow-xl rounded-2xl px-6 py-3 mb-4 flex justify-between items-center">
    <span className="font-bold text-2xl text-pink-500">HiAnime Platform</span>
    <button
      className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 px-4 py-1 rounded-lg text-white ml-4 shadow-md font-medium"
      onClick={toggleTheme}
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  </header>
);

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>
    {children}
  </section>
);

// Simple glassy card
const AnimeCard = ({ anime }) => (
  <div className="bg-white/20 dark:bg-black/40 rounded-xl shadow-lg overflow-hidden backdrop-blur p-4 max-w-xs">
    <img src={anime.poster} alt={anime.title} className="rounded w-full h-44 object-cover mb-2" />
    <div className="font-semibold text-lg">{anime.title}</div>
    <div className="text-xs opacity-70">{anime.synopsis?.slice(0, 64)}...</div>
  </div>
);

// Fancy horizontal scroller
const AnimeScroller = ({ animes = [] }) => (
  <div className="flex space-x-4 overflow-x-auto p-2">{animes.map(a => <AnimeCard key={a.id} anime={a} />)}</div>
);

const Loader = () => (
  <div className="flex justify-center items-center my-8">
    <span className="animate-spin h-12 w-12 border-4 border-pink-300 rounded-full border-t-transparent" />
  </div>
);

const ErrorBox = ({ message }) => (
  <div className="bg-red-300 text-black dark:bg-red-500/70 dark:text-white p-4 rounded-xl shadow-xl m-6 text-center">
    {message}
  </div>
);

const API_BASE = "https://hianime-api-qdks.onrender.com/api/v1";

// localStorage key for cache
const CACHE_KEY = "hianime_home_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 mins

function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState(null);
  const [error, setError] = useState(null);

  // For theming
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Fetch with localStorage cache
  useEffect(() => {
    async function fetchHome() {
      setLoading(true); setError(null);

      // Try to load cached data
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < CACHE_TTL) {
          setAnimeData(data); setLoading(false);
          // Meanwhile, background update
          fetchApi(true);
          return;
        }
      }
      await fetchApi();
    }

    async function fetchApi(silent = false) {
      try {
        const res = await fetch(`${API_BASE}/home`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const result = await res.json();
        if (result.error) throw new Error(result.error);

        setAnimeData(result?.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result.data, time: Date.now() }));
      } catch (e) {
        if (!silent) setError(e.message || "Unknown error");
      } finally {
        if (!silent) setLoading(false);
      }
    }

    fetchHome();
  }, []);

  // Sections config based on API spec
  const spotlight = animeData?.spotlight || [];
  const trending = animeData?.trending || [];
  const topAiring = animeData?.topAiring || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-400/20 to-yellow-100 dark:from-black dark:to-zinc-900 transition-colors duration-500">
      <div className="container mx-auto max-w-6xl px-2">
        <Header toggleTheme={() => setDark(v => !v)} isDark={dark} />
        {loading && <Loader />}
        {error && <ErrorBox message={error} />}
        {!loading && !error && (
          <>
            <Section title="Spotlight">
              <AnimeScroller animes={spotlight} />
            </Section>
            <Section title="Trending Now">
              <AnimeScroller animes={trending} />
            </Section>
            <Section title="Top Airing">
              <AnimeScroller animes={topAiring} />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
