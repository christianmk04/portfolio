import { useState } from 'react';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { APPS } from '../../data/content';
import { useClock } from '../../hooks/useClock';
import StartMenu from './StartMenu';
import '../../styles/taskbar.css';

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const bringToFront = useWindowStore((s) => s.bringToFront);
  const topZIndex = useWindowStore((s) => s.topZIndex);
  const time = useClock();

  const [startOpen, setStartOpen] = useState(false);

  // Only show buttons for open windows
  const openApps = APPS.filter((app) => windows[app.id as AppId]?.isOpen);

  const handleTaskbarBtn = (id: AppId) => {
    const win = windows[id];
    if (win.isMinimized) {
      openWindow(id);
    } else if (win.zIndex === topZIndex) {
      // Currently focused → minimize
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}

      <div className="xp-taskbar">
        {/* Start Button */}
        <button
          className="xp-start-btn"
          onClick={() => setStartOpen((v) => !v)}
        >
          <span className="xp-start-icon">⊞</span>
          start
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', margin: '0 3px', flexShrink: 0 }} />

        {/* Open Window Buttons */}
        <div className="xp-taskbar-apps">
          {openApps.map((app) => {
            const win = windows[app.id as AppId];
            const isActive = win.zIndex === topZIndex && !win.isMinimized;
            return (
              <button
                key={app.id}
                className={`xp-taskbar-btn${isActive ? ' active' : ''}`}
                onClick={() => handleTaskbarBtn(app.id as AppId)}
                title={app.label}
              >
                <span className="xp-taskbar-btn-icon">{app.icon}</span>
                <span className="xp-taskbar-btn-label">{app.label}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="xp-system-tray">
          <span className="xp-tray-icon" title="Volume">🔊</span>
          <div className="xp-tray-clock">{time}</div>
        </div>
      </div>
    </>
  );
}
