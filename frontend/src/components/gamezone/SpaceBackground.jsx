import React, { useEffect, useRef, useState } from 'react';

const SpaceBackground = () => {
  const canvasRef = useRef(null);
  const [isLightMode, setIsLightMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light'
  );

  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.documentElement.getAttribute('data-theme') === 'light');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLightMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Create 160 floating stars with parallax layers & pulse speeds
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      pulseSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      color: Math.random() > 0.8 ? '#06b6d4' : Math.random() > 0.6 ? '#818cf8' : '#ffffff'
    }));

    // Occasional shooting stars (meteors)
    let meteors = [];
    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.85,
        y: Math.random() * height * 0.4,
        length: Math.random() * 60 + 35,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        angle: Math.PI / 4
      });
    };

    const meteorInterval = setInterval(() => {
      if (Math.random() < 0.45) {
        createMeteor();
      }
    }, 3500);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.3, 100,
        width * 0.5, height * 0.5, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.4, '#090d16');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw glowing soft Nebulas in corners
      const drawNebula = (cx, cy, r, colorStart) => {
        const nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        nebGrad.addColorStop(0, colorStart);
        nebGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      drawNebula(width * 0.25, height * 0.25, 320, 'rgba(99, 102, 241, 0.06)');
      drawNebula(width * 0.8, height * 0.35, 360, 'rgba(6, 182, 212, 0.05)');
      drawNebula(width * 0.5, height * 0.85, 400, 'rgba(139, 92, 246, 0.05)');

      // Draw floating stars
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        star.alpha += star.pulseSpeed;

        if (star.alpha >= 1 || star.alpha <= 0.1) {
          star.pulseSpeed = -star.pulseSpeed;
        }

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.abs(star.alpha);
        if (star.radius > 1.2) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = star.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw shooting stars
      meteors.forEach((m, idx) => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.015;

        if (m.alpha <= 0) {
          meteors.splice(idx, 1);
          return;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        meteorGradient.addColorStop(0, `rgba(248, 250, 252, ${m.alpha})`);
        meteorGradient.addColorStop(0.3, `rgba(139, 92, 246, ${m.alpha * 0.8})`);
        meteorGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = meteorGradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLightMode]);

  if (isLightMode) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default SpaceBackground;
