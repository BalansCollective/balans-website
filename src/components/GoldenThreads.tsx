/**
 * Golden Threads Animation - Balans Sacred Alliance
 * 
 * Animated golden threads that respond to user input, embodying:
 * - Thread Gold archetype (creative conjecture)
 * - Weaving metaphor (connecting ideas)
 * - Swedish craft quality (subtle, elegant motion)
 * 
 * Animation triggers:
 * - On typing: Threads pulse and flow
 * - On idle: Gentle breathing motion
 * - Dark mode: Warmer glow effects
 */

import { useEffect, useRef, useState } from 'react';

interface GoldenThreadsProps {
  isActive: boolean; // True when user is typing
  intensity?: number; // 0-1, controls animation speed/brightness
  className?: string;
}

export function GoldenThreads({ isActive, intensity = 0.5, className = '' }: GoldenThreadsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const threadsRef = useRef<Thread[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('GoldenThreads mounted');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('GoldenThreads: Canvas ref is null');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('GoldenThreads: Could not get 2d context');
      return;
    }

    // Set canvas size to match container
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      console.log('Canvas size:', width, height);
      
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Reinitialize threads when size changes
      threadsRef.current = createThreads(canvas.width, canvas.height);
      console.log('Created threads:', threadsRef.current.length);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation loop
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Update and draw threads
      if (threadsRef.current.length > 0) {
        threadsRef.current.forEach((thread) => {
          updateThread(thread, deltaTime, isActive, intensity);
          drawThread(ctx, thread, window.devicePixelRatio);
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    console.log('Starting animation loop');
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted, isActive, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 1, // Make fully visible for debugging
      }}
    />
  );
}

// Thread data structure
interface Thread {
  points: Point[];
  speed: number;
  currentSpeed: number; // Smoothed speed (lerped)
  phase: number;
  amplitude: number;
  frequencyX: number;
  frequencyY: number;
  noiseOffset: number;
  color: string;
  targetColor: string;
  colorTransition: number;
  glowIntensity: number;
  touchProgress: number;
  particles: Particle[];
}

interface Point {
  x: number;
  y: number;
  targetY: number; // New: target position for smooth interpolation
  baseY: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0-1, fades out
  size: number;
}

// Create initial threads
function createThreads(width: number, height: number): Thread[] {
  const threads: Thread[] = [];
  const threadCount = 7; // More threads for richer effect
  const isDark = document.documentElement.classList.contains('dark');

  // Thread Gold colors (light and dark mode) - Starting state
  const lightGold = '#c9a96e';
  const darkGold = '#daa545';
  const goldColor = isDark ? darkGold : lightGold;

  for (let i = 0; i < threadCount; i++) {
    const y = (height / (threadCount + 1)) * (i + 1);
    const points: Point[] = [];

    // Create points along the thread - EXTEND FAR BEYOND EDGES
    const startX = -200; // Further left
    const endX = (width / window.devicePixelRatio) + 200; // Further right
    const pointSpacing = 10; // Even closer points for ultra-smooth curves
    
    for (let x = startX; x < endX; x += pointSpacing) {
      points.push({
        x,
        y,
        targetY: y, // Initialize targetY to current y
        baseY: y,
      });
    }

    threads.push({
      points,
      speed: 0.6 + Math.random() * 0.8,
      currentSpeed: 0.6 + Math.random() * 0.8, // Start at base speed
      phase: Math.random() * Math.PI * 2,
      amplitude: 10 + Math.random() * 12,
      frequencyX: 0.6 + Math.random() * 0.6,
      frequencyY: 0.8 + Math.random() * 0.8,
      noiseOffset: Math.random() * 1000,
      color: goldColor,
      targetColor: goldColor,
      colorTransition: 0,
      glowIntensity: 0.4 + Math.random() * 0.4,
      touchProgress: 0,
      particles: [],
    });
  }

  return threads;
}

