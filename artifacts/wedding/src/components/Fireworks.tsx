import { useEffect, useRef } from 'react';

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles array
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }> = [];

    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#FF1493', '#FFB6C1', '#FFE4E1', '#FFDAB9'];

    function createFirework(x: number, y: number) {
      const particleCount = 50 + Math.random() * 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 4 + Math.random() * 6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 3,
        });
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life -= 0.01;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Start fireworks
    let startTime = Date.now();
    const duration = 5000; // 5 seconds
    let soundPlayed = false;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed > duration) {
        clearInterval(interval);
        return;
      }

      // Play sound once at the beginning
      if (!soundPlayed && audioRef.current) {
        audioRef.current.play().catch(() => {
          // Silent fail if audio can't play
        });
        soundPlayed = true;
      }

      // Create multiple fireworks
      const numFireworks = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numFireworks; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6); // Upper 60% of screen
        createFirework(x, y);
      }

      animate();
      requestAnimationFrame(animate);
    }, 100);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Fireworks sound effect - very quiet */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        volume={0.15}
        style={{ display: 'none' }}
      />
    </>
  );
}
