import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import { useDesktopStore } from '../../store/desktopStore';
import { APPS } from '../../data/content';
import type { AppId } from '../../store/windowStore';

interface Props {
  active: boolean;
}

export default function MissionControl({ active }: Props) {
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const exitMissionControl = useDesktopStore((s) => s.exitMissionControl);

  const openApps = APPS.filter(app => {
    const win = windows[app.id as AppId];
    return win?.isOpen && !win?.isMinimized;
  });

  const handleSelect = (id: AppId) => {
    openWindow(id);
    exitMissionControl();
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9200,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) exitMissionControl(); }}
        >
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Mission Control · {openApps.length} window{openApps.length !== 1 ? 's' : ''} open
          </div>

          {openApps.length === 0 ? (
            <div style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              No open windows
              <br />
              <span style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Press Escape to exit
              </span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              maxWidth: '800px',
              justifyContent: 'center',
              padding: '0 20px',
            }}>
              {openApps.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  onClick={() => handleSelect(app.id as AppId)}
                  style={{
                    width: '160px',
                    height: '120px',
                    borderRadius: '12px',
                    background: 'rgba(22,22,30,0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    {app.icon}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.75)',
                    textAlign: 'center',
                    maxWidth: '140px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {app.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: '16px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
          }}>
            Click a window to bring it to focus · Escape to exit
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
