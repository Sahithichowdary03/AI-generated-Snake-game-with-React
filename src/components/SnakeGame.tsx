import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shake, setShake] = useState(false);

  const directionRef = useRef<Direction>(direction);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, life: number}[]>([]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setFood({ x: 15, y: 10 });
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    particlesRef.current = [];
    triggerShake();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'Escape') {
      if (!gameOver) setIsPaused((prev) => !prev);
      return;
    }

    if (isPaused || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
        if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
        if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
        if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
        break;
    }
  }, [isPaused, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const createParticles = (x: number, y: number) => {
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0
      });
    }
  };

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        triggerShake();
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        triggerShake();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        createParticles(food.x, food.y);
        triggerShake();
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setDirection(directionRef.current);
      return newSnake;
    });
  }, [food, isPaused, gameOver, generateFood, highScore]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 5);
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, gameOver, score]);

  // Render Loop for particles and game
  useEffect(() => {
    let animationFrameId: number;
    
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Grid
      ctx.strokeStyle = '#003333';
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#FF00FF';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#FF00FF';
      ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      ctx.shadowBlur = 0;

      // Snake
      snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#FFFFFF' : '#00FFFF';
        if (isHead) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00FFFF';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
      ctx.shadowBlur = 0;

      // Particles
      particlesRef.current.forEach((p, i) => {
        ctx.fillStyle = `rgba(255, 0, 255, ${p.life})`;
        ctx.fillRect(p.x, p.y, 4, 4);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [snake, food]);

  return (
    <div className={`flex flex-col items-center gap-4 w-full ${shake ? 'shake' : ''}`}>
      {/* Score Header */}
      <div className="w-full flex items-center justify-between border-2 border-[#00FFFF] bg-[#020202] p-2">
        <div className="flex flex-col">
          <span className="text-[#FF00FF] text-sm">MEMORY_ALLOC</span>
          <span className="text-3xl font-bold text-[#00FFFF]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#FF00FF] text-sm">PEAK_ALLOC</span>
          <span className="text-3xl font-bold text-[#00FFFF]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative border-4 border-[#FF00FF] bg-[#020202] shadow-[0_0_20px_rgba(255,0,255,0.2)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block"
        />

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-[#020202]/80 flex flex-col items-center justify-center z-10 border-2 border-[#00FFFF] m-2">
            {gameOver ? (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#FF00FF] mb-2 glitch-text" data-text="FATAL_ERROR">
                  FATAL_ERROR
                </h2>
                <p className="text-[#00FFFF] mb-6 text-xl">SEGM_FAULT: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#FF00FF] text-[#020202] font-bold text-xl hover:bg-[#00FFFF] transition-none"
                >
                  REBOOT_SYS
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 bg-[#00FFFF] text-[#020202] font-bold text-xl hover:bg-[#FF00FF] transition-none animate-pulse"
                >
                  INITIATE_SEQUENCE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
