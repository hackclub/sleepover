'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SpotifyPlayer() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't show on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <div
      className="fixed z-50 transition-all duration-300 ease-in-out"
      style={{
        bottom: '20px',
        right: '20px',
        width: isExpanded ? '400px' : '48px',
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {/* Spotify Embed - Always rendered, hidden when collapsed */}
      <div
        className="relative bg-white rounded-xl shadow-2xl overflow-hidden"
        style={{
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
          position: isExpanded ? 'relative' : 'absolute',
          visibility: isExpanded ? 'visible' : 'hidden',
        }}
      >
        {/* Close/Minimize Button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          aria-label="Minimize player"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Spotify Embed */}
        <iframe
          data-testid="embed-iframe"
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/5HMx9trItBDgFAh3Xb2DtR?utm_source=generator&autoplay=1"
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {/* Expand Button - Shown when collapsed */}
      <button
        onClick={() => setIsExpanded(true)}
        className="w-12 h-12 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open Spotify player"
        style={{
          opacity: isExpanded ? 0 : 1,
          pointerEvents: isExpanded ? 'none' : 'auto',
          position: isExpanded ? 'absolute' : 'relative',
          background: 'linear-gradient(to bottom, #fee1e5, #eeb6bd)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  );
}
