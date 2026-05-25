import { useEffect, useState } from "react";

const SYMBOLS = ["✦", "❦", "✿", "❀", "✾", "⁕", "❁"];

interface Petal {
  id: number;
  left: string;
  symbol: string;
  duration: string;
  delay: string;
  size: string;
  opacity: number;
}

export function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const initial: Petal[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${(i * 7.1) % 100}%`,
      symbol: SYMBOLS[i % SYMBOLS.length],
      duration: `${12 + (i * 3.7) % 10}s`,
      delay: `${(i * 2.3) % 12}s`,
      size: `${0.65 + (i * 0.13) % 0.6}rem`,
      opacity: 0.25 + (i * 0.07) % 0.35,
    }));
    setPetals(initial);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            fontSize: petal.size,
            color: `oklch(0.82 0.13 75 / ${petal.opacity})`,
          }}
        >
          {petal.symbol}
        </span>
      ))}
    </div>
  );
}
