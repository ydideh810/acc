'use client';

import dynamic from 'next/dynamic';
import { Terminal } from 'lucide-react';

const ChatInterface = dynamic(() => import('./components/ChatInterface').then(mod => mod.ChatInterface), {
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-4">
      <div className="terminal-frame w-full h-[98vh] relative">
        <div className="absolute top-4 left-6 terminal-text flex items-center gap-2">
          <span className="text-[#ff0000]">></span> N.I.D.A.M V1.0
        </div>
        <div className="absolute top-4 right-6 terminal-text">
          SYSTEM ACTIVE
        </div>
        
        <ChatInterface />
        
        <div className="absolute bottom-4 right-6 terminal-text">NODE: 0xF42A</div>
      </div>
    </main>
  );
}