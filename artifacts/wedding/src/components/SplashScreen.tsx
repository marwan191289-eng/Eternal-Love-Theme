import { useEffect, useState } from "react";

export function SplashScreen() {
  const [hidden, setHidden] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2800);
    const t2 = setTimeout(() => setHidden(true), 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "oklch(0.17 0.048 22)",
        backgroundImage:
          "radial-gradient(ellipse at center, color-mix(in oklab, oklch(0.82 0.13 75) 15%, transparent) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, color-mix(in oklab, oklch(0.78 0.09 35) 10%, transparent), transparent 60%)",
      }}
      aria-hidden={leaving}
    >
      {/* Animated stars */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDuration: Math.random() * 2 + 2 + "s",
            animationDelay: Math.random() * 2 + "s",
          }}
        />
      ))}

      <div className="flex flex-col items-center text-center px-8">
        <div className="flex items-center gap-6 md:gap-12">
          <h1 className="font-display-ar text-5xl md:text-8xl font-bold text-gradient-gold splash-name splash-name-1">
            أميرة
          </h1>
          <span
            className="font-display text-3xl md:text-5xl italic splash-amp"
            style={{ color: "oklch(0.78 0.09 35)" }}
          >
            &amp;
          </span>
          <h1 className="font-display-ar text-5xl md:text-8xl font-bold text-gradient-gold splash-name splash-name-2">
            علاء
          </h1>
        </div>

        <div className="mt-10 h-px w-64 overflow-hidden bg-gold/20 rounded-full">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[oklch(0.82_0.13_75)] to-transparent splash-bar" />
        </div>

        <p className="mt-6 font-display tracking-[0.55em] text-xs text-gold/70 uppercase splash-tag">
          A Wedding Tribute · ٢٠٢٦
        </p>

        <p className="mt-4 font-display-ar text-xl text-gold/50 splash-hearts">
          ❦ حكاية حب تبدأ ❦
        </p>
      </div>
    </div>
  );
}
