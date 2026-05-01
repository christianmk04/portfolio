import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IOS_WALLPAPERS, useDesktopStore } from '../../store/desktopStore';
import IOSStatusBar from './IOSStatusBar';
import IOSWindow from './IOSWindow';
import IOSFolder from './IOSFolder';
import IOSNotificationCenter from './IOSNotificationCenter';
import AboutApp from '../apps/AboutApp';
import ExperienceApp from '../apps/ExperienceApp';
import ProjectsApp from '../apps/ProjectsApp';
import SkillsApp from '../apps/SkillsApp';
import PublicationsApp from '../apps/PublicationsApp';
import ContactApp from '../apps/ContactApp';
import SnakeApp from '../apps/SnakeApp';
import MinesweeperApp from '../apps/MinesweeperApp';
import ReadMeApp from '../apps/ReadMeApp';
import WordleApp from '../apps/WordleApp';
import MastermindApp from '../apps/MastermindApp';
import FlappyBirdApp from '../apps/FlappyBirdApp';
import TwentyFortyEightApp from '../apps/TwentyFortyEightApp';
import ResumeApp from '../apps/ResumeApp';
import IMessageApp from './iMessageApp';
import { APPS } from '../../data/content';
import type { AppId } from '../../store/windowStore';
import '../../styles/ios.css';

// Icon gradient backgrounds per app (iOS-style colored icons)
const ICON_GRADIENTS: Partial<Record<AppId, string>> = {
  imessage: 'linear-gradient(145deg, #34c759 0%, #248a3d 100%)',
  resume:           'linear-gradient(145deg, #ff375f 0%, #c4162a 100%)',
  finder:           'linear-gradient(145deg, #60a5fa, #3b82f6)',
  readme:           'linear-gradient(145deg, #5e5ce6 0%, #3634a3 100%)',
  about:            'linear-gradient(145deg, #bf5af2 0%, #9b3dc8 100%)',
  experience:       'linear-gradient(145deg, #34c759 0%, #248a3d 100%)',
  projects:         'linear-gradient(145deg, #ff9f0a 0%, #b36200 100%)',
  skills:           'linear-gradient(145deg, #636366 0%, #3a3a3c 100%)',
  publications:     'linear-gradient(145deg, #ff6961 0%, #d63b32 100%)',
  contact:          'linear-gradient(145deg, #64d2ff 0%, #0080ff 100%)',
  snake:            'linear-gradient(145deg, #4cd964, #34b34a)',
  minesweeper:      'linear-gradient(145deg, #ff9500, #d47f00)',
  terminal:         'linear-gradient(145deg, #1c1c1e, #3a3a3c)',
  wordle:           'linear-gradient(145deg, #538d4e, #3a6e36)',
  mastermind:       'linear-gradient(145deg, #9b59b6, #7d3c98)',
  flappybird:       'linear-gradient(145deg, #f1c40f, #d4ac0d)',
  twentyfortyeight: 'linear-gradient(145deg, #e67e22, #ca6f1e)',
};

// Grid order: all portfolio apps visible on home screen
const GRID_ORDER: AppId[] = [
  'about', 'experience', 'projects', 'skills',
  'publications', 'contact', 'resume', 'readme',
  'imessage',
];

// Dock: the four most important portfolio apps (also shown in grid above)
const DOCK_APPS: AppId[] = ['about', 'experience', 'projects', 'contact'];

// Arcade folder contents
const ARCADE_APPS: { appId: AppId; icon: string; label: string }[] = [
  { appId: 'snake',            icon: '🐍', label: 'Snake' },
  { appId: 'minesweeper',      icon: '💣', label: 'Minesweeper' },
  { appId: 'wordle',           icon: '🟩', label: 'Wordle' },
  { appId: 'mastermind',       icon: '🎯', label: 'Mastermind' },
  { appId: 'flappybird',       icon: '🐦', label: 'Flappy Bird' },
  { appId: 'twentyfortyeight', icon: '🔢', label: '2048' },
];

function renderApp(appId: AppId) {
  switch (appId) {
    case 'about':            return <AboutApp />;
    case 'experience':       return <ExperienceApp />;
    case 'projects':         return <ProjectsApp />;
    case 'skills':           return <SkillsApp />;
    case 'publications':     return <PublicationsApp />;
    case 'contact':          return <ContactApp />;
    case 'snake':            return <SnakeApp />;
    case 'minesweeper':      return <MinesweeperApp />;
    case 'readme':           return <ReadMeApp />;
    case 'wordle':           return <WordleApp />;
    case 'mastermind':       return <MastermindApp />;
    case 'flappybird':       return <FlappyBirdApp />;
    case 'twentyfortyeight': return <TwentyFortyEightApp />;
    case 'resume':           return <ResumeApp />;
    case 'imessage':         return <IMessageApp />;
    default:                 return null;
  }
}

