import { useEffect, useRef } from 'react';

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const canvasElement = canvas;
    const context = ctx;

    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
      brightness: number;
    }

    const particles: Particle[] = [];

    // Professional wedding color palette
    const colorSchemes = [
      { main: '#FFD700', accent: '#FFA500', bright: '#FFFF00' },     // Gold
      { main: '#FF1493', accent: '#FF69B4', bright: '#FFB6C1' },     // Pink
      { main: '#00CED1', accent: '#00BFFF', bright: '#87CEEB' },     // Cyan
      { main: '#32CD32', accent: '#00FF00', bright: '#90EE90' },     // Green
      { main: '#9370DB', accent: '#BA55D3', bright: '#DA70D6' },     // Purple
      { main: '#FF6347', accent: '#FF4500', bright: '#FF8C00' },     // Red-Orange
      { main: '#20B2AA', accent: '#48D1CC', bright: '#00CED1' },     // Teal
      { main: '#FFE4E1', accent: '#FFDAB9', bright: '#FFD700' },     // Peach
    ];

    function createExplosion(x: number, y: number) {
      const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      const particleCount = 200 + Math.random() * 300;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 1.5;
        const velocity = 1 + Math.random() * 12;
        
        // Mix colors
        const colors = [scheme.main, scheme.accent, scheme.bright];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          color,
          size: 1.5 + Math.random() * 5,
          brightness: 1 + Math.random() * 0.5,
        });
      }
    }

    function drawParticle(p: Particle) {
      const alpha = Math.pow(p.life, 1.8);
      
      // Draw outer glow
      const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      gradient.addColorStop(0, p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.5, p.color + Math.floor(alpha * 128).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, p.color + '00');
      
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      context.fill();

      // Draw bright core
      context.globalAlpha = Math.pow(p.life, 2.5) * 0.9;
      context.fillStyle = '#FFFFFF';
      context.beginPath();
      context.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
      context.fill();

      // Draw main particle
      context.globalAlpha = alpha;
      context.fillStyle = p.color;
      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      context.fill();
    }

    function animate() {
      // Fade background
      context.fillStyle = 'rgba(10, 10, 10, 0.03)';
      context.fillRect(0, 0, canvasElement.width, canvasElement.height);

      context.globalAlpha = 1;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.98; // air resistance
        p.life -= 0.005;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(p);
      }

      context.globalAlpha = 1;
    }

    // Animation loop
    let startTime = Date.now();
    const duration = 5000;
    let lastBurst = 0;

    const animationLoop = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        // Create bursts at intervals
        if (elapsed - lastBurst > 300) {
          const numBursts = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < numBursts; i++) {
            const x = 100 + Math.random() * (canvasElement.width - 200);
            const y = 100 + Math.random() * (canvasElement.height * 0.5);
            createExplosion(x, y);
          }
          lastBurst = elapsed;
        }

        animate();
        requestAnimationFrame(animationLoop);
      }
    };

    animationLoop();

    const handleResize = () => {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
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
