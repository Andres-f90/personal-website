'use client';

import { useEffect, useRef } from 'react';

interface RadarPoint {
  label: string;
  value: number;
  color: string;
}

export default function RadarChart({ data }: { data: RadarPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 280;
    const cx = size / 2;
    const cy = size / 2;
    const r = 100;
    const n = data.length;

    ctx.clearRect(0, 0, size, size);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + ((r * ring) / 4) * Math.cos(angle);
        const y = cy + ((r * ring) / 4) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = '#1e1e1e';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Shape
    ctx.beginPath();
    data.forEach((d, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const val = d.value / 100;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(200,169,110,0.07)';
    ctx.fill();
    ctx.strokeStyle = '#c8a96e';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dots + labels
    data.forEach((d, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const val = d.value / 100;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();

      const lx = cx + (r + 24) * Math.cos(angle);
      const ly = cy + (r + 24) * Math.sin(angle);
      ctx.fillStyle = '#2e2e2e';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.label.toUpperCase(), lx, ly);
    });
  }, [data]);

  return <canvas ref={canvasRef} width={280} height={280} style={{ opacity: 0.9 }} />;
}
