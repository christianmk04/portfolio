import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography } from '@mui/material';

type Cell = { isMine: boolean; isRevealed: boolean; isFlagged: boolean; adjacentMines: number };
type GameState = 'idle' | 'playing' | 'won' | 'lost';
type Difficulty = 'beginner' | 'intermediate';

const CONFIGS = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
};

const ADJACENT_MINE_COLORS = ['', '#3b82f6','#22c55e','#ef4444','#7c3aed','#b91c1c','#0891b2','#000','#6b7280'];

function makeEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 }))
  );
}

function placeMines(grid: Cell[][], rows: number, cols: number, mines: number, safeR: number, safeC: number): Cell[][] {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (next[r][c].isMine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    next[r][c].isMine = true;
    placed++;
  }
  // Count adjacents
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr; const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].isMine) count++;
      }
      next[r][c].adjacentMines = count;
    }
  }
  return next;
}

function floodReveal(grid: Cell[][], rows: number, cols: number, r: number, c: number): Cell[][] {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })));
  const queue: [number, number][] = [[r, c]];
  while (queue.length) {
    const [cr, cc] = queue.shift()!;
    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
    const cell = next[cr][cc];
    if (cell.isRevealed || cell.isFlagged || cell.isMine) continue;
    cell.isRevealed = true;
    if (cell.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        queue.push([cr + dr, cc + dc]);
      }
    }
  }
  return next;
}

export default function MinesweeperApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const { rows, cols, mines } = CONFIGS[difficulty];

  const [grid, setGrid] = useState<Cell[][]>(() => makeEmptyGrid(rows, cols));
  const [gameState, setGameState] = useState<GameState>('idle');
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback((diff: Difficulty = difficulty) => {
    const cfg = CONFIGS[diff];
    setGrid(makeEmptyGrid(cfg.rows, cfg.cols));
    setGameState('idle');
    setFlagCount(0);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [difficulty]);

  useEffect(() => { reset(difficulty); }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setTimer((t) => Math.min(t + 1, 999)), 1000);
  };

  const checkWin = (g: Cell[][]) => {
    const revealed = g.flat().filter((c) => c.isRevealed).length;
    return revealed === rows * cols - mines;
  };

  const handleClick = (r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    let current = grid;
    if (gameState === 'idle') {
      current = placeMines(grid, rows, cols, mines, r, c);
      setGameState('playing');
      startTimer();
    }

    if (current[r][c].isMine) {
      // Reveal all mines
      const boom = current.map((row) => row.map((cell) =>
        cell.isMine ? { ...cell, isRevealed: true } : cell
      ));
      setGrid(boom);
      setGameState('lost');
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }

    const revealed = floodReveal(current, rows, cols, r, c);
    setGrid(revealed);
    if (checkWin(revealed)) {
      setGameState('won');
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;
    const next = grid.map((row) => row.map((c) => ({ ...c })));
    next[r][c].isFlagged = !next[r][c].isFlagged;
    setFlagCount((f) => f + (next[r][c].isFlagged ? 1 : -1));
    setGrid(next);
  };

  const smiley = gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂';
  const cellSize = difficulty === 'beginner' ? 30 : 20;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, userSelect: 'none' }}>
      {/* Difficulty toggle */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {(['beginner', 'intermediate'] as Difficulty[]).map((d) => (
          <Box
            key={d}
            onClick={() => { setDifficulty(d); reset(d); }}
            sx={{
              px: 1.5, py: 0.5, borderRadius: 1, cursor: 'pointer', fontSize: 11, fontWeight: 600,
              textTransform: 'capitalize',
              background: difficulty === d ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${difficulty === d ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: difficulty === d ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.15s ease',
            }}
          >
            {d}
          </Box>
        ))}
      </Box>

      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: cols * cellSize, px: 1,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 1.5, py: 0.75,
      }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, minWidth: 40, color: '#f87171' }}>
          💣 {Math.max(0, mines - flagCount)}
        </Typography>
        <Box onClick={() => reset()} sx={{ fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>{smiley}</Box>
        <Typography sx={{ fontSize: 13, fontWeight: 700, minWidth: 40, textAlign: 'right', color: '#4ade80' }}>
          ⏱ {String(timer).padStart(3, '0')}
        </Typography>
      </Box>

      {/* Grid */}
      <Box
        sx={{ display: 'inline-grid', gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gap: '2px' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const bg = cell.isRevealed
              ? cell.isMine ? '#7f1d1d' : 'rgba(255,255,255,0.07)'
              : 'rgba(255,255,255,0.12)';
            return (
              <Box
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                sx={{
                  width: cellSize, height: cellSize,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: cellSize > 24 ? 14 : 10,
                  fontWeight: 700,
                  background: bg,
                  border: `1px solid ${cell.isRevealed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '3px',
                  cursor: cell.isRevealed ? 'default' : 'pointer',
                  color: cell.adjacentMines > 0 ? ADJACENT_MINE_COLORS[cell.adjacentMines] : 'transparent',
                  transition: 'background 0.1s ease',
                  '&:hover': !cell.isRevealed ? { background: 'rgba(255,255,255,0.2)' } : {},
                }}
              >
                {cell.isRevealed && cell.isMine && '💥'}
                {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && cell.adjacentMines}
                {!cell.isRevealed && cell.isFlagged && '🚩'}
              </Box>
            );
          })
        )}
      </Box>

      {(gameState === 'won' || gameState === 'lost') && (
        <Typography sx={{ fontSize: 13, color: gameState === 'won' ? '#4ade80' : '#f87171', fontWeight: 600 }}>
          {gameState === 'won' ? '🎉 You win! Click 🙂 to play again' : '💥 Game over! Click 🙂 to retry'}
        </Typography>
      )}
      {gameState === 'idle' && (
        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          Click to reveal · Right-click to flag
        </Typography>
      )}
    </Box>
  );
}
