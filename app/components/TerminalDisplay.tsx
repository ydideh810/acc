'use client';

import { useEffect, useRef } from 'react';

export function TerminalDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set line styles
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      
      // Draw horizon line
      const centerY = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      
      // Draw center circle
      const centerX = canvas.width / 2;
      const radius = 80;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw ellipse for perspective
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw corner markers
      const markerSize = 20;
      // Top left
      ctx.beginPath();
      ctx.moveTo(markerSize, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, markerSize);
      ctx.stroke();
      
      // Top right
      ctx.beginPath();
      ctx.moveTo(canvas.width - markerSize, 0);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(canvas.width, markerSize);
      ctx.stroke();
      
      // Bottom left
      ctx.beginPath();
      ctx.moveTo(markerSize, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(0, canvas.height - markerSize);
      ctx.stroke();
      
      // Bottom right
      ctx.beginPath();
      ctx.moveTo(canvas.width - markerSize, canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(canvas.width, canvas.height - markerSize);
      ctx.stroke();
    };

    draw();
    
    // Add slight flicker effect
    const flicker = setInterval(() => {
      if (Math.random() > 0.95) {
        ctx.globalAlpha = 0.8;
        draw();
        setTimeout(() => {
          ctx.globalAlpha = 1;
          draw();
        }, 50);
      }
    }, 100);

    return () => clearInterval(flicker);
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      width={640}
      height={480}
      className="w-full h-full"
    />
  );
}