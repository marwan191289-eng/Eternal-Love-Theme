import { useEffect, useRef, useState, useCallback } from "react";
import musicFile from "@assets/background-music_1779687276994.mp3";

interface BackgroundMusicProps {
  onRef?: (ref: BackgroundMusicRef) => void;
}

export interface BackgroundMusicRef {
  pauseForVideo: () => void;
  resumeAfterVideo: () => void;
}

export function BackgroundMusic({ onRef }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showSlider, setShowSlider] = useState(false);
  const [started, setStarted] = useState(false);
  const pausedByVideoRef = useRef(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || started) return;
    try {
      audio.volume = volume;
      audio.muted = false; // Ensure not muted for autoplay
      await audio.play();
      setIsPlaying(true);
      setStarted(true);
    } catch {
      // Autoplay blocked — wait for user interaction
    }
  }, [started, volume]);

  useEffect(() => {
    // Auto-play on mount with slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      tryPlay();
    }, 500);

    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };

    // Fallback on first interaction
    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("scroll", handleInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };
  }, [tryPlay]);

  // Expose pause/resume for videos
  useEffect(() => {
    if (!onRef) return;
    onRef({
      pauseForVideo: () => {
        const audio = audioRef.current;
        if (!audio || audio.paused) return;
        pausedByVideoRef.current = true;
        audio.pause();
        setIsPlaying(false);
      },
      resumeAfterVideo: () => {
        const audio = audioRef.current;
        if (!audio || !pausedByVideoRef.current) return;
        pausedByVideoRef.current = false;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      },
    });
  }, [onRef]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) {
      tryPlay();
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      if (v === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
        if (!isPlaying) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }
  };

  const WaveIcon = () => (
    <span className="flex items-end gap-0.5 h-4 w-5">
      {[0.6, 1, 0.75, 1, 0.6].map((h, i) => (
        <span
          key={i}
          className="wave-bar"
          style={{
            height: `${h * 14}px`,
            animationDuration: `${0.5 + i * 0.15}s`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </span>
  );

  const MuteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={musicFile}
        loop
        preload="auto"
        autoPlay
        style={{ display: "none" }}
      />

      <div
        className="fixed bottom-6 right-6 z-40 flex flex-col items-start gap-2"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {/* Volume slider */}
        {showSlider && (
          <div
            className="glass rounded-2xl border border-gold/30 px-4 py-3 shadow-elegant flex flex-col items-center gap-2"
            style={{ animation: "fadeInUp 0.2s ease-out" }}
          >
            <span className="font-display text-[10px] tracking-widest text-gold/70 uppercase">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-24 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: "oklch(0.82 0.13 75)",
                background: `linear-gradient(to right, oklch(0.82 0.13 75) ${volume * 100}%, oklch(0.82 0.13 75 / 25%) ${volume * 100}%)`,
              }}
            />
            <span className="font-display text-[10px] text-gold/50">{Math.round(volume * 100)}%</span>
          </div>
        )}

        {/* Main button */}
        <button
          type="button"
          onClick={toggleMute}
        title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        aria-label={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        autoFocus={true}
          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "bg-gold/20 border-gold/60 text-gold hover:bg-gold/30 pulse-glow"
              : "bg-card/60 border-gold/30 text-muted-foreground hover:border-gold/50 hover:text-gold"
          } backdrop-blur hover:shadow-glow`}
        >
          {isPlaying ? <WaveIcon /> : <MuteIcon />}
        </button>
      </div>
    </>
  );
}
