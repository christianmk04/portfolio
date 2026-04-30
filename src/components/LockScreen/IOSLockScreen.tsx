import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IOS_WALLPAPERS, useDesktopStore } from '../../store/desktopStore';

interface Props {
  onUnlock: () => void;
}

function formatIOSTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatIOSDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatStatusTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  h = h % 12 || 12;
  return `${h}:${m}`;
}

export default function IOSLockScreen({ onUnlock }: Props) {
  const [time, setTime] = useState(() => formatIOSTime(new Date()));
  const [date, setDate] = useState(() => formatIOSDate(new Date()));
  const [statusTime, setStatusTime] = useState(() => formatStatusTime(new Date()));
  const [unlocking, setUnlocking] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Use the shared iOS wallpaper index from desktopStore
  const iosWallpaperIndex = useDesktopStore((s) => s.iosWallpaperIndex);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(formatIOSTime(now));
      setDate(formatIOSDate(now));
      setStatusTime(formatStatusTime(now));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleUnlock = () => {
    if (unlocking) return;
    setUnlocking(true);
    setTimeout(onUnlock, 160);
  };

  return (
    <motion.div
      key="ios-lockscreen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: '-100%' }}
      transition={{
        opacity: { duration: 0.6, ease: 'easeOut' },
        y: { duration: 0.52, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={handleUnlock}
    >
      {/* ── Background wallpaper — synced with home screen ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: IOS_WALLPAPERS[iosWallpaperIndex],
        }}
      />

      {/* Subtle vignette for text legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Status Bar ── */}
      <div
        style={{
          position: 'relative',
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px 0',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '-0.2px',
          }}
        >
          {statusTime}
        </span>

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {/* Signal */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0"    y="8"   width="3" height="4"   rx="1" fill="white" />
            <rect x="4.5"  y="5.5" width="3" height="6.5" rx="1" fill="white" />
            <rect x="9"    y="3"   width="3" height="9"   rx="1" fill="white" />
            <rect x="13.5" y="0"   width="3" height="12"  rx="1" fill="white" />
          </svg>
          {/* Battery */}
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.4" />
            <rect x="22"  y="3.5" width="2.5" height="5" rx="1.5" fill="white" fillOpacity="0.45" />
            <rect x="2"   y="2"   width="16"  height="8" rx="2"   fill="white" />
          </svg>
        </div>
      </div>

      {/* ── Date + Time (upper area) ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '10px 28px 0',
          flexShrink: 0,
        }}
      >
        {/* Date */}
        <div
          style={{
            fontSize: 17,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.80)',
            letterSpacing: '0.01em',
            textShadow: '0 1px 6px rgba(0,0,0,0.3)',
            marginBottom: 2,
          }}
        >
          {date}
        </div>

        {/* Time — huge, left-aligned, ultra-thin */}
        <div
          style={{
            fontSize: 'clamp(90px, 22vw, 116px)',
            fontWeight: 100,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            textShadow: '0 2px 20px rgba(0,0,0,0.25)',
          }}
        >
          {time}
        </div>
      </motion.div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Central About Me widget ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.75, ease: 'easeOut' }}
        style={{
          position: 'relative',
          margin: '0 20px 20px',
          padding: '16px 18px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
        onClick={(e) => e.stopPropagation()} // don't trigger unlock on widget tap
      >
        {/* Profile photo */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #6366f1 0%, #818cf8 45%, #4f46e5 100%)',
            flexShrink: 0,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          {imgFailed ? (
            <span>👨‍💻</span>
          ) : (
            <img
              src="/profile.jpg"
              alt="Christian"
              onError={() => setImgFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>

        {/* Bio text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.96)',
              letterSpacing: '-0.01em',
              marginBottom: 3,
            }}
          >
            Christian Michael Koh
          </div>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.45,
              letterSpacing: '0.005em',
            }}
          >
            SMU Information Systems · GPA 3.96{'\n'}
            AI/ML Engineer · 6 internships across fintech, healthcare & defense
          </div>
        </div>
      </motion.div>

      {/* ── Bottom area ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
        style={{
          position: 'relative',
          flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        }}
      >
        {/* Swipe-up hint */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 10,
            letterSpacing: '0.02em',
          }}
        >
          Tap anywhere to unlock
        </div>

        {/* Home indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              width: 130,
              height: 5,
              background: 'rgba(255,255,255,0.38)',
              borderRadius: 3,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
