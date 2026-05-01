import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppId } from '../../store/windowStore';

interface FolderApp {
  appId: AppId;
  icon: string;
  label: string;
}

interface Props {
  label: string;
  apps: FolderApp[];
  onOpenApp: (id: AppId) => void;
}

// Gradient per game app
const GAME_GRADIENTS: Record<string, string> = {
  snake:            'linear-gradient(145deg, #4cd964 0%, #34b34a 100%)',
  minesweeper:      'linear-gradient(145deg, #ff9500 0%, #d47f00 100%)',
  wordle:           'linear-gradient(145deg, #538d4e 0%, #3a6e36 100%)',
  mastermind:       'linear-gradient(145deg, #9b59b6 0%, #7d3c98 100%)',
  flappybird:       'linear-gradient(145deg, #f1c40f 0%, #d4ac0d 100%)',
  twentyfortyeight: 'linear-gradient(145deg, #e67e22 0%, #ca6f1e 100%)',
};

export default function IOSFolder({ label, apps, onOpenApp }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const preview = apps.slice(0, 6);

  return (
    <>
      {/* Closed state: squircle icon with mini grid inside */}
      <div
        className="ios-app-icon"
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            background: 'linear-gradient(145deg, rgba(60,60,80,0.8), rgba(40,40,60,0.9))',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 3,
            padding: 7,
            boxSizing: 'border-box',
          }}
        >
          {preview.map((app) => (
            <div
              key={app.appId}
              style={{
                borderRadius: 3,
                background: GAME_GRADIENTS[app.appId] ?? 'linear-gradient(145deg, #555, #333)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }}
            >
              {app.icon}
            </div>
          ))}
        </div>
        <span className="ios-app-icon-label">{label}</span>
      </div>

      {/* Open state: modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                width: 'min(340px, 90vw)',
                borderRadius: 20,
                background: 'rgba(30,30,42,0.95)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: 20,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Folder label */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  textAlign: 'center',
                  marginBottom: 16,
                  fontFamily: '-apple-system, sans-serif',
                }}
              >
                {label}
              </div>

              {/* 4-column grid of full-size app icons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  justifyItems: 'center',
                }}
              >
                {apps.map((app) => (
                  <div
                    key={app.appId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                    onClick={() => { onOpenApp(app.appId); setIsOpen(false); }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 13,
                        background: GAME_GRADIENTS[app.appId] ?? 'linear-gradient(145deg, #555, #333)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                      }}
                    >
                      {app.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.85)',
                        textAlign: 'center',
                        fontFamily: '-apple-system, sans-serif',
                        lineHeight: 1.2,
                        maxWidth: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {app.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
