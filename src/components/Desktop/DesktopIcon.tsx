import { useRef } from 'react';
import Draggable from 'react-draggable';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { useDesktopStore } from '../../store/desktopStore';

interface Props {
  appId: AppId;
  icon: string;
  label: string;
}

export default function DesktopIcon({ appId, icon, label }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const iconPosition = useWindowStore((s) => s.windows[appId].iconPosition);
  const updateIconPosition = useWindowStore((s) => s.updateIconPosition);
  const openWindow = useWindowStore((s) => s.openWindow);
  const isOpen = useWindowStore((s) => s.windows[appId].isOpen);
  const openedApps = useDesktopStore((s) => s.openedApps);
  const addToast = useDesktopStore((s) => s.addToast);
  const markOpened = useDesktopStore((s) => s.markOpened);

  const didDrag = useRef(false);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={iconPosition}
      onStart={() => { didDrag.current = false; }}
      onDrag={() => { didDrag.current = true; }}
      onStop={(_, d) => updateIconPosition(appId, { x: d.x, y: d.y })}
    >
      <div
        ref={nodeRef}
        onClick={() => {
          if (!didDrag.current) {
            if (!openedApps.has(appId)) { addToast(`Opening ${label}… 👋`); markOpened(appId); }
            openWindow(appId);
          }
        }}
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          width: 72,
          cursor: 'default',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Icon box */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'background 0.15s ease, transform 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.18)';
            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.10)';
            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
          }}
        >
          {icon}
        </div>

        {/* Label */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.2,
            textShadow: '0 1px 4px rgba(0,0,0,0.7)',
            padding: '1px 4px',
            borderRadius: 3,
            background: isOpen ? 'rgba(99,102,241,0.45)' : 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            maxWidth: 72,
            wordBreak: 'break-word',
          }}
        >
          {label}
        </span>
      </div>
    </Draggable>
  );
}