interface AppIconProps {
  appId: AppId;
  icon: string;
  label: string;
  onOpen: (id: AppId) => void;
  small?: boolean;
}

function AppIcon({ appId, icon, label, onOpen, small }: AppIconProps) {
  const size = small ? 56 : 60;
  const fontSize = small ? 28 : 30;
  const radius = small ? 13 : 14;

  return (
    <div
      className="ios-app-icon"
      onClick={(e) => { e.stopPropagation(); onOpen(appId); }}
    >
      <div
        className="ios-app-icon-img"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: ICON_GRADIENTS[appId] ?? 'linear-gradient(145deg, #555, #333)',
          fontSize,
        }}
      >
        {icon}
      </div>
      <span className="ios-app-icon-label">{label}</span>
    </div>
  );
}

export default function IOSDesktop() {
  const [openAppId, setOpenAppId] = useState<AppId | null>(null);
  const [showNotifCenter, setShowNotifCenter] = useState(false);
  const wallpaperIndex = useDesktopStore((s) => s.iosWallpaperIndex);
  const cycleIOSWallpaper = useDesktopStore((s) => s.cycleIOSWallpaper);
  const swipeTouchRef = useRef<{ x: number; y: number } | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Auto-dismiss the hint after 4 s
  useEffect(() => {
    const t = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleOpenApp = (id: AppId) => setOpenAppId(id);
  const handleClose = () => setOpenAppId(null);

  // Swipe-down from top 80px opens notification center
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeTouchRef.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeTouchRef.current) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - swipeTouchRef.current.y;
    const startY = swipeTouchRef.current.y;
    swipeTouchRef.current = null;
    // Only trigger if swipe started near the top and moved down ≥ 40px
    if (startY < 80 && dy > 40) {
      setShowNotifCenter(true);
    }
  };

  // Build grid from GRID_ORDER; dock from DOCK_APPS
  const gridApps = GRID_ORDER
    .map((id) => APPS.find((a) => a.id === id))
    .filter(Boolean) as typeof APPS[number][];
  const dockApps = APPS.filter((a) => DOCK_APPS.includes(a.id as AppId));

  return (
    <div
      className="ios-desktop"
      style={{ background: IOS_WALLPAPERS[wallpaperIndex] }}
      onClick={cycleIOSWallpaper}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Status Bar — tappable to open Notification Center */}
      <IOSStatusBar
        onClick={() => setShowNotifCenter(true)}
        style={{ cursor: 'pointer' }}
      />

      {/* Swipe-down hint — fades in then out after 4 s, never shown again */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5 }}
            onClick={() => { setShowSwipeHint(false); setShowNotifCenter(true); }}
            style={{
              position: 'absolute',
              top: 28,           // sits flush under the status bar
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              pointerEvents: 'auto',
              zIndex: 50,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {/* Pill bar — mirrors the home indicator at the bottom */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.55)',
            }} />
            {/* Bouncing chevron */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.1, repeat: 3, ease: 'easeInOut' }}
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}
            >
              ›
            </motion.div>
            <div style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: '-apple-system, sans-serif',
              letterSpacing: '0.04em',
            }}>
              Swipe down
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Grid — individual AppIcons stop propagation; grid itself lets background taps through */}
      <div className="ios-icon-grid">
        {gridApps.map((app) => (
          <AppIcon
            key={app.id}
            appId={app.id as AppId}
            icon={app.icon}
            label={app.label}
            onOpen={handleOpenApp}
          />
        ))}
        {/* Arcade folder as regular grid item */}
        <IOSFolder
          label="Arcade"
          apps={ARCADE_APPS}
          onOpenApp={handleOpenApp}
        />
      </div>

      {/* Wallpaper hint */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: 4,
          fontSize: 11,
          color: 'rgba(255,255,255,0.30)',
          fontFamily: '-apple-system, sans-serif',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        Tap background to change wallpaper
      </div>

      {/* Dock — individual AppIcons stop propagation */}
      <div className="ios-dock">
        {dockApps.map((app) => (
          <AppIcon
            key={app.id}
            appId={app.id as AppId}
            icon={app.icon}
            label={app.label}
            onOpen={handleOpenApp}
            small
          />
        ))}
      </div>

      {/* Home indicator */}
      <div className="ios-home-indicator">
        <div className="ios-home-indicator-bar" />
      </div>

      {/* Notification Center */}
      <AnimatePresence>
        {showNotifCenter && (
          <IOSNotificationCenter onClose={() => setShowNotifCenter(false)} />
        )}
      </AnimatePresence>

      {/* Full-screen app window */}
      <AnimatePresence>
        {openAppId && (
          <IOSWindow key={openAppId} appId={openAppId} onClose={handleClose}>
            {renderApp(openAppId)}
          </IOSWindow>
        )}
      </AnimatePresence>
    </div>
  );
}
