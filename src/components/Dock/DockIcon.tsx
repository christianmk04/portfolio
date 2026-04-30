import { useRef } from 'react';
import { useAnimate } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { useDesktopStore } from '../../store/desktopStore';

interface Props {
  appId: AppId;
  icon: string;
  label: string;
  isOpen: boolean;
}

export default function DockIcon({ appId, icon, label, isOpen }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const openedApps = useDesktopStore((s) => s.openedApps);
  const addToast = useDesktopStore((s) => s.addToast);
  const markOpened = useDesktopStore((s) => s.markOpened);
  const [scope, animate] = useAnimate();
  const iconRef = useRef<HTMLDivElement>(null);

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
      <div className="dock-icon-wrapper" onClick={handleClick} ref={scope}>
        <div className="dock-icon-inner" ref={iconRef}>
          {icon}
        </div>
        <div className={`dock-icon-dot ${isOpen ? '' : 'hidden'}`} />
      </div>
    </Tooltip>
  );
}
