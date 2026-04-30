import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IOS_WALLPAPERS, useDesktopStore } from '../../store/desktopStore';
import IOSStatusBar from './IOSStatusBar';
import IOSWindow from './IOSWindow';
import AboutApp from '../apps/AboutApp';
import ExperienceApp from '../apps/ExperienceApp';
import ProjectsApp from '../apps/ProjectsApp';
import SkillsApp from '../apps/SkillsApp';
import PublicationsApp from '../apps/PublicationsApp';
import ContactApp from '../apps/ContactApp';
import SnakeApp from '../apps/SnakeApp';
import MinesweeperApp from '../apps/MinesweeperApp';
import TerminalApp from '../apps/TerminalApp';
import ReadMeApp from '../apps/ReadMeApp';
import { APPS } from '../../data/content';
import type { AppId } from '../../store/windowStore';
import '../../styles/ios.css';

// Icon gradient backgrounds per app (iOS-style colored icons)
const ICON_GRADIENTS: Record<AppId, string> = {
  readme:       'linear-gradient(145deg, #5ac8fa, #007aff)',
  about:        'linear-gradient(145deg, #34aadc, #0d7fd6)',
  experience:   'linear-gradient(145deg, #4cd964, #2ecc5a)',
  projects:     'linear-gradient(145deg, #ff9500, #ff6b00)',
  skills:       'linear-gradient(145deg, #8e8e93, #636366)',
  publications: 'linear-gradient(145deg, #ff3b30, #cc2a22)',
  contact:      'linear-gradient(145deg, #5ac8fa, #34aadc)',
  snake:        'linear-gradient(145deg, #4cd964, #34b34a)',
  minesweeper:  'linear-gradient(145deg, #ff9500, #d47f00)',
  terminal:     'linear-gradient(145deg, #1c1c1e, #3a3a3c)',
};

// Dock shows the 4 core portfolio apps
const DOCK_APPS: AppId[] = ['about', 'experience', 'projects', 'contact'];

function renderApp(appId: AppId) {
  switch (appId) {
    case 'about':        return <AboutApp />;
    case 'experience':   return <ExperienceApp />;
    case 'projects':     return <ProjectsApp />;
    case 'skills':       return <SkillsApp />;
    case 'publications': return <PublicationsApp />;
    case 'contact':      return <ContactApp />;
    case 'snake':        return <SnakeApp />;
    case 'minesweeper':  return <MinesweeperApp />;
    case 'terminal':     return <TerminalApp />;
    case 'readme':       return <ReadMeApp />;
    default:             return null;
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
    <div className="ios-app-icon" onClick={() => onOpen(appId)}>
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
  const wallpaperIndex = useDesktopStore((s) => s.iosWallpaperIndex);
  const cycleIOSWallpaper = useDesktopStore((s) => s.cycleIOSWallpaper);

  const handleOpenApp = (id: AppId) => setOpenAppId(id);
  const handleClose = () => setOpenAppId(null);

  // Separate dock apps from grid apps (don't show dock apps twice)
  const gridApps = APPS.filter((a) => !DOCK_APPS.includes(a.id as AppId));
  const dockApps = APPS.filter((a) => DOCK_APPS.includes(a.id as AppId));

  return (
    <div
      className="ios-desktop"
      style={{ background: IOS_WALLPAPERS[wallpaperIndex] }}
    >
      {/* Status Bar */}
      <IOSStatusBar />

      {/* Icon Grid */}
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
      </div>

      {/* Wallpaper switcher — tap to cycle */}
      <div
        onClick={cycleIOSWallpaper}
        style={{
          textAlign: 'center',
          paddingBottom: 4,
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: '-apple-system, sans-serif',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Tap to change wallpaper
      </div>

      {/* Dock */}
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
