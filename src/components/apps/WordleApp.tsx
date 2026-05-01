import { useState, useEffect, useCallback } from 'react';

const WORD_LIST = [
  'CRANE','LIGHT','SOUND','HEART','BRAVE','STORM','PLANT','FLAME','SPACE','TIGER',
  'WORLD','SUGAR','MUSIC','WATER','GLASS','STEEL','NIGHT','CLOUD','FRUIT','MAGIC',
  'STONE','BRUSH','DANCE','TRACK','GRAND','CLOCK','SHIFT','FLOOR','GRAIN','PEARL',
];

type LetterResult = 'correct' | 'present' | 'absent';
type GameState = 'playing' | 'won' | 'lost';

function getRandomWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function evaluateGuess(guess: string, answer: string): LetterResult[] {
  const result: LetterResult[] = Array(5).fill('absent');
  const answerArr = answer.split('');
  const remaining: (string | null)[] = [...answerArr];

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      remaining[i] = null;
    }
  }
  // Second pass: present but wrong position
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = 'present';
      remaining[idx] = null;
    }
  }
  return result;
}

const TILE_COLORS: Record<LetterResult, string> = {
  correct: '#4ade80',
  present: '#facc15',
  absent:  '#374151',
};

const KEY_BG: Record<LetterResult, string> = {
  correct: '#4ade80',
  present: '#facc15',
  absent:  '#4b5563',
};

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

export default function WordleApp() {
  const [answer, setAnswer] = useState(getRandomWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [shake, setShake] = useState(false);

  const letterStatuses = useCallback((): Record<string, LetterResult> => {
    const map: Record<string, LetterResult> = {};
    guesses.forEach((g, gi) => {
      g.split('').forEach((ch, ci) => {
        const r = results[gi]?.[ci];
        if (!r) return;
        const prev = map[ch];
        if (prev === 'correct') return;
        if (prev === 'present' && r !== 'correct') return;
        map[ch] = r;
      });
    });
    return map;
  }, [guesses, results]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5 || gameState !== 'playing') return;
    const res = evaluateGuess(currentGuess, answer);
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, res];
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    if (currentGuess === answer) {
      setGameState('won');
    } else if (newGuesses.length >= 6) {
      setGameState('lost');
    }
  }, [currentGuess, answer, guesses, results, gameState]);

  const handleKey = useCallback((key: string) => {
    if (gameState !== 'playing') return;
    if (key === 'ENTER' || key === 'Enter') {
      if (currentGuess.length < 5) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }
      submitGuess();
    } else if (key === '⌫' || key === 'Backspace') {
      setCurrentGuess((g) => g.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((g) => g + key.toUpperCase());
    }
  }, [gameState, currentGuess, submitGuess]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKey]);

  const newGame = () => {
    setAnswer(getRandomWord());
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setGameState('playing');
  };

  const statuses = letterStatuses();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 12, background: '#0d1117', padding: '16px 12px',
      fontFamily: 'monospace', userSelect: 'none', minHeight: 460,
    }}>
      <div style={{ color: '#4ade80', fontSize: 18, fontWeight: 700, letterSpacing: 4 }}>
        WORDLE
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Array.from({ length: 6 }).map((_, rowIdx) => {
          const isCurrentRow = rowIdx === guesses.length && gameState === 'playing';
          const guess = rowIdx < guesses.length ? guesses[rowIdx] : (isCurrentRow ? currentGuess : '');
          const rowResults = results[rowIdx];
          const isShaking = isCurrentRow && shake;

          return (
            <div
              key={rowIdx}
              style={{
                display: 'flex', gap: 6,
                animation: isShaking ? 'shake 0.4s ease' : undefined,
              }}
            >
              {Array.from({ length: 5 }).map((_, colIdx) => {
                const letter = guess[colIdx] ?? '';
                const res = rowResults?.[colIdx];
                const bg = res ? TILE_COLORS[res] : (letter ? 'rgba(255,255,255,0.1)' : 'transparent');
                const border = res
                  ? 'none'
                  : letter
                    ? '2px solid rgba(255,255,255,0.4)'
                    : '2px solid rgba(255,255,255,0.15)';
                const textColor = res === 'correct' || res === 'present'
                  ? '#0d1117'
                  : res === 'absent'
                    ? 'rgba(255,255,255,0.7)'
                    : '#fff';

                return (
                  <div
                    key={colIdx}
                    style={{
                      width: 44, height: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 700, letterSpacing: 1,
                      background: bg, border, borderRadius: 4,
                      color: textColor,
                      transition: 'background 0.2s',
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      {gameState === 'won' && (
        <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>
          SOLVED! {answer}
        </div>
      )}
      {gameState === 'lost' && (
        <div style={{ color: '#f87171', fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>
          GAME OVER · answer: {answer}
        </div>
      )}

      {/* On-screen keyboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {row.map((key) => {
              const status = statuses[key];
              const bg = status ? KEY_BG[status] : 'rgba(255,255,255,0.12)';
              const textColor = status === 'correct' || status === 'present' ? '#0d1117' : '#fff';
              const isWide = key === 'ENTER' || key === '⌫';
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  style={{
                    width: isWide ? 52 : 32, height: 40,
                    background: bg, color: textColor,
                    border: 'none', borderRadius: 4,
                    fontSize: isWide ? 10 : 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'monospace',
                    transition: 'background 0.15s',
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* New game button */}
      <button
        onClick={newGame}
        style={{
          marginTop: 4, padding: '6px 18px', background: 'rgba(74,222,128,0.15)',
          color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)',
          borderRadius: 4, cursor: 'pointer', fontSize: 12,
          fontFamily: 'monospace', fontWeight: 600, letterSpacing: 1,
        }}
      >
        NEW GAME
      </button>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