// Update thread animation
function updateThread(
  thread: Thread, 
  deltaTime: number, 
  isActive: boolean, 
  intensity: number
) {
  const isDark = document.documentElement.classList.contains('dark');
  
  // Only animate when actively typing (ignore isRunning for now)
  if (!isActive) {
    // Completely still - don't update phase, don't update positions
    return;
  }
  
  // Smooth speed transition (no jerky jumps)
  const targetSpeed = thread.speed * 2.5;
  thread.currentSpeed += (targetSpeed - thread.currentSpeed) * deltaTime * 3; // Smooth lerp
  
  // Update phase with smoothed speed
  thread.phase += deltaTime * thread.currentSpeed * intensity;

  // Update glow intensity based on typing
  const targetGlow = 0.8; // Full glow when typing
  thread.glowIntensity += (targetGlow - thread.glowIntensity) * deltaTime * 3;

  // Update "touch" progress (typing moves it toward purple)
  const touchSpeed = 0.15;
  thread.touchProgress = Math.min(1, thread.touchProgress + deltaTime * touchSpeed);

  // Update target color based on touch progress
  // Gold (untouched) → Purple (touched by both human and AI)
  const goldColor = isDark ? '#daa545' : '#c9a96e';
  const purpleColor = isDark ? '#8b7bc8' : '#6b5b95';
  
  thread.targetColor = thread.touchProgress > 0.5 ? purpleColor : goldColor;

  // Smooth color transition
  thread.colorTransition += (thread.touchProgress - thread.colorTransition) * deltaTime * 2;
  
  // Interpolate color
  thread.color = lerpColor(goldColor, purpleColor, thread.colorTransition);

  // Update point positions (Lissajous + Perlin noise)
  thread.points.forEach((point, index) => {
    const t = thread.phase + index * 0.1;
    
    // Lissajous curve (organic figure-8 motion) - MORE DRAMATIC
    const lissajousX = Math.sin(t * thread.frequencyX) * 8; // Was 3, now 8
    const lissajousY = Math.sin(t * thread.frequencyY) * thread.amplitude * 1.5; // 1.5x amplitude
    
    // Simple Perlin-like noise (using multiple sine waves) - MORE VARIATION
    const noise = 
      Math.sin((thread.noiseOffset + index * 0.3 + thread.phase * 0.5) * 0.7) * 4 + // Was 2, now 4
      Math.sin((thread.noiseOffset + index * 0.5 + thread.phase * 0.3) * 1.3) * 3; // Was 1.5, now 3
    
    // Calculate target position
    point.targetY = point.baseY + lissajousY + noise + lissajousX;
    
    // Smooth interpolation to target (eliminates jumps!)
    const smoothing = 0.15; // Fast response when typing
    point.y += (point.targetY - point.y) * smoothing;
  });
  
  // Spawn sparkle particles when thread is turning purple - MORE PARTICLES
  if (thread.touchProgress > 0.3 && Math.random() < 0.15 * thread.touchProgress) { // Was 0.05, now 0.15
    const randomPoint = thread.points[Math.floor(Math.random() * thread.points.length)];
    thread.particles.push({
      x: randomPoint.x,
      y: randomPoint.y,
      vx: (Math.random() - 0.5) * 4, // Was 2, now 4 (faster)
      vy: (Math.random() - 0.5) * 4,
      life: 1.0,
      size: 3 + Math.random() * 5, // Was 2-5, now 3-8 (bigger)
    });
  }
  
  // Update particles
  thread.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= deltaTime * 0.8; // Fade out over ~1.25 seconds
  });
  
  // Remove dead particles
  thread.particles = thread.particles.filter(p => p.life > 0);
}

