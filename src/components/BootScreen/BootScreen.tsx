import { useEffect, useRef } from 'react';
import { useAnimate } from 'framer-motion';
import { Typography } from '@mui/material';

interface Props {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: Props) {
  const [scope, animate] = useAnimate();
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function run() {
      if (!nameRef.current || !subtitleRef.current || !dotRef.current || !scope.current) return;

      // Start everything invisible
      await animate(nameRef.current, { opacity: 1, y: 0 }, { duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] });
      await animate(subtitleRef.current, { opacity: 1 }, { duration: 0.5, ease: 'easeOut' });
      await animate(dotRef.current, { opacity: 1, scale: 1 }, { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] });
      // Hold
      await new Promise((r) => setTimeout(r, 900));
      // Fade out
      await animate(scope.current, { opacity: 0 }, { duration: 0.55, ease: 'easeIn' });
      onComplete();
    }
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={scope}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #080810 0%, #0a0f20 100%)',
        gap: 12,
      }}
    >
      <div
        ref={nameRef}
        style={{ opacity: 0, transform: 'translateY(16px)' }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '2.75rem' },
          }}
        >
          Christian Michael Koh
        </Typography>
      </div>

      <div ref={subtitleRef} style={{ opacity: 0 }}>
        <Typography
          sx={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textAlign: 'center',
            fontWeight: 300,
          }}
        >
          Portfolio
        </Typography>
      </div>

      <div
        ref={dotRef}
        style={{
          opacity: 0,
          transform: 'scale(0.5)',
          marginTop: 24,
          display: 'flex',
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.35)',
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
