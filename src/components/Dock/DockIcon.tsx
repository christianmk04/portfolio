import { useRef, useEffect } from 'react';
import { useAnimate } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { useDesktopStore, BADGE_COUNTS } from '../../store/desktopStore';

interface Props {
  appId: AppId;
  icon: string;
  label: string;
  isOpen: boolean;
  index: number;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
}

function getScale(index: number, hoveredIndex: number | null): number {
  if (hoveredIndex === null) return 1.0;
  const dist = Math.abs(index - hoveredIndex);
  if (dist === 0) return 1.5;
  if (dist === 1) return 1.25;
  if (dist === 2) return 1.1;
  return 1.0;
}

export default function DockIcon({ appId, icon, label, isOpen, index, hoveredIndex, onHover }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const openedApps = useDesktopStore((s) => s.openedApps);
  const addToast = useDesktopStore((s) => s.addToast);
  const markOpened = useDesktopStore((s) => s.markOpened);
  const dismissedBadges = useDesktopStore((s) => s.dismissedBadges);
  const dismissBadge = useDesktopStore((s) => s.dismissBadge);
  const [scope, animate] = useAnimate();
  const iconRef = useRef<HTMLDivElement>(null);

  const scale = getScale(index, hoveredIndex);
  const translateY = hoveredIndex !== null ? -(scale - 1) * 20 : 0;

  // Dismiss badge when window becomes open
  useEffect(() => {
    if (isOpen && BADGE_COUNTS[appId] !== undefined) {
      dismissBadge(appId);
    }
  }, [isOpen, appId, dismissBadge]);

  const badgeCount = BADGE_COUNTS[appId];
  const showBadge = badgeCount !== undefined && !dismissedBadges.has(appId) && !isOpen;

  const handleClick = async () => {
    if (!openedApps.has(appId)) {
      addToast(`Opening ${label}… 👋`);
      markOpened(appId);
    }
    openWindow(appId);
    if (iconRef.current) {
      await animate(iconRef.current, { y: [0, -14, 0, -7, 0] }, { duration: 0.42, ease: 'easeInOut' });
    }
  };

  return (
    <Tooltip title={label} placement="top" arrow>
      <div
        className="dock-icon-wrapper"
        onClick={handleClick}
        ref={scope}
        onMouseEnter={() => onHover(index)}
        style={{ position: 'relative' }}
      >
        <div
          className="dock-icon-inner"
          ref={iconRef}
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transition: 'transform 0.15s ease',
          }}
        >
          {icon}
        </div>

        {/* Badge */}
        {showBadge && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '1.5px solid rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
              color: '#fff',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {badgeCount}
          </div>
        )}

        <div className={`dock-icon-dot ${isOpen ? '' : 'hidden'}`} />
      </div>
    </Tooltip>
  );
}