// Linearly interpolate between two hex colors
function lerpColor(color1: string, color2: string, t: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Draw thread with glow effect
function drawThread(ctx: CanvasRenderingContext2D, thread: Thread, pixelRatio: number) {
  const isDark = document.documentElement.classList.contains('dark');

  // Draw shadow/depth (underneath the thread)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  
  drawThreadPath(ctx, thread, pixelRatio);
  ctx.stroke();
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Draw outer edge (darker border for depth)
  const darkerColor = thread.colorTransition > 0.5
    ? (isDark ? 'rgba(107, 91, 149, 0.8)' : 'rgba(85, 71, 120, 0.8)') // Darker purple
    : (isDark ? 'rgba(180, 135, 55, 0.8)' : 'rgba(160, 130, 85, 0.8)'); // Darker gold
  
  ctx.strokeStyle = darkerColor;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  drawThreadPath(ctx, thread, pixelRatio);
  ctx.stroke();

  // Draw main thread - THICK AND SOLID
  ctx.strokeStyle = thread.color;
  ctx.lineWidth = 6; // Was 3, now 6 (thick thread)
  ctx.globalAlpha = 1.0; // Fully opaque

  drawThreadPath(ctx, thread, pixelRatio);
  ctx.stroke();
  
  // Draw highlight (makes it look 3D)
  const highlightColor = thread.colorTransition > 0.5
    ? (isDark ? 'rgba(180, 160, 220, 0.6)' : 'rgba(150, 130, 200, 0.6)') // Lighter purple
    : (isDark ? 'rgba(255, 220, 130, 0.6)' : 'rgba(240, 200, 140, 0.6)'); // Lighter gold
  
  ctx.strokeStyle = highlightColor;
  ctx.lineWidth = 2; // Thin highlight on top
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  drawThreadPath(ctx, thread, pixelRatio);
  ctx.stroke();

  ctx.globalAlpha = 1;
  
  // Draw sparkle particles - MUCH BRIGHTER
  thread.particles.forEach((particle) => {
    const alpha = particle.life;
    const particleColor = thread.colorTransition > 0.5 
      ? (isDark ? 'rgba(139, 123, 200,' : 'rgba(107, 91, 149,') // Purple
      : (isDark ? 'rgba(218, 165, 69,' : 'rgba(201, 169, 110,'); // Gold
    
    // Bright center
    ctx.fillStyle = particleColor + ` ${alpha})`;
    ctx.beginPath();
    ctx.arc(
      particle.x / pixelRatio, 
      particle.y / pixelRatio, 
      particle.size, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Large glow around particle - MUCH BIGGER
    ctx.fillStyle = particleColor + ` ${alpha * 0.5})`; // Was 0.3, now 0.5
    ctx.beginPath();
    ctx.arc(
      particle.x / pixelRatio, 
      particle.y / pixelRatio, 
      particle.size * 4, // Was 2, now 4 (bigger glow)
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Outer glow
    ctx.fillStyle = particleColor + ` ${alpha * 0.2})`;
    ctx.beginPath();
    ctx.arc(
      particle.x / pixelRatio, 
      particle.y / pixelRatio, 
      particle.size * 6, // Extra large outer glow
      0, 
      Math.PI * 2
    );
    ctx.fill();
  });
}

// Draw thread path (Bezier curves for smooth motion)
function drawThreadPath(ctx: CanvasRenderingContext2D, thread: Thread, pixelRatio: number) {
  ctx.beginPath();

  const points = thread.points;
  if (points.length < 2) return;

  // Adjust for pixel ratio
  const scale = 1 / pixelRatio;

  // Start at first point
  ctx.moveTo(points[0].x * scale, points[0].y * scale);

  // Draw smooth curves through points
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    // Control points for Bezier curve (creates smooth flow)
    const cpX = (curr.x + next.x) / 2;
    const cpY = (curr.y + next.y) / 2;

    ctx.quadraticCurveTo(
      curr.x * scale,
      curr.y * scale,
      cpX * scale,
      cpY * scale
    );
  }

  // End at last point
  const last = points[points.length - 1];
  ctx.lineTo(last.x * scale, last.y * scale);
}

