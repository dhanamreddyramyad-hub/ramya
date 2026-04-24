/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GAME_SETTINGS } from '../constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
  onHighScoreChange?: (highScore: number) => void;
}

export default function SnakeGame({ onScoreChange, onHighScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    onScoreChange?.(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GAME_SETTINGS.GRID_SIZE) % GAME_SETTINGS.GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GAME_SETTINGS.GRID_SIZE) % GAME_SETTINGS.GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange?.(newScore);
        setFood({
          x: Math.floor(Math.random() * GAME_SETTINGS.GRID_SIZE),
          y: Math.floor(Math.random() * GAME_SETTINGS.GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Space to pause/resume
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const speed = Math.max(
      GAME_SETTINGS.MIN_SNAKE_SPEED,
      GAME_SETTINGS.INITIAL_SNAKE_SPEED - score * GAME_SETTINGS.SPEED_INCREMENT
    );
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    const step = canvas.width / GAME_SETTINGS.GRID_SIZE;
    for (let i = 0; i <= GAME_SETTINGS.GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(canvas.width, i * step);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00f3ff';
      
      if (isHead) {
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f3ff';
      } else {
        ctx.shadowBlur = 0;
      }
      
      const padding = 2;
      ctx.fillRect(
        segment.x * step + padding,
        segment.y * step + padding,
        step - padding * 2,
        step - padding * 2
      );
      
      if (isHead) {
        ctx.strokeRect(
          segment.x * step + padding,
          segment.y * step + padding,
          step - padding * 2,
          step - padding * 2
        );
      }
    });

    // Draw food
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      food.x * step + step / 2,
      food.y * step + step / 2,
      step / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      onHighScoreChange?.(score);
    }
  }, [score, highScore, onHighScoreChange]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border border-white/10 rounded-sm bg-black game-grid neon-border-cyan cursor-none"
          onClick={() => isGameOver ? resetGame() : setIsPaused(p => !p)}
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-sm"
            >
              <div className="text-center px-8">
                {isGameOver ? (
                  <>
                    <h2 className="text-5xl font-black text-[#ff007f] mb-2 uppercase italic tracking-tighter neon-text-pink">Game Over</h2>
                    <p className="text-white/40 mb-6 font-mono text-xs uppercase tracking-widest">Neural Link Severed</p>
                    <button
                      onClick={resetGame}
                      className="px-10 py-3 bg-transparent border border-[#ff007f] text-[#ff007f] rounded-sm font-bold transition-all neon-border-pink active:scale-95 uppercase italic"
                    >
                      Initialize Restart
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-5xl font-black text-[#00f3ff] mb-2 uppercase italic tracking-tighter neon-text-cyan">Standby</h2>
                    <p className="text-white/40 mb-6 font-mono text-xs uppercase tracking-widest italic">Space or Click to Re-sync</p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="px-10 py-3 bg-transparent border border-[#00f3ff] text-[#00f3ff] rounded-sm font-bold transition-all neon-border-cyan active:scale-95 uppercase italic"
                    >
                      Resume Link
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Arena Watermark */}
        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] pointer-events-none">
          Level_07 // Grid_Active
        </div>
      </div>

      <div className="flex gap-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="text-[#00f3ff]">▲▼◀▶</span>
          <span>Navigation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#ff007f]">[SPACE]</span>
          <span>Pause State</span>
        </div>
      </div>
    </div>
  );
}
