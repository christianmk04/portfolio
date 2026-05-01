import { useState, useCallback } from 'react';

const COLORS = ['#ef4444', '#f97316', '#facc15', '#4ade80', '#60a5fa', '#a78bfa'] as const;
const COLOR_NAMES = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'] as const;
const CODE_LENGTH = 4;
const MAX_GUESSES = 10;

type Color = typeof COLORS[number];

function generateCode(): Color[] {
  return Array.from({ length: CODE_LENGTH }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
}

function evaluateGuess(guess: Color[], code: Color[]): { black: number; white: number } {
  let black = 0;
  let white = 0;
  const codeRemaining: (Color | null)[] = [...code];
  const guessRemaining: (Color | null)[] = [...guess];

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === code[i]) {
      black++;
      codeRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessRemaining[i] === null) continue;
    const idx = codeRemaining.indexOf(guessRemaining[i]!);
    if (idx !== -1) {
      white++;
      codeRemaining[idx] = null;
    }
  }
  return { black, white };
}

type Row = { guess: Color[]; black: number; white: number };

export default function MastermindApp() {
  const [code, setCode] = useState<Color[]>(generateCode);
  const [rows, setRows] = useState<Row[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Color[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [revealed, setRevealed] = useState(false);

  const selectColor = (color: Color) => {
    if (gameState !== 'playing' || currentGuess.length >= CODE_LENGTH) return;
    setCurrentGuess((g) => [...g, color]);
  };

  const removeLast = () => {
    if (gameState !== 'playing') return;
    setCurrentGuess((g) => g.slice(0, -1));
  };

  const submit = useCallback(() => {
    if (currentGuess.length !== CODE_LENGTH || gameState !== 'playing') return;
    const { black, white } = evaluateGuess(currentGuess, code);
    const newRows = [...rows, { guess: currentGuess, black, white }];
    setRows(newRows);
    setCurrentGuess([]);

    if (black === CODE_LENGTH) {
      setGameState('won');
      setRevealed(true);
    } else if (newRows.length >= MAX_GUESSES) {
      setGameState('lost');
      setRevealed(true);
    }
  }, [currentGuess, code, rows, gameState]);

  const newGame = () => {
    setCode(generateCode());
    setRows([]);
    setCurrentGuess([]);
    setGameState('playing');
    setRevealed(false);
  };

  const Peg = ({ color, size = 18 }: { color?: string; size?: number }) => (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color ?? 'rgba(255,255,255,0.08)',
      border: color ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
      flexShrink: 0,
    }} />
  );

  const FeedbackPegs = ({ black, white }: { black: number; white: number }) => {
    const pegs = [
      ...Array(black).fill('black'),
      ...Array(white).fill('white'),
      ...Array(CODE_LENGTH - black - white).fill('empty'),
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 28 }}>
        {pegs.map((p, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: p === 'black' ? '#1f2937' : p === 'white' ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
            border: p === 'empty' ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }} />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 10, background: '#0d1117', padding: '14px 12px',
      fontFamily: 'monospace', userSelect: 'none', minHeight: 460,
    }}>
      <div style={{ color: '#4ade80', fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>
        MASTERMIND
      </div>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
        Guess the hidden code · {MAX_GUESSES - rows.length} tries left
      </div>

      {/* Secret code display */}
      <div style={{
        display: 'flex', gap: 6, padding: '6px 10px',
        background: 'rgba(255,255,255,0.04)', borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {code.map((c, i) => (
          revealed
            ? <Peg key={i} color={c} size={20} />
            : <div key={i} style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }} />
        ))}
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, alignSelf: 'center', marginLeft: 4 }}>
          {revealed ? 'ANSWER' : '????'}
        </div>
      </div>

      {/* Previous rows */}
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4, width: '100%', alignItems: 'center' }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', width: 16, textAlign: 'right' }}>
              {ri + 1}
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {row.guess.map((c, ci) => <Peg key={ci} color={c} />)}
            </div>
            <FeedbackPegs black={row.black} white={row.white} />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 60 }}>
              {row.black}B {row.white}W
            </div>
          </div>
        ))}
      </div>

      {/* Current guess row */}
      {gameState === 'playing' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', borderRadius: 6,
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.25)',
        }}>
          <div style={{ fontSize: 10, color: '#4ade80', width: 16, textAlign: 'right' }}>
            {rows.length + 1}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              currentGuess[i]
                ? <Peg key={i} color={currentGuess[i]} />
                : <div key={i} style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px dashed rgba(74,222,128,0.4)',
                  }} />
            ))}
          </div>
          <div style={{ width: 28 }} /> {/* placeholder for feedback pegs */}
        </div>
      )}

      {/* Status */}
      {gameState === 'won' && (
        <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>
          CRACKED IT in {rows.length}!
        </div>
      )}
      {gameState === 'lost' && (
        <div style={{ color: '#f87171', fontWeight: 700, fontSize: 13 }}>
          GAME OVER · code revealed above
        </div>
      )}

      {/* Color palette */}
      {gameState === 'playing' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {COLORS.map((c, i) => (
            <button
              key={c}
              title={COLOR_NAMES[i]}
              onClick={() => selectColor(c)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: c, border: '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {gameState === 'playing' && (
          <>
            <button
              onClick={removeLast}
              disabled={currentGuess.length === 0}
              style={{
                padding: '5px 12px', background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4, cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
              }}
            >
              ⌫ DELETE
            </button>
            <button
              onClick={submit}
              disabled={currentGuess.length !== CODE_LENGTH}
              style={{
                padding: '5px 12px',
                background: currentGuess.length === CODE_LENGTH ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.04)',
                color: currentGuess.length === CODE_LENGTH ? '#4ade80' : 'rgba(255,255,255,0.25)',
                border: `1px solid ${currentGuess.length === CODE_LENGTH ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 4, cursor: currentGuess.length === CODE_LENGTH ? 'pointer' : 'not-allowed',
                fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
              }}
            >
              SUBMIT
            </button>
          </>
        )}
        <button
          onClick={newGame}
          style={{
            padding: '5px 12px', background: 'rgba(74,222,128,0.1)',
            color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: 4, cursor: 'pointer', fontSize: 11,
            fontFamily: 'monospace', fontWeight: 600,
          }}
        >
          NEW GAME
        </button>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 2 }}>
        Black peg = right colour + right position · White peg = right colour, wrong position
      </div>
    </div>
  );
}
