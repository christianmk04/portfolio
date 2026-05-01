import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import MenuBar from '../MenuBar/MenuBar';
import Dock from '../Dock/Dock';
import Window from '../Window/Window';
import DesktopIcon from './DesktopIcon';
import ContextMenu from './ContextMenu';
import StickyNote from './StickyNote';
import MissionControl from './MissionControl';
import Spotlight from '../Spotlight/Spotlight';
import ToastNotification from '../Toast/ToastNotification';
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
import WordleApp from '../apps/WordleApp';
import MastermindApp from '../apps/MastermindApp';
import FlappyBirdApp from '../apps/FlappyBirdApp';
import TwentyFortyEightApp from '../apps/TwentyFortyEightApp';
import ResumeApp from '../apps/ResumeApp';
import FinderApp from '../apps/FinderApp';
import GamesApp from '../apps/GamesApp';
import AboutThisMacApp from '../apps/AboutThisMacApp';
import SystemPreferencesApp from '../apps/SystemPreferencesApp';
import { VISIBLE_APPS } from '../../data/content';
import { useWindowStore, type AppId } from '../../store/windowStore';
import { useDesktopStore, WALLPAPERS } from '../../store/desktopStore';

export default function Desktop() {
  const wallpaperIndex = useDesktopStore((s) => s.wallpaperIndex);
  const accentMode = useDesktopStore((s) => s.accentMode);
  const stickyNotes = useDesktopStore((s) => s.stickyNotes);
  const missionControlActive = useDesktopStore((s) => s.missionControlActive);
  const toggleMissionControl = useDesktopStore((s) => s.toggleMissionControl);
  const exitMissionControl = useDesktopStore((s) => s.exitMissionControl);
  const reinitializePositions = useWindowStore((s) => s.reinitializePositions);

  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Recalculate icon positions on mount and resize
  useEffect(() => {
    reinitializePositions();

    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(reinitializePositions, 120);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(debounceTimer);
    };
  }, [reinitializePositions]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spotlight: Cmd+Space or Ctrl+Space
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
        return;
      }
      // Mission Control: Ctrl+Up
      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        toggleMissionControl();
        return;
      }
      // Escape: close mission control or spotlight
      if (e.key === 'Escape') {
        if (missionControlActive) { exitMissionControl(); return; }
        if (spotlightOpen) { setSpotlightOpen(false); return; }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [missionControlActive, spotlightOpen, toggleMissionControl, exitMissionControl]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  // Light tint overlay opacity based on accent mode
  const lightOverlayOpacity = accentMode === 'light' ? 0.08 : 0;

  return (
    <div
      className="desktop"
      style={{ background: WALLPAPERS[wallpaperIndex] }}
      onContextMenu={handleContextMenu}
    >
      {/* Accent mode overlay */}
      {accentMode === 'light' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(255,255,255,${lightOverlayOpacity})`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      <MenuBar />

      {/* Shared layer: sticky notes, desktop icons, windows */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Sticky notes — below windows */}
        <AnimatePresence>
          {stickyNotes.map((note) => (
            <StickyNote key={note.id} {...note} />
          ))}
        </AnimatePresence>

        {/* Desktop icons — only non-game apps */}
        {VISIBLE_APPS.map((app) => (
          <DesktopIcon
            key={app.id}
            appId={app.id as AppId}
            icon={app.icon}
            label={app.label}
          />
        ))}

        {/* Draggable windows */}
        <Window appId="about"><AboutApp /></Window>
        <Window appId="experience"><ExperienceApp /></Window>
        <Window appId="projects"><ProjectsApp /></Window>
        <Window appId="skills"><SkillsApp /></Window>
        <Window appId="publications"><PublicationsApp /></Window>
        <Window appId="contact"><ContactApp /></Window>
        <Window appId="snake"><SnakeApp /></Window>
        <Window appId="minesweeper"><MinesweeperApp /></Window>
        <Window appId="terminal"><TerminalApp /></Window>
        <Window appId="readme"><ReadMeApp /></Window>
        <Window appId="wordle"><WordleApp /></Window>
        <Window appId="mastermind"><MastermindApp /></Window>
        <Window appId="flappybird"><FlappyBirdApp /></Window>
        <Window appId="twentyfortyeight"><TwentyFortyEightApp /></Window>
        <Window appId="resume"><ResumeApp /></Window>
        <Window appId="finder"><FinderApp /></Window>
        <Window appId="games"><GamesApp /></Window>
        <Window appId="aboutmac"><AboutThisMacApp /></Window>
        <Window appId="preferences"><SystemPreferencesApp /></Window>
      </div>

      <Dock />

      {/* Context menu */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          onClose={() => setCtxMenu(null)}
        />
      )}

      {/* Toast notifications */}
      <ToastNotification />

      {/* Mission Control overlay */}
      <MissionControl active={missionControlActive} />

      {/* Spotlight */}
      <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
    </div>
  );
}
