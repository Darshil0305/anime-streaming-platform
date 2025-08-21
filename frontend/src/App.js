import React, { useState, useEffect } from 'react';
import './index.css';

// Theme Toggle Component
function ThemeToggle({ isDark, setIsDark }) {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="glass-button px-3 py-2 text-sm font-medium"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <span className="flex items-center space-x-1">
          <span>☀️</span>
          <span>Light</span>
        </span>
      ) : (
        <span className="flex items-center space-x-1">
          <span>🌙</span>
          <span>Dark</span>
        </span>
      )}
    </button>
  );
}

// Header Component
function Header({ isDark, setIsDark }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              AnimeStream
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Browse
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                My List
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <button className="glass-button px-4 py-2 text-sm font-medium">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Hero Banner Component
function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-dark-bg/50"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent animate-fade-in">
            Welcome to AnimeStream
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 animate-slide-up">
            Discover and stream your favorite anime series with stunning visuals and seamless experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button className="glass-button px-8 py-3 text-lg font-semibold bg-primary-600/20 hover:bg-primary-600/30 border-primary-400">
              🎬 Start Watching
            </button>
            <button className="glass-button px-8 py-3 text-lg font-semibold">
              📚 Browse Library
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Content Section Component
function ContentSection({ title, children }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {title}
        </h3>
        {children}
      </div>
    </section>
  );
}

// Placeholder Card Component
function PlaceholderCard({ title, description, emoji }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div className="text-4xl mb-4 text-center">{emoji}</div>
      <h4 className="text-lg font-semibold mb-2 text-center">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center">{description}</p>
    </div>
  );
}

// Spotlight Section
function SpotlightSection() {
  const spotlightItems = [
    { title: "Featured Anime", description: "Currently trending series", emoji: "⭐" },
    { title: "New Releases", description: "Latest episodes available", emoji: "🆕" },
    { title: "Staff Picks", description: "Curated by our team", emoji: "👥" },
    { title: "Award Winners", description: "Critically acclaimed series", emoji: "🏆" }
  ];

  return (
    <ContentSection title="🌟 In the Spotlight">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {spotlightItems.map((item, index) => (
          <PlaceholderCard key={index} {...item} />
        ))}
      </div>
    </ContentSection>
  );
}

// Trending Section
function TrendingSection() {
  const trendingItems = [
    { title: "Action Series", description: "High-octane adventures", emoji: "⚔️" },
    { title: "Romance Anime", description: "Heartwarming stories", emoji: "💕" },
    { title: "Sci-Fi Collection", description: "Futuristic narratives", emoji: "🚀" },
    { title: "Fantasy Worlds", description: "Magical adventures", emoji: "🧙‍♂️" },
    { title: "Slice of Life", description: "Everyday moments", emoji: "🌸" },
    { title: "Thriller Series", description: "Edge-of-your-seat content", emoji: "🎭" }
  ];

  return (
    <ContentSection title="🔥 Trending Now">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingItems.map((item, index) => (
          <PlaceholderCard key={index} {...item} />
        ))}
      </div>
    </ContentSection>
  );
}

// Top Section
function TopSection() {
  const topItems = [
    { title: "Top Rated", description: "Highest community scores", emoji: "🌟" },
    { title: "Most Watched", description: "Popular among viewers", emoji: "👁️" },
    { title: "Critics' Choice", description: "Professional recommendations", emoji: "📰" }
  ];

  return (
    <ContentSection title="🏅 Top Picks">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topItems.map((item, index) => (
          <PlaceholderCard key={index} {...item} />
        ))}
      </div>
    </ContentSection>
  );
}

// Main Layout Component
function MainLayout({ children }) {
  return (
    <main className="pt-16 min-h-screen">
      {children}
    </main>
  );
}

// Main App Component
function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    // Update document class and save preference
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header isDark={isDark} setIsDark={setIsDark} />
      <MainLayout>
        <HeroBanner />
        <div className="space-y-12">
          <SpotlightSection />
          <TrendingSection />
          <TopSection />
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-card p-8">
              <h4 className="text-lg font-semibold mb-4">AnimeStream Platform</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Built with React, Tailwind CSS, and modern glassmorphism design
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>© 2025 AnimeStream</span>
                <span>•</span>
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </MainLayout>
    </div>
  );
}

export default App;
