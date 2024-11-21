'use client';

import { useEffect, useRef } from 'react';

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWorldMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;

      // Draw simplified continents
      ctx.beginPath();
      // North America
      ctx.moveTo(50, 80);
      ctx.lineTo(150, 80);
      ctx.lineTo(200, 150);
      
      // South America
      ctx.moveTo(150, 150);
      ctx.lineTo(180, 250);
      
      // Europe & Africa
      ctx.moveTo(250, 80);
      ctx.lineTo(250, 200);
      
      // Asia
      ctx.moveTo(300, 80);
      ctx.lineTo(400, 150);
      
      ctx.stroke();

      // Draw connection lines
      ctx.beginPath();
      ctx.strokeStyle = '#ff000040';
      for (let i = 0; i < 5; i++) {
        const x1 = Math.random() * canvas.width;
        const y1 = Math.random() * canvas.height;
        const x2 = Math.random() * canvas.width;
        const y2 = Math.random() * canvas.height;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    };

    const interval = setInterval(drawWorldMap, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={300}
      className="radar-screen"
    />
  );
}