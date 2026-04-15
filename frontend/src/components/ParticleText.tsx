import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 14;
const RETURN_SPEED = 0.045;
const FRICTION = 0.92;
const PARTICLE_GAP = 2;

export const ParticleText = ({ text = "Shorten links" }: { text?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const canvasBoundsRef = useRef({ left: 0, top: 0 });
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    const initParticles = () => {
      const rect = canvas.getBoundingClientRect();
      canvasBoundsRef.current = { left: rect.left, top: rect.top };
      dimsRef.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render text to sample — large and bold
      const fontSize = Math.min(rect.width * 0.13, 72);
      ctx.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillText(text, rect.width / 2, rect.height / 2);

      // Sample pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const particles: Particle[] = [];
      const gap = PARTICLE_GAP * dpr;

      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
          if (data[i + 3] > 80) {
            const px = x / dpr;
            const py = y / dpr;
            particles.push({
              x: px,
              y: py,
              ox: px,
              oy: py,
              vx: 0,
              vy: 0,
              size: 1.4 + Math.random() * 0.8,
              alpha: 1,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = canvasBoundsRef.current;
      mouseRef.current = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const bounds = canvasBoundsRef.current;
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - bounds.left,
        y: touch.clientY - bounds.top,
      };
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    const animate = () => {
      const { w, h } = dimsRef.current;
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const force = ((1 - dist / MOUSE_RADIUS) ** 2) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Return to origin with spring
        p.vx += (p.ox - p.x) * RETURN_SPEED;
        p.vy += (p.oy - p.y) * RETURN_SPEED;

        // Friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Alpha based on displacement
        const dispX = p.x - p.ox;
        const dispY = p.y - p.oy;
        const displacement = Math.sqrt(dispX * dispX + dispY * dispY);
        p.alpha = Math.max(0.08, 1 - displacement / 180);

        // Draw — round particles for premium feel
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#0A0A0A";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-default"
      style={{ width: "calc(100% + 120px)", marginLeft: "-60px", marginRight: "-60px", height: "280px", marginTop: "-100px", marginBottom: "-100px" }}
    />
  );
};
