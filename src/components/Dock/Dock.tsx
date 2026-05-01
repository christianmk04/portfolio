import { useState } from 'react';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { VISIBLE_APPS } from '../../data/content';
import { useDesktopStore } from '../../store/desktopStore';
import DockIcon from './DockIcon';

export default function Dock() {
  const windows = useWindowStore((s) => s.windows);
  const toggleMissionControl = useDesktopStore((s) => s.toggleMissionControl);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="dock-container"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Mission Control button — left side */}
      <div
        className="dock-icon-wrapper"
        onClick={toggleMissionControl}
        title="Mission Control"
        style={{ marginRight: '4px' }}
      >
        <div
          className="dock-icon-inner"
          style={{
            fontSize: '22px',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          ⊞
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '40px',
        background: 'rgba(255,255,255,0.12)',
        marginRight: '4px',
        alignSelf: 'center',
      }} />

      {VISIBLE_APPS.map((app, index) => (
        <DockIcon
          key={app.id}
          appId={app.id as AppId}
          icon={app.icon}
          label={app.label}
          isOpen={windows[app.id as AppId]?.isOpen ?? false}
          index={index}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
        />
      ))}
    </div>
  );
}
