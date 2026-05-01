import { useEffect, useRef, useCallback } from 'react';

const W = 320;
const H = 480;
const BIRD_X = 70;
const BIRD_R = 14;
const GRAVITY = 0.4;
const FLAP_VEL = -7;
const PIPE_W = 60;
const PIPE_GAP = 140;
const PIPE_SPEED = 2;
const PIPE_INTERVAL = 90;

type GamePhase = 'idle' | 'playing' | 'dead';

interface Pipe {
  x: number;
  topH: number;
}

interface GameState {
  phase: GamePhase;
  birdY: number;
  birdVY: number;
  pipes: Pipe[];
  score: number;
  frame: number;
  hiScore: number;
}

function initialState(hiScore: number): GameState {
  return {
    phase: 'idle',
    birdY: H / 2,
    birdVY: 0,
    pipes: [],
    score: 0,
    frame: 0,
    hiScore,
  };
}

export default function FlappyBirdApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(
    initialState(parseInt(localStorage.getItem('flappy-hi') ?? '0', 10))
  );
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = stateRef.current;

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Ground line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();

    // Pipes
    s.pipes.forEach((p) => {
      ctx.fillStyle = '#4ade80';
      // Top pipe
      ctx.fillRect(p.x, 0, PIPE_W, p.topH);
      // Top pipe cap
      ctx.fillRect(p.x - 4, p.topH - 14, PIPE_W + 8, 14);
      // Bottom pipe
      const bottomY = p.topH + PIPE_GAP;
      ctx.fillRect(p.x, bottomY, PIPE_W, H - 30 - bottomY);
      // Bottom pipe cap
      ctx.fillRect(p.x - 4, bottomY, PIPE_W + 8, 14);
    });

    // Bird
    const bx = BIRD_X;
    const by = s.birdY;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(bx, by, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    // Bird eye
    ctx.fillStyle = '#0d1117';
    ctx.beginPath();
    ctx.arc(bx + 5, by - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bx + 6, by - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(bx + BIRD_R - 2, by);
    ctx.lineTo(bx + BIRD_R + 8, by + 2);
    ctx.lineTo(bx + BIRD_R - 2, by + 5);
    ctx.closePath();
    ctx.fill();

    // Score
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(s.score), W / 2, 44);

    // Hi score
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px monospace';
    ctx.fillText(`BEST: ${s.hiScore}`, W / 2, 64);

    if (s.phase === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FLAPPY BIRD', W / 2, H / 2 - 24);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px monospace';
      ctx.fillText('Tap / Space to flap', W / 2, H / 2 + 8);
    }

    if (s.phase === 'dead') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 28);
      ctx.fillStyle = '#fff';
      ctx.font = '18px monospace';
      ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 4);
      if (s.score >= s.hiScore && s.score > 0) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('NEW BEST!', W / 2, H / 2 + 26);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '13px monospace';
      ctx.fillText('Tap / Space to restart', W / 2, H / 2 + 50);
    }
  }, []);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === 'idle') {
      stateRef.current = { ...s, phase: 'playing', birdVY: FLAP_VEL };
    } else if (s.phase === 'playing') {
      stateRef.current = { ...s, birdVY: FLAP_VEL };
    } else if (s.phase === 'dead') {
      stateRef.current = initialState(s.hiScore);
    }
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;

    if (s.phase === 'playing') {
      const newVY = s.birdVY + GRAVITY;
      const newBirdY = s.birdY + newVY;
      const newFrame = s.frame + 1;

      // New pipe
      let newPipes = s.pipes.map((p) => ({ ...p, x: p.x - PIPE_SPEED })).filter((p) => p.x > -PIPE_W - 10);
      if (newFrame % PIPE_INTERVAL === 0) {
        const topH = 60 + Math.floor(Math.random() * (H - 30 - PIPE_GAP - 120));
        newPipes = [...newPipes, { x: W, topH }];
      }

      // Score: pipe passed
      let newScore = s.score;
      newPipes.forEach((p) => {
        const wasLeft = p.x + PIPE_W + PIPE_SPEED >= BIRD_X && p.x + PIPE_W < BIRD_X;
        if (wasLeft) newScore++;
      });

      // Collision: ground / ceiling
      let dead = newBirdY + BIRD_R > H - 30 || newBirdY - BIRD_R < 0;

      // Collision: pipes
      if (!dead) {
        for (const p of newPipes) {
          if (BIRD_X + BIRD_R > p.x + 4 && BIRD_X - BIRD_R < p.x + PIPE_W - 4) {
            if (newBirdY - BIRD_R < p.topH || newBirdY + BIRD_R > p.topH + PIPE_GAP) {
              dead = true;
              break;
            }
          }
        }
      }

      if (dead) {
        const hiScore = Math.max(newScore, s.hiScore);
        localStorage.setItem('flappy-hi', String(hiScore));
        stateRef.current = { ...s, birdY: newBirdY, birdVY: newVY, pipes: newPipes, score: newScore, frame: newFrame, phase: 'dead', hiScore };
      } else {
        stateRef.current = { ...s, birdY: newBirdY, birdVY: newVY, pipes: newPipes, score: newScore, frame: newFrame };
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', onKey);

    const canvas = canvasRef.current;
    const onTouch = (e: TouchEvent) => { e.preventDefault(); flap(); };
    if (canvas) canvas.addEventListener('touchstart', onTouch, { passive: false });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKey);
      if (canvas) canvas.removeEventListener('touchstart', onTouch);
    };
  }, [loop, flap]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: '#0d1117', padding: 0, userSelect: 'none',
    }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={flap}
        style={{ display: 'block', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
      />
    </div>
  );
}
