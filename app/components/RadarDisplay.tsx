'use client';

import { useEffect, useRef } from 'react';

export function RadarDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, (canvas.width/2/5) * i, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(0, canvas.height/2);
      ctx.lineTo(canvas.width, canvas.height/2);
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height);
      ctx.strokeStyle = '#ff0000';
      ctx.stroke();

      // Draw rotating sweep
      const time = new Date();
      const angle = ((time.getSeconds() * 1000 + time.getMilliseconds()) / 1000) * Math.PI / 30;
      
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, canvas.height/2);
      ctx.lineTo(
        canvas.width/2 + Math.cos(angle) * canvas.width/2,
        canvas.height/2 + Math.sin(angle) * canvas.height/2
      );
      ctx.strokeStyle = '#ff000080';
      ctx.stroke();
    };

    const interval = setInterval(drawRadar, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      width={300}
      height={300}
      className="radar-screen"
    />
  );
}