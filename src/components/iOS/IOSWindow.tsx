import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { AppId } from '../../store/windowStore';
import { APPS } from '../../data/content';
import IOSStatusBar from './IOSStatusBar';

interface Props {
  appId: AppId;
  children: ReactNode;
  onClose: () => void;
}

export default function IOSWindow({ appId, children, onClose }: Props) {
  const appMeta = APPS.find((a) => a.id === appId)!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const swipeTouchRef = useRef<{ x: number; y: number } | null>(null);

  const isScrolledToBottom = () => {
    const el = scrollRef.current;
    if (!el) return false;
    // Content that doesn't overflow is always "at the bottom"
    return el.scrollHeight <= el.clientHeight + 1 ||
      el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeTouchRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeTouchRef.current) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - swipeTouchRef.current.y;
    swipeTouchRef.current = null;
    // Swipe up ≥ 50px — only dismiss when already at the bottom of content
    if (dy < -50 && isScrolledToBottom()) onClose();
  };

  const handleIndicatorClick = () => {
    if (isScrolledToBottom()) onClose();
  };

  return (
    <motion.div
      className="ios-window"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* iOS status bar inside window */}
      <IOSStatusBar />

      {/* Navigation bar */}
      <div className="ios-window-nav">
        <div className="ios-window-back" onClick={onClose}>
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M8.5 1.5L1.5 8.5L8.5 15.5" stroke="#0a84ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 17, marginLeft: 2 }}>Home</span>
        </div>
        <span className="ios-window-title">
          {appMeta.icon} {appMeta.label}
        </span>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="ios-window-content">
        {children}
      </div>

      {/* Home indicator — only closes when scrolled to bottom */}
      <div className="ios-home-indicator">
        <div
          className="ios-home-indicator-bar"
          onClick={handleIndicatorClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </motion.div>
  );
}
