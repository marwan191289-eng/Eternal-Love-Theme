import { useEffect, useRef } from 'react';

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }

    const particles: Particle[] = [];

    // Professional color schemes
    const colorSchemes = [
      ['#FFD700', '#FFA500', '#FF8C00'],
      ['#FF1493', '#FF69B4', '#FFB6C1'],
      ['#00CED1', '#00BFFF', '#87CEEB'],
      ['#32CD32', '#00FF00', '#90EE90'],
      ['#9370DB', '#BA55D3', '#DA70D6'],
      ['#FFE4E1', '#FFDAB9', '#FFD700'],
      ['#FF6347', '#FF4500', '#FF8C00'],
      ['#20B2AA', '#48D1CC', '#00CED1'],
    ];

    function createExplosion(x: number, y: number) {
      const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      const particleCount = 150 + Math.random() * 200;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 1.2;
        const velocity = 2 + Math.random() * 10;
        const color = scheme[Math.floor(Math.random() * scheme.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          color,
          size: 2 + Math.random() * 4,
        });
      }
    }

    function animate() {
      // Fade effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.vx *= 0.99; // friction
        p.life -= 0.006;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with glow
        ctx.globalAlpha = Math.pow(p.life, 1.5);

        // Outer glow
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.pow(p.life, 2) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Timing
    let startTime = Date.now();
    const duration = 5000;
    let burstCount = 0;

    const animationLoop = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        // Create bursts at intervals
        if (elapsed % 400 < 50) {
          const numBursts = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < numBursts; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.6);
            createExplosion(x, y);
          }
        }

        animate();
        requestAnimationFrame(animationLoop);
      }
    };

    animationLoop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
