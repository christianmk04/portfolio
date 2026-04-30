import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

const CELL = 15;
const COLS = 20;
const ROWS = 20;
const CANVAS_W = CELL * COLS;
const CANVAS_H = CELL * ROWS;
const BASE_INTERVAL = 120;

type Dir = { x: number; y: number };
type Point = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'gameover';

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Dir>({ x: 1, y: 0 });
  const nextDirRef = useRef<Dir>({ x: 1, y: 0 });
  const foodRef = useRef<Point>(randomFood(snakeRef.current));
  const gameStateRef = useRef<GameState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [hiScore, setHiScore] = useState(() => {
    const saved = localStorage.getItem('snake-hi');
    return saved ? parseInt(saved, 10) : 0;
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(CANVAS_W, y * CELL); ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#4ade80' : `rgba(74, 222, 128, ${0.85 - i * (0.6 / snake.length)})`;
      const r = 3;
      const x = seg.x * CELL + 1;
      const y = seg.y * CELL + 1;
      const w = CELL - 2;
      const h = CELL - 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    });

    // Game over overlay
    if (gameStateRef.current === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 22px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 12);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px Inter, system-ui';
      ctx.fillText('Press Space to restart', CANVAS_W / 2, CANVAS_H / 2 + 14);
    }
  }, []);

  const tick = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const newHead = {
      x: head.x + dirRef.current.x,
      y: head.y + dirRef.current.y,
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
      endGame(); return;
    }
    // Self collision
    if (snakeRef.current.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      endGame(); return;
    }

    const ateFood = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const newSnake = [newHead, ...snakeRef.current];
    if (!ateFood) newSnake.pop();
    else {
      foodRef.current = randomFood(newSnake);
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
      // Speed up every 5 points
      if (scoreRef.current % 5 === 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        const newInterval = Math.max(60, BASE_INTERVAL - scoreRef.current * 2);
        intervalRef.current = setInterval(tick, newInterval);
      }
    }
    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  const endGame = useCallback(() => {
    gameStateRef.current = 'gameover';
    setGameState('gameover');
    if (intervalRef.current) clearInterval(intervalRef.current);
    const hi = Math.max(hiScore, scoreRef.current);
    setHiScore(hi);
    localStorage.setItem('snake-hi', String(hi));
    draw();
  }, [draw, hiScore]);

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood(snakeRef.current);
    scoreRef.current = 0;
    setDisplayScore(0);
    gameStateRef.current = 'playing';
    setGameState('playing');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, BASE_INTERVAL);
    draw();
  }, [tick, draw]);

  useEffect(() => {
    draw();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameStateRef.current !== 'playing') startGame();
        return;
      }
      if (gameStateRef.current !== 'playing') return;
      const dir = dirRef.current;
      const map: Record<string, Dir> = {
        ArrowUp:    { x: 0,  y: -1 },
        ArrowDown:  { x: 0,  y:  1 },
        ArrowLeft:  { x: -1, y:  0 },
        ArrowRight: { x: 1,  y:  0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (!next) return;
      // Prevent reversing
      if (next.x === -dir.x && next.y === -dir.y) return;
      e.preventDefault();
      nextDirRef.current = next;
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [draw, startGame]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, userSelect: 'none' }}>
      {/* Score bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: CANVAS_W, px: 0.5 }}>
        <Typography sx={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
          Score: {displayScore}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
          Best: {hiScore}
        </Typography>
      </Box>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'block' }}
      />

      <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
        {gameState === 'idle' && 'Press Space to start'}
        {gameState === 'playing' && 'Arrow keys or WASD to move'}
        {gameState === 'gameover' && 'Press Space to restart'}
      </Typography>
    </Box>
  );
}
