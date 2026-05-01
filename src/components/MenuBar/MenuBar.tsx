import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useClock } from '../../hooks/useClock';
import { useWindowStore } from '../../store/windowStore';
import { useDesktopStore } from '../../store/desktopStore';
import { CONTACT } from '../../data/content';

const COFFEE_NOW_PLAYING = [
  '💻  Building AI agents @ Cinch',
  '📚  Studying for finals',
  '🔀  Reviewing PRs',
  '☕  Coffee & side projects',
  '🚀  Deploying to prod',
];

const DEBUG_NOW_PLAYING = [
  '🐛  Debugging prod at 2am',
  '🔍  Tracing memory leaks',
  '💥  Segfault in main()',
  '🧪  Writing unit tests... eventually',
  '⚠️  undefined is not a function',
];

const NOTIFICATIONS = [
  { id: 1, icon: '🎉', title: 'New internship offer received', body: 'Exciting opportunity in AI/ML engineering', time: '2m ago' },
  { id: 2, icon: '✅', title: 'PR merged: feat/ai-agent-v2', body: 'All checks passed, deployed to staging', time: '1h ago' },
  { id: 3, icon: '📧', title: 'Recruiter from Google reached out', body: 'Saw your portfolio. Impressive work!', time: '3h ago' },
  { id: 4, icon: '🏆', title: "Dean's List AY2024-25 confirmed", body: 'Congratulations on another excellent semester', time: '1d ago' },
  { id: 5, icon: '💡', title: 'New project idea: Portfolio OS', body: 'What if the portfolio itself was an OS?', time: '2d ago' },
  { id: 6, icon: '☕', title: 'Coffee chat scheduled', body: 'Senior engineer @ Stripe, Thursday 3pm', time: '3d ago' },
];

interface WeatherData {
  temperature: number;
  weathercode: number;
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤';
  if (code <= 3) return '☁️';
  if (code <= 48) return '🌫';
  if (code <= 67) return '🌧';
  if (code <= 77) return '🌨';
  if (code <= 82) return '🌦';
  if (code <= 99) return '⛈';
  return '🌤';
}

export default function MenuBar() {
  const time = useClock();
  const openWindow = useWindowStore((s) => s.openWindow);
  const personalityMode = useDesktopStore((s) => s.personalityMode);

  const NOW_PLAYING_ITEMS = personalityMode === 'debug' ? DEBUG_NOW_PLAYING : COFFEE_NOW_PLAYING;

  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Avatar dropdown
  const [showAvatar, setShowAvatar] = useState(false);
  const avatarPanelRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  // Weather
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Battery
  const [batteryPct, setBatteryPct] = useState<number | null>(null);

  // Reset now-playing index when mode changes
  useEffect(() => {
    setNowPlayingIndex(0);
  }, [personalityMode]);

  // Fetch weather from Open-Meteo (Singapore)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&current_weather=true&timezone=Asia%2FSingapore')
      .then((r) => r.json())
      .then((data) => {
        setWeather({
          temperature: Math.round(data.current_weather.temperature),
          weathercode: data.current_weather.weathercode,
        });
      })
      .catch(() => {/* ignore — fallback shown */});
  }, []);

  // Battery API
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number }> };
    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        setBatteryPct(Math.round(battery.level * 100));
      }).catch(() => {});
    }
  }, []);

  // Cycle now-playing every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNowPlayingIndex(prev => (prev + 1) % NOW_PLAYING_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [NOW_PLAYING_ITEMS.length]);

  // Close notif panel on outside click
  useEffect(() => {
    if (!showNotifs) return;
    const handler = (e: MouseEvent) => {
      if (
        notifPanelRef.current &&
        !notifPanelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifs]);

  // Close avatar panel on outside click
  useEffect(() => {
    if (!showAvatar) return;
    const handler = (e: MouseEvent) => {
      if (
        avatarPanelRef.current &&
        !avatarPanelRef.current.contains(e.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target as Node)
      ) {
        setShowAvatar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAvatar]);

  const weatherStr = weather
    ? `${getWeatherIcon(weather.weathercode)} ${weather.temperature}°C`
    : '🌤 --°C';

  const batteryStr = batteryPct !== null ? `🔋 ${batteryPct}%` : '🔋 94%';

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '28px',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '12px',
          background: 'rgba(0, 0, 0, 0.38)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Far left: Apple logo + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Apple logo — opens About This Mac */}
          <button
            onClick={() => openWindow('aboutmac')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              lineHeight: 1,
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.85)',
              transition: 'opacity 0.15s',
            }}
            title="About This Mac"
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >

          </button>

          {/* Avatar button */}
          <button
            ref={avatarRef}
            onClick={() => setShowAvatar(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src="/profile.jpg"
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = 'none';
                  const parent = el.parentElement;
                  if (parent) parent.textContent = '👨‍💻';
                }}
              />
            </div>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
                letterSpacing: '0.01em',
              }}
            >
              Christian Koh
            </Typography>
          </button>

          {/* Weather */}
          <Typography
            sx={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {weatherStr}&nbsp;&nbsp;SGT
          </Typography>
        </Box>

        {/* Centre: now-playing */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '28px',
            width: 220,
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={nowPlayingIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
              }}
            >
              {NOW_PLAYING_ITEMS[nowPlayingIndex]}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Right: battery + wifi + bell + clock */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
            {batteryStr}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.01em' }}>
            ▲ Portfolio_5G
          </Typography>

          <button
            ref={bellRef}
            onClick={() => setShowNotifs(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: showNotifs ? '#fff' : 'rgba(255,255,255,0.6)',
              padding: '0',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => {
              if (!showNotifs) e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            🔔
          </button>

          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.01em',
            }}
          >
            {time}
          </Typography>
        </Box>
      </Box>

      {/* Avatar dropdown */}
      <AnimatePresence>
        {showAvatar && (
          <motion.div
            ref={avatarPanelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              top: '32px',
              left: '12px',
              width: '260px',
              background: 'rgba(20,20,28,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 8999,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.4)',
                border: '2px solid rgba(99,102,241,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                <img
                  src="/profile.jpg"
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) parent.textContent = '👨‍💻';
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Christian Koh</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>SMU IS · GPA 3.96</div>
              </div>
            </div>

            {/* Links */}
            <div style={{ padding: '8px 0' }}>
              <a
                href={`mailto:${CONTACT.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '14px' }}>✉️</span>
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '14px' }}>💼</span>
                LinkedIn
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '14px' }}>🐙</span>
                GitHub
              </a>
            </div>

            {/* Open contact button */}
            <div style={{ padding: '8px 16px 12px' }}>
              <button
                onClick={() => { openWindow('contact'); setShowAvatar(false); }}
                style={{
                  width: '100%',
                  padding: '7px',
                  background: 'rgba(99,102,241,0.25)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  borderRadius: '8px',
                  color: '#818cf8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.38)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.25)')}
              >
                Open Contact App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification panel */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div
            ref={notifPanelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              top: '28px',
              right: '8px',
              width: '320px',
              maxHeight: '480px',
              overflowY: 'auto',
              background: 'rgba(20,20,28,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 8999,
            }}
          >
            {/* Panel header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                Notification Center
              </span>
              <button
                onClick={() => setNotifications([])}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: '#818cf8',
                  padding: '0',
                }}
              >
                Clear
              </button>
            </div>

            {/* Notifications list */}
            {notifications.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                No notifications
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px',
                    borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'default',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(99,102,241,0.2)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      flexShrink: 0,
                    }}
                  >
                    {notif.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', marginLeft: '8px', flexShrink: 0 }}>
                        {notif.time}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      {notif.body}
                    </span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
