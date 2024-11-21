'use client';

import { useState } from 'react';
import { usePollinationsImage } from '@pollinations/react';
import { ImageIcon, Loader } from 'lucide-react';

interface ImageGeneratorProps {
  prompt: string;
  onClose: () => void;
}

export function ImageGenerator({ prompt, onClose }: ImageGeneratorProps) {
  const imageUrl = usePollinationsImage(prompt, {
    width: 512,
    height: 512,
    seed: 42,
    model: 'turbo',
    nologo: true,
    enhance: false
  });

  return (
    <div className="border border-[#ff0000] bg-black/90 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-[#ff0000]">
          <ImageIcon size={16} />
          <span className="text-sm">Image Generation</span>
        </div>
        <button 
          onClick={onClose}
          className="text-[#ff0000] hover:opacity-80 text-sm"
        >
          [X]
        </button>
      </div>

      <div className="aspect-square w-full relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={prompt}
            className="w-full h-full object-cover border border-[#ff0000]"
          />
        ) : (
          <div className="w-full h-full border border-[#ff0000] flex items-center justify-center">
            <div className="flex items-center gap-2 text-[#ff0000]">
              <Loader className="animate-spin" size={16} />
              <span>Generating...</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-[#ff0000]/70 text-xs">
        Prompt: {prompt}
      </div>
    </div>
  );
}