/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import { MusicSidebar, MusicFooter } from './components/MusicPlayer';
import { TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-[#e0e0e0] font-sans relative overflow-hidden select-none">
      <audio ref={audioRef} src={TRACKS[currentTrackIndex].audioUrl} />

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0c] z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f3ff] to-[#ff007f] animate-pulse shadow-[0_0_15px_rgba(0,243,255,0.4)]"></div>
          <h1 className="text-xl font-black tracking-tighter neon-text-cyan uppercase italic">NeonSnake.OS</h1>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-mono">Current Score</span>
            <span className="text-2xl font-mono font-bold text-[#00f3ff] tabular-nums tracking-tighter">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-mono">High Score</span>
            <span className="text-2xl font-mono font-bold text-[#ff007f] tabular-nums tracking-tighter">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Playlist */}
        <MusicSidebar 
          currentTrackIndex={currentTrackIndex} 
          onTrackSelect={(index) => {
            setCurrentTrackIndex(index);
            setIsPlaying(true);
          }} 
        />

        {/* Center: Game Arena */}
        <section className="flex-1 relative flex items-center justify-center bg-black p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f3ff] blur-[150px] rounded-full" />
          </div>
          <SnakeGame 
            onScoreChange={setScore} 
            onHighScoreChange={setHighScore} 
          />
        </section>
      </main>

      {/* Bottom: Music Controls & Stats */}
      <MusicFooter 
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
