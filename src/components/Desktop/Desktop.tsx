import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MenuBar from '../MenuBar/MenuBar';
import Dock from '../Dock/Dock';
import Window from '../Window/Window';
import DesktopIcon from './DesktopIcon';
import ContextMenu from './ContextMenu';
import StickyNote from './StickyNote';
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
import { APPS } from '../../data/content';
import type { AppId } from '../../store/windowStore';
import { useDesktopStore, WALLPAPERS } from '../../store/desktopStore';

export default function Desktop() {
  const wallpaperIndex = useDesktopStore((s) => s.wallpaperIndex);
  const stickyNotes = useDesktopStore((s) => s.stickyNotes);

  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="desktop"
      style={{ background: WALLPAPERS[wallpaperIndex] }}
      onContextMenu={handleContextMenu}
    >
      <MenuBar />

      {/* Shared layer: sticky notes, desktop icons, windows */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Sticky notes — below windows */}
        <AnimatePresence>
          {stickyNotes.map((note) => (
            <StickyNote key={note.id} {...note} />
          ))}
        </AnimatePresence>

        {/* Desktop icons */}
        {APPS.map((app) => (
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
    </div>
  );
}
