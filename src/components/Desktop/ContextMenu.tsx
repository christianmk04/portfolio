import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useDesktopStore } from '../../store/desktopStore';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { APPS } from '../../data/content';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
  dividerAfter?: boolean;
}

export default function ContextMenu({ x, y, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const cycleWallpaper = useDesktopStore((s) => s.cycleWallpaper);
  const addStickyNote = useDesktopStore((s) => s.addStickyNote);
  const openWindow = useWindowStore((s) => s.openWindow);

  useEffect(() => {
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  // Clamp menu to viewport
  const menuW = 210;
  const menuH = 160;
  const left = Math.min(x, window.innerWidth - menuW - 8);
  const top = Math.min(y, window.innerHeight - menuH - 8);

  const items: MenuItem[] = [
    {
      icon: '🖼',
      label: 'Change Wallpaper',
      action: () => { cycleWallpaper(); onClose(); },
    },
    {
      icon: '📝',
      label: 'New Sticky Note',
      action: () => { addStickyNote(x, y); onClose(); },
      dividerAfter: true,
    },
    {
      icon: '🎲',
      label: 'Surprise Me!',
      action: () => {
        const random = APPS[Math.floor(Math.random() * APPS.length)];
        openWindow(random.id as AppId);
        onClose();
      },
      dividerAfter: true,
    },
    {
      icon: '👤',
      label: 'About Christian',
      action: () => { openWindow('about'); onClose(); },
    },
  ];

  return (
    <Box
      ref={ref}
      onMouseDown={(e) => e.stopPropagation()}
      sx={{
        position: 'fixed',
        left,
        top,
        width: menuW,
        zIndex: 9500,
        background: 'rgba(18, 18, 26, 0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
        py: 0.5,
        overflow: 'hidden',
      }}
    >
      {items.map((item, i) => (
        <Box key={i}>
          <Box
            onClick={item.action}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.5,
              height: 32,
              cursor: 'pointer',
              fontSize: 13,
              color: 'rgba(255,255,255,0.88)',
              borderRadius: 1,
              mx: 0.5,
              transition: 'background 0.12s ease',
              '&:hover': { background: 'rgba(99,102,241,0.28)' },
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </Box>
          {item.dividerAfter && (
            <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.07)', mx: 1, my: 0.25 }} />
          )}
        </Box>
      ))}
    </Box>
  );
}
