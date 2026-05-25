import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MemorySidebarProps {
  images: Array<{ id: string; src: string; caption: string }>;
  position?: 'left' | 'right';
}

export function MemorySidebar({ images, position = 'right' }: MemorySidebarProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll || images.length === 0) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const maxScroll = images.length * 220; // 220px per image (larger)
        return (prev + 1) % maxScroll;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [autoScroll, images.length]);

  const handleScroll = (direction: 'up' | 'down') => {
    setAutoScroll(false);
    setScrollPosition((prev) => {
      const newPos = direction === 'down' ? prev + 80 : prev - 80;
      const maxScroll = images.length * 220;
      return ((newPos % maxScroll) + maxScroll) % maxScroll;
    });
  };

  return (
    <div
      className={`fixed top-32 ${position === 'right' ? 'right-0' : 'left-0'} h-[calc(100vh-200px)] w-32 bg-gradient-to-b from-gold/30 via-card/50 to-gold/30 backdrop-blur-md border-l border-gold/40 flex flex-col items-center justify-between py-4 z-40 hover:w-48 transition-all duration-300 group shadow-lg`}
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
    >
      <button
        onClick={() => handleScroll('up')}
        className="p-2 text-gold hover:text-gold/80 transition-all opacity-60 group-hover:opacity-100 hover:bg-gold/10 rounded-lg"
      >
        <ChevronUp size={24} />
      </button>

      <div className="flex-1 overflow-hidden relative w-full px-2">
        <div
          className="flex flex-col gap-3 transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {[...images, ...images].map((img, idx) => (
            <div
              key={`${img.id}-${idx}`}
              className="flex-shrink-0 w-28 h-36 rounded-xl overflow-hidden border-2 border-gold/40 hover:border-gold/80 transition-all cursor-pointer group/img hover:shadow-2xl hover:shadow-gold/40 transform hover:scale-105"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <p className="text-xs text-gold text-center px-2 line-clamp-2 font-body-ar">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => handleScroll('down')}
        className="p-2 text-gold hover:text-gold/80 transition-all opacity-60 group-hover:opacity-100 hover:bg-gold/10 rounded-lg"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
}
