import { useState, useEffect, useCallback, useRef } from 'react';

const TILE_COLORS: Record<number, string> = {
  2:    '#eee4da',
  4:    '#ede0c8',
  8:    '#f2b179',
  16:   '#f59563',
  32:   '#f67c5f',
  64:   '#f65e3b',
  128:  '#edcf72',
  256:  '#edcc61',
  512:  '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

function getTileColor(v: number): string {
  return TILE_COLORS[v] ?? '#3d3a33';
}

function getTileTextColor(v: number): string {
  return v <= 4 ? '#776e65' : '#f9f6f2';
}

function getTileFontSize(v: number): number {
  if (v >= 1024) return 16;
  if (v >= 128) return 20;
  return 24;
}

type Grid = (number | null)[][];

function emptyGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

function addRandom(grid: Grid): Grid {
  const empties: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (grid[r][c] === null) empties.push([r, c]);
  if (empties.length === 0) return grid;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function initGrid(): Grid {
  let g = emptyGrid();
  g = addRandom(g);
  g = addRandom(g);
  return g;
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; gained: number } {
  const vals = row.filter((v): v is number => v !== null);
  let gained = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      const val = vals[i] * 2;
      merged.push(val);
      gained += val;
      i += 2;
    } else {
      merged.push(vals[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged.map((v) => (v === 0 ? null : v)), gained };
}

type Direction = 'left' | 'right' | 'up' | 'down';

function moveGrid(grid: Grid, dir: Direction): { grid: Grid; gained: number; moved: boolean } {
  let totalGained = 0;
  let moved = false;
  let rows = grid.map((row) => [...row]);

  const transpose = (g: Grid): Grid =>
    Array.from({ length: 4 }, (_, c) => Array.from({ length: 4 }, (_, r) => g[r][c]));
  const reverseRows = (g: Grid): Grid => g.map((row) => [...row].reverse());

  if (dir === 'right') rows = reverseRows(rows);
  if (dir === 'up') rows = transpose(rows);
  if (dir === 'down') { rows = transpose(rows); rows = reverseRows(rows); }

  const newRows = rows.map((row) => {
    const { row: newRow, gained } = slideRow(row);
    totalGained += gained;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });

  let result = newRows;
  if (dir === 'right') result = reverseRows(result);
  if (dir === 'up') result = transpose(result);
  if (dir === 'down') { result = reverseRows(result); result = transpose(result); }

  return { grid: result, gained: totalGained, moved };
}

function hasMovesLeft(grid: Grid): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === null) return true;
      if (c + 1 < 4 && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < 4 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((v) => v === 2048));
}

export default function TwentyFortyEightApp() {
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() =>
    parseInt(localStorage.getItem('2048-best') ?? '0', 10)
  );
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [wonDismissed, setWonDismissed] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const move = useCallback((dir: Direction) => {
    setGrid((prev) => {
      const { grid: next, gained, moved } = moveGrid(prev, dir);
      if (!moved) return prev;
      const withNew = addRandom(next);
      setScore((s) => {
        const newScore = s + gained;
        setBestScore((b) => {
          const newBest = Math.max(b, newScore);
          localStorage.setItem('2048-best', String(newBest));
          return newBest;
        });
        return newScore;
      });
      if (hasWon(withNew)) setWon(true);
      if (!hasMovesLeft(withNew)) setGameOver(true);
      return withNew;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowLeft: 'left', ArrowRight: 'right',
        ArrowUp: 'up', ArrowDown: 'down',
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      if (gameOver) return;
      move(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, gameOver]);

  const newGame = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setWonDismissed(false);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: '#0d1117', padding: '14px 12px',
    fontFamily: 'monospace', userSelect: 'none',
    gap: 10, minHeight: 460,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 328 }}>
        <div style={{ color: '#4ade80', fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>2048</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ label: 'SCORE', value: score }, { label: 'BEST', value: bestScore }].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.07)', borderRadius: 6,
              padding: '4px 10px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{label}</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>{value}</div>
            </div>
          ))}
          <button
            onClick={newGame}
            style={{
              padding: '4px 10px', background: 'rgba(74,222,128,0.15)',
              color: '#4ade80', border: '1px solid rgba(74,222,128,0.35)',
              borderRadius: 6, cursor: 'pointer', fontSize: 11,
              fontFamily: 'monospace', fontWeight: 600, alignSelf: 'stretch',
            }}
          >
            NEW
          </button>
        </div>
      </div>

      {/* Win banner */}
      {won && !wonDismissed && (
        <div style={{
          background: 'rgba(237,207,114,0.15)', border: '1px solid rgba(237,207,114,0.5)',
          borderRadius: 6, padding: '6px 16px', color: '#edcf72',
          fontSize: 13, fontWeight: 700, letterSpacing: 2,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          YOU WIN! 2048 reached
          <button
            onClick={() => setWonDismissed(true)}
            style={{
              background: 'transparent', border: '1px solid rgba(237,207,114,0.4)',
              color: '#edcf72', cursor: 'pointer', fontSize: 10,
              borderRadius: 3, padding: '2px 6px', fontFamily: 'monospace',
            }}
          >
            CONTINUE
          </button>
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 72px)',
          gap: 8, background: 'rgba(255,255,255,0.06)',
          padding: 8, borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStartRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (!touchStartRef.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStartRef.current.x;
          const dy = t.clientY - touchStartRef.current.y;
          touchStartRef.current = null;
          if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
          if (gameOver) return;
          let dir: Direction;
          if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
          } else {
            dir = dy > 0 ? 'down' : 'up';
          }
          move(dir);
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: 72, height: 72,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: val ? getTileColor(val) : 'rgba(255,255,255,0.04)',
                border: val ? 'none' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                fontSize: val ? getTileFontSize(val) : 14,
                fontWeight: 700,
                color: val ? getTileTextColor(val) : 'transparent',
                transition: 'background 0.1s',
              }}
            >
              {val ?? ''}
            </div>
          ))
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 8,
            background: 'rgba(13,17,23,0.8)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <div style={{ color: '#f87171', fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>GAME OVER</div>
            <button
              onClick={newGame}
              style={{
                padding: '6px 16px', background: 'rgba(74,222,128,0.2)',
                color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)',
                borderRadius: 4, cursor: 'pointer', fontSize: 12,
                fontFamily: 'monospace', fontWeight: 600,
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
        Arrow keys or swipe to slide tiles
      </div>
    </div>
  );
}
