'use client'
import React, { useState, useEffect, useRef } from 'react';

interface ColorDropperProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onColorPick: (color: string) => void;
}

const ColorDropper: React.FC<ColorDropperProps> = ({ canvasRef, onColorPick }) => {
  const [color, setColor] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [copyMessage, setCopyMessage] = useState('');
  const dropperRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);

  const magnifierSize = 120;
  const pixelSize = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        setColor(hexColor);

        updateMagnifier(x, y);
      }
    };

    const handleClick = () => {
      if (color) {
        onColorPick(color);
        setCopyMessage('Color copied!');
        setTimeout(() => setCopyMessage(''), 2000);  
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [canvasRef, color, onColorPick]);

  const updateMagnifier = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const magnifier = magnifierRef.current;
    if (!canvas || !magnifier) return;

    const ctx = canvas.getContext('2d');
    const magCtx = magnifier.getContext('2d');
    if (!ctx || !magCtx) return;

    const gridSize = magnifierSize / pixelSize;
    const startX = Math.max(0, x - Math.floor(gridSize / 2));
    const startY = Math.max(0, y - Math.floor(gridSize / 2));

    magCtx.clearRect(0, 0, magnifierSize, magnifierSize);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const pixelX = startX + i;
        const pixelY = startY + j;
        const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
        const [r, g, b] = imageData.data;

        magCtx.fillStyle = `rgb(${r},${g},${b})`;
        magCtx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);

        magCtx.strokeStyle = 'rgba(0,0,0,0.3)';
        magCtx.strokeRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
      }
    }
  };

  return (
    <>
      <div
        ref={dropperRef}
        className="absolute rounded-full pointer-events-none cursor-pointer"
        style={{
          left: `${position.x - magnifierSize / 2}px`,
          top: `${position.y - magnifierSize / 2}px`,
          width: `${magnifierSize}px`,
          height: `${magnifierSize}px`,
          border: `2px solid ${color || 'black'}`,
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={magnifierRef}
          width={magnifierSize}
          height={magnifierSize}
          className="rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
          <span className="text-xs font-mono">{color}</span>
        </div>
      </div>
      {copyMessage && (
        <div
          className="absolute bg-black text-white px-2 py-1 rounded text-sm"
          style={{
            left: `${position.x + magnifierSize / 2 + 10}px`,
            top: `${position.y}px`,
          }}
        >
          {copyMessage}
        </div>
      )}
    </>
  );
};

export default ColorDropper;