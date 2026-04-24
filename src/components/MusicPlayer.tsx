/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { TRACKS, Track } from '../constants';

export default function MusicPlayer() {
  // This file now provides multiple exports for the App layout
  return null;
}

export function MusicSidebar({ 
  currentTrackIndex, 
  onTrackSelect 
}: { 
  currentTrackIndex: number, 
  onTrackSelect: (index: number) => void 
}) {
  return (
    <aside className="w-72 border-r border-white/10 bg-[#08080a] flex flex-col p-6 overflow-y-auto">
      <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-8 font-mono">Neural Playlist</h2>
      
      <div className="space-y-3">
        {TRACKS.map((track, index) => {
          const isActive = index === currentTrackIndex;
          return (
            <motion.div
              key={track.id}
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => onTrackSelect(index)}
              className={`p-4 rounded-lg glass cursor-pointer transition-all ${
                isActive ? 'border-l-4 border-l-[#00f3ff] bg-white/5 opacity-100' : 'opacity-60'
              }`}
            >
              {isActive && <div className="text-[10px] text-[#00f3ff] mb-1 font-mono uppercase tracking-tighter">Now Playing</div>}
              <div className="font-bold text-sm text-white">{track.title}</div>
              <div className="text-xs text-white/40">{track.artist}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto p-4 rounded-xl bg-gradient-to-b from-[#ff007f]/10 to-transparent border border-[#ff007f]/20 glass">
        <div className="text-[10px] uppercase tracking-tighter text-[#ff007f] mb-2 font-black italic">System Alert</div>
        <p className="text-[11px] text-white/60 leading-relaxed font-mono">
          Speed increases every 50 points. Walls are non-collidable (looping).
        </p>
      </div>
    </aside>
  );
}

export function MusicFooter({
  currentTrackIndex,
  isPlaying,
  progress,
  onTogglePlay,
  onNext,
  onPrev
}: {
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <footer className="h-24 bg-[#0a0a0c] border-t border-white/10 flex items-center px-12 z-20">
      {/* Track Info */}
      <div className="w-1/4">
        <motion.div
          key={currentTrack.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-sm font-bold truncate uppercase tracking-tight italic text-white">{currentTrack.title}</div>
          <div className="text-[11px] text-white/40 font-mono tracking-widest">{currentTrack.artist} • 2026</div>
        </motion.div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={onPrev} className="text-white/40 hover:text-[#00f3ff] transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full border border-[#00f3ff] flex items-center justify-center text-[#00f3ff] neon-border-cyan hover:bg-[#00f3ff]/10 transition-all active:scale-90"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </button>
          <button onClick={onNext} className="text-white/40 hover:text-[#00f3ff] transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[9px] font-mono text-white/40 tracking-tighter">PROGRESS</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#00f3ff] neon-border-cyan"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-white/40">{Math.floor(progress)}%</span>
        </div>
      </div>

      {/* Right: Volume & System */}
      <div className="w-1/4 flex items-center justify-end gap-6 text-white/40">
        <div className="flex items-center gap-3">
          <Volume2 size={16} />
          <div className="w-24 h-1 bg-white/10 rounded-full">
            <div className="w-[80%] h-full bg-white/40 rounded-full"></div>
          </div>
        </div>
        <div className="px-3 py-1 rounded bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[9px] font-mono text-[#00f3ff] tracking-widest font-black uppercase">
          STABLE_OS
        </div>
      </div>
    </footer>
  );
}
