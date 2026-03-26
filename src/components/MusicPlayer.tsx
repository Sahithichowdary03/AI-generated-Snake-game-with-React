import React, { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 1, title: 'DATA_STREAM_01.WAV', artist: 'UNKNOWN_ENTITY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORRUPTION_02.WAV', artist: 'SYS_ADMIN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'VOID_NOISE_03.WAV', artist: 'NULL_PTR', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [glitch, setGlitch] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
  };

  const handlePlayPause = () => {
    triggerGlitch();
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    triggerGlitch();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    triggerGlitch();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className={`flex flex-col gap-4 font-mono ${glitch ? 'shake' : ''}`}>
      <div className="flex flex-col border border-[#FF00FF] p-2 bg-[#020202]">
        <div className="text-[#FF00FF] text-xl mb-1">TARGET: {currentTrack.title}</div>
        <div className="text-[#00FFFF] text-lg">ORIGIN: {currentTrack.artist}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-6 border border-[#00FFFF] bg-[#020202] relative">
        <div 
          className="h-full bg-[#FF00FF] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm text-[#020202] font-bold mix-blend-difference">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={handlePrev} className="flex-1 border border-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#020202] text-[#00FFFF] py-2 text-xl transition-none">
          &lt;&lt;
        </button>
        <button onClick={handlePlayPause} className="flex-2 border border-[#FF00FF] hover:bg-[#FF00FF] hover:text-[#020202] text-[#FF00FF] py-2 text-xl font-bold transition-none w-32">
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        <button onClick={handleNext} className="flex-1 border border-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#020202] text-[#00FFFF] py-2 text-xl transition-none">
          &gt;&gt;
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-[#FF00FF] text-lg">VOL:</span>
        <input 
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-3 bg-[#020202] border border-[#00FFFF] appearance-none cursor-pointer accent-[#FF00FF]"
        />
      </div>
    </div>
  );
}
