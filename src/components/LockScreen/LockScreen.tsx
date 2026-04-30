import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WALLPAPERS } from '../../store/desktopStore';

interface Props {
  onUnlock: () => void;
}

function formatLockTime(d: Date): string {
  // 24-hour format: "17:09" — matches macOS Sonoma lock screen aesthetic
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatLockDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function LockScreen({ onUnlock }: Props) {
  const [time, setTime] = useState(() => formatLockTime(new Date()));
  const [date, setDate] = useState(() => formatLockDate(new Date()));
  const [hovered, setHovered] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(formatLockTime(now));
      setDate(formatLockDate(now));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleUnlock = () => {
    if (unlocking) return;
    setUnlocking(true);
    setTimeout(onUnlock, 220);
  };

  return (
    <motion.div
      key="mac-lockscreen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        overflow: 'hidden',
        cursor: 'default',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: '-100%' }}
      transition={{
        opacity: { duration: 1.0, ease: 'easeOut' },
        y: { duration: 0.68, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {/* ── Clear wallpaper (no blur) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: WALLPAPERS[0],
        }}
      />

      {/* Very subtle dark gradient at top/bottom for text legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.28) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Layout ── */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── Date + Time (top area, ~12–14% from top) ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '10vh',
            gap: 2,
          }}
        >
          {/* Date */}
          <div
            style={{
              fontSize: 'clamp(16px, 2vw, 21px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.82)',
              letterSpacing: '0.01em',
              fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
              textShadow: '0 1px 8px rgba(0,0,0,0.45)',
            }}
          >
            {date}
          </div>

          {/* Time */}
          <div
            style={{
              fontSize: 'clamp(96px, 14vw, 140px)',
              fontWeight: 100,
              color: 'rgba(255,255,255,0.94)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
              textShadow: '0 2px 32px rgba(0,0,0,0.35)',
            }}
          >
            {time}
          </div>
        </motion.div>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Profile (bottom, ~18% from bottom) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            marginBottom: '10vh',
            cursor: 'pointer',
          }}
          onClick={handleUnlock}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Avatar */}
          <motion.div
            animate={{
              scale: unlocking ? 0.9 : hovered ? 1.08 : 1,
              boxShadow: hovered
                ? '0 0 0 3px rgba(255,255,255,0.45), 0 8px 28px rgba(0,0,0,0.45)'
                : '0 0 0 2px rgba(255,255,255,0.18), 0 4px 18px rgba(0,0,0,0.38)',
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #6366f1 0%, #818cf8 45%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              userSelect: 'none',
              overflow: 'hidden',
            }}
          >
            {imgFailed ? (
              <span>👨‍💻</span>
            ) : (
              <img
                src="/profile.jpg"
                alt="Christian"
                onError={() => setImgFailed(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            )}
          </motion.div>

          {/* Name */}
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: '0.005em',
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}
          >
            Christian Michael Koh
          </div>

          {/* Hint */}
          <motion.div
            animate={{ opacity: hovered ? 0.85 : 0.5 }}
            transition={{ duration: 0.18 }}
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Click to Enter</span>
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
