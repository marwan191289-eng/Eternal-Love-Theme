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
        const maxScroll = images.length * 180; // 180px per image
        return (prev + 1) % maxScroll;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [autoScroll, images.length]);

  const handleScroll = (direction: 'up' | 'down') => {
    setAutoScroll(false);
    setScrollPosition((prev) => {
      const newPos = direction === 'down' ? prev + 60 : prev - 60;
      const maxScroll = images.length * 180;
      return ((newPos % maxScroll) + maxScroll) % maxScroll;
    });
  };

  return (
    <div
      className={`fixed top-32 ${position === 'right' ? 'right-0' : 'left-0'} h-[calc(100vh-200px)] w-24 bg-gradient-to-b from-gold/20 via-card/40 to-gold/20 backdrop-blur border-l border-gold/20 flex flex-col items-center justify-between py-4 z-40 hover:w-32 transition-all duration-300 group`}
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
    >
      <button
        onClick={() => handleScroll('up')}
        className="p-2 text-gold hover:text-gold/80 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronUp size={20} />
      </button>

      <div className="flex-1 overflow-hidden relative w-full">
        <div
          className="flex flex-col gap-2 px-2 transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {[...images, ...images].map((img, idx) => (
            <div
              key={`${img.id}-${idx}`}
              className="flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border border-gold/30 hover:border-gold/60 transition-all cursor-pointer group/img hover:shadow-glow"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-xs text-gold text-center px-1 line-clamp-2">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => handleScroll('down')}
        className="p-2 text-gold hover:text-gold/80 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
}
