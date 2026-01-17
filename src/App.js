import { useState } from "react";

// ⚠️ IMPORTANT: Replace this with your n8n Production URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// Floating particle component
const Particle = ({ delay, duration, size, left, opacity }) => (
  <div
    className="absolute rounded-full bg-current blur-sm pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      opacity,
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      bottom: "-20px",
    }}
  />
);

// Music card component with staggered animation
const MusicCard = ({ song, index, isVisible, themeColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 
                  transform transition-all duration-500 ease-out cursor-pointer
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
      style={{
        transitionDelay: `${index * 100}ms`,
        animation: isVisible
          ? `subtle-float 4s ease-in-out infinite ${index * 0.3}s`
          : "none",
        boxShadow: isHovered ? `0 20px 40px ${themeColor}30` : "none",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Rank badge */}
      <div
        className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg text-white"
        style={{
          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}aa)`,
        }}
      >
        {song.rank}
      </div>

      {/* Album art placeholder with gradient */}
      <div
        className={`w-full aspect-square rounded-xl mb-3 overflow-hidden 
                       bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900
                       transition-transform duration-300`}
        style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-end gap-1 h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{
                    background: themeColor,
                    animation: `equalizer 0.5s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`,
                    height: "100%",
                  }}
                />
              ))}
            </div>
          ) : (
            <svg
              className="w-12 h-12 text-white/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </div>
      </div>

      {/* Song info */}
      <h3 className="font-semibold text-white truncate text-sm">
        {song.title}
      </h3>
      <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      <p className="text-xs text-gray-500 truncate">
        {song.album} • {song.year}
      </p>

      {/* Genre tag */}
      <div
        className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs"
        style={{ background: `${themeColor}30`, color: themeColor }}
      >
        {song.genre}
      </div>

      {/* Hover reveal: recommendation reason */}
      <div
        className="mt-2 text-xs transition-all duration-300 overflow-hidden"
        style={{
          color: `${themeColor}cc`,
          maxHeight: isHovered ? "80px" : "0",
          opacity: isHovered ? 1 : 0,
        }}
      >
        💡 {song.reason}
      </div>

      {/* Play indicator */}
      {isPlaying && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default function VibeWaveApp() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Generate particles
  const particles = [...Array(15)].map((_, i) => ({
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: `${8 + Math.random() * 20}px`,
    left: Math.random() * 100,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  // Call n8n webhook
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setShowResults(false);
    setError(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
        setShowResults(true);
      } else if (data.data) {
        // Handle case where response is directly the data
        setResults(data.data);
        setShowResults(true);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to connect to the API. Make sure n8n is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get theme color from results or default
  const themeColor = results?.theme?.color || "#74B9FF";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 
                    text-white overflow-hidden relative"
    >
      {/* Custom CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-100vh) rotate(180deg); }
        }
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${themeColor}50; }
          50% { box-shadow: 0 0 40px ${themeColor}80; }
        }
        @keyframes equalizer {
          0% { height: 20%; }
          100% { height: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Floating particles background */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ color: themeColor }}
      >
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      {/* Gradient orbs */}
      <div
        className="fixed top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl transition-colors duration-1000"
        style={{ background: `${themeColor}20` }}
      />
      <div
        className="fixed bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl transition-colors duration-1000"
        style={{ background: `${themeColor}15` }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-bold mb-3 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${themeColor}, #a855f7, #ec4899)`,
            }}
          >
            VibeWave 🎵
          </h1>
          <p className="text-gray-400 text-lg">
            AI-powered music discovery that feels like magic
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe a vibe, song, genre, or artist..."
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 
                         rounded-full text-white placeholder-gray-500 outline-none
                         focus:border-opacity-50 focus:ring-2 transition-all duration-300"
              style={{
                borderColor: `${themeColor}30`,
                animation: !isLoading
                  ? "pulse-glow 3s ease-in-out infinite"
                  : "none",
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 
                         rounded-full font-semibold hover:opacity-90 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed text-white"
              style={{
                background: `linear-gradient(90deg, ${themeColor}, #a855f7)`,
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    style={{ animation: "spin 1s linear infinite" }}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Vibing...
                </span>
              ) : (
                "Discover"
              )}
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {[
              "chill lo-fi",
              "songs like Dynamite by BTS",
              "upbeat jazz",
              "melancholic indie",
              "90s rock classics",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full
                           hover:bg-white/10 transition-colors text-gray-400 hover:text-white
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="flex justify-center items-end gap-1 h-16 mb-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 rounded-full"
                  style={{
                    background: `linear-gradient(to top, ${themeColor}, #a855f7)`,
                    animation: `equalizer 0.4s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`,
                    height: "100%",
                  }}
                />
              ))}
            </div>
            <p className="text-gray-400">Finding your perfect vibe...</p>
          </div>
        )}

        {/* Results */}
        {showResults && results && (
          <div>
            {/* Query echo & vibe summary */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500">
                Showing recommendations for:
              </p>
              <p
                className="text-xl font-semibold"
                style={{ color: themeColor }}
              >
                "{results.query}"
              </p>
              {results.vibe_summary && (
                <p className="text-gray-400 mt-2 max-w-xl mx-auto">
                  {results.vibe_summary}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ background: `${themeColor}20`, color: themeColor }}
                >
                  {results.intent}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ background: `${themeColor}20`, color: themeColor }}
                >
                  {results.theme?.mood}
                </span>
              </div>
            </div>

            {/* Music grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.recommendations?.map((song, index) => (
                <MusicCard
                  key={song.rank}
                  song={song}
                  index={index}
                  isVisible={showResults}
                  themeColor={themeColor}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setShowResults(false);
                  setTimeout(() => setShowResults(true), 100);
                }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full
                           hover:bg-white/10 transition-all text-sm"
              >
                🔄 Replay Animation
              </button>
              <button
                onClick={() => {
                  setQuery("");
                  setResults(null);
                  setShowResults(false);
                }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full
                           hover:bg-white/10 transition-all text-sm"
              >
                🔍 New Search
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !showResults && !error && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-6xl mb-4">🎧</p>
            <p>Enter a vibe above to discover your next favorite songs</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-600">
        VibeWave • Built with n8n + AI • Making every day more vivid
        让每一天都更生动
      </div>
    </div>
  );
}
