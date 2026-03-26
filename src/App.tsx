import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-[#00FFFF] font-mono selection:bg-[#FF00FF] selection:text-[#020202] overflow-x-hidden relative">
      <div className="scanlines"></div>
      <div className="crt-flicker"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col items-center justify-center gap-2 mb-8 border-b-2 border-[#FF00FF] pb-4">
          <div className="flex items-center gap-4">
            <Terminal className="w-8 h-8 text-[#FF00FF]" />
            <h1 className="text-5xl md:text-6xl font-bold tracking-widest glitch-text" data-text="SYS.SNAKE_PROTOCOL">
              SYS.SNAKE_PROTOCOL
            </h1>
          </div>
          <p className="text-[#00FFFF] text-xl tracking-widest opacity-80">STATUS: ONLINE // UPLINK: STABLE</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 max-w-7xl mx-auto w-full">
          
          {/* Left Column: Music Player & Logs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="border-2 border-[#00FFFF] bg-[#020202] p-1 relative shadow-[4px_4px_0px_#FF00FF]">
              <div className="absolute top-0 left-0 bg-[#00FFFF] text-[#020202] px-2 py-0.5 text-sm font-bold">
                AUDIO_SUBSYSTEM.EXE
              </div>
              <div className="pt-8 pb-2 px-2">
                <MusicPlayer />
              </div>
            </div>
            
            <div className="border-2 border-[#FF00FF] bg-[#020202] p-4 relative shadow-[4px_4px_0px_#00FFFF]">
              <div className="absolute top-0 left-0 bg-[#FF00FF] text-[#020202] px-2 py-0.5 text-sm font-bold">
                MANUAL.TXT
              </div>
              <div className="pt-6">
                <ul className="space-y-2 text-lg">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF00FF]">&gt;</span> 
                    <span>INPUT: [W,A,S,D] OR [ARROWS]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF00FF]">&gt;</span> 
                    <span>INTERRUPT: [SPACE]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF00FF]">&gt;</span> 
                    <span>OBJECTIVE: CONSUME MAGENTA DATA PACKETS. AVOID BOUNDARIES.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Game Area */}
          <div className="w-full lg:w-2/3 flex justify-center">
            <div className="border-2 border-[#00FFFF] bg-[#020202] p-1 relative shadow-[8px_8px_0px_#FF00FF] w-full max-w-2xl">
              <div className="absolute top-0 left-0 bg-[#00FFFF] text-[#020202] px-2 py-0.5 text-sm font-bold z-20">
                EXECUTE: SNAKE.BIN
              </div>
              <div className="pt-8 pb-2 px-2 flex justify-center">
                <SnakeGame />
              </div>
            </div>
          </div>

        </main>
        
        {/* Footer */}
        <footer className="mt-auto pt-8 text-center text-[#FF00FF] text-lg border-t-2 border-[#00FFFF] mt-8">
          <p>END OF LINE // {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
