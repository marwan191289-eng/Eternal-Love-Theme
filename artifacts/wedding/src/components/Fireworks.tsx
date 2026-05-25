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
      maxLife: number;
      color: string;
      size: number;
      trail: Array<{ x: number; y: number; alpha: number }>;
    }

    const particles: Particle[] = [];

    // Beautiful gradient colors for realistic fireworks
    const colorPalettes = [
      ['#FFD700', '#FFA500', '#FF8C00', '#FF6347'], // Gold to orange
      ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'], // Pink gradient
      ['#00CED1', '#00BFFF', '#87CEEB', '#B0E0E6'], // Cyan to light blue
      ['#32CD32', '#00FF00', '#90EE90', '#98FB98'], // Green gradient
      ['#9370DB', '#BA55D3', '#DA70D6', '#EE82EE'], // Purple gradient
      ['#FFE4E1', '#FFDAB9', '#FFD700', '#FFA500'], // Warm gradient
    ];

    function createFirework(x: number, y: number) {
      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      const particleCount = 100 + Math.random() * 150;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
        const velocity = 3 + Math.random() * 8;
        const color = palette[Math.floor(Math.random() * palette.length)];
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          color,
          size: 1.5 + Math.random() * 3,
          trail: [],
        });
      }
    }

    function animate() {
      // Fade background instead of clearing
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Add trail point
        p.trail.push({ x: p.x, y: p.y, alpha: p.life * 0.6 });
        if (p.trail.length > 8) p.trail.shift();

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity
        p.vx *= 0.98; // air resistance
        p.life -= 0.008;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw trail
        for (let j = 0; j < p.trail.length; j++) {
          const t = p.trail[j];
          const trailAlpha = (t.alpha * p.life) * 0.3;
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw main particle with glow
        ctx.globalAlpha = p.life;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, p.color.replace(')', ', 0)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
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

      // Play subtle pop sound effect
      if (!soundPlayed && elapsed < 100) {
        playFireworksSound();
        soundPlayed = true;
      }

      // Create multiple fireworks bursts
      const numFireworks = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numFireworks; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.5); // Upper half
        createFirework(x, y);
      }

      animate();
      requestAnimationFrame(animate);
    }, 150);

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

  const playFireworksSound = () => {
    // Create a simple pop sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Create multiple pop sounds
      for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(150 + i * 50, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now + i * 0.05);
        osc.stop(now + 0.1 + i * 0.05);
      }
    } catch (e) {
      // Silent fail if audio context not available
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
