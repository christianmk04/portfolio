import { useEffect, useRef } from 'react';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import { APPS } from '../../data/content';

interface Props {
  onClose: () => void;
}

const PORTFOLIO_APPS: AppId[] = ['about', 'experience', 'projects', 'skills', 'publications', 'contact', 'readme'];
const GAME_APPS: AppId[] = ['snake', 'minesweeper', 'terminal'];

export default function StartMenu({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);

  useEffect(() => {
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      if (e instanceof MouseEvent && ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    // slight delay so the start button click doesn't immediately close
    const tid = setTimeout(() => {
      document.addEventListener('mousedown', handler);
      document.addEventListener('keydown', handler);
    }, 50);
    return () => {
      clearTimeout(tid);
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const handleOpen = (id: AppId) => {
    openWindow(id);
    onClose();
  };

  const getApp = (id: AppId) => APPS.find((a) => a.id === id)!;

  const itemStyle = (hover?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 8px',
    cursor: 'default',
    color: hover ? '#fff' : '#000',
    background: hover ? '#316AC5' : 'transparent',
    fontFamily: 'Tahoma, Arial, sans-serif',
    fontSize: 11,
    whiteSpace: 'nowrap',
  });

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 30,
        left: 0,
        width: 380,
        zIndex: 9600,
        background: '#fff',
        border: '2px solid #0054E3',
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        boxShadow: '4px 0 12px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        fontFamily: 'Tahoma, Arial, sans-serif',
      }}
    >
      {/* XP Blue Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0058E6 0%, #3D9AEE 3%, #0080D4 6%, #0058C6 8%, #0054BD 50%, #0048A8 100%)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 54,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          👨‍💻
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 13, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Christian Koh
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
            SMU IS · GPA 3.96
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', height: 280 }}>
        {/* Left panel — Portfolio */}
        <div style={{ flex: 1, borderRight: '1px solid #d4d0c8', overflowY: 'auto', padding: '4px 0' }}>
          <div style={{ padding: '4px 8px 2px', color: '#666', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Portfolio
          </div>
          {PORTFOLIO_APPS.map((id) => {
            const app = getApp(id);
            return (
              <div
                key={id}
                onClick={() => handleOpen(id)}
                style={itemStyle()}
                onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, { background: '#316AC5', color: '#fff' })}
                onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, { background: 'transparent', color: '#000' })}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{app.icon}</span>
                <span>{app.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right panel — Games & Tools */}
        <div style={{ flex: 1, background: '#d8e4f8', overflowY: 'auto', padding: '4px 0' }}>
          <div style={{ padding: '4px 8px 2px', color: '#315ea8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Games &amp; Tools
          </div>
          {GAME_APPS.map((id) => {
            const app = getApp(id);
            return (
              <div
                key={id}
                onClick={() => handleOpen(id)}
                style={itemStyle()}
                onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, { background: '#316AC5', color: '#fff' })}
                onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, { background: 'transparent', color: '#000' })}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{app.icon}</span>
                <span>{app.label}</span>
              </div>
            );
          })}

          <div style={{ height: 1, background: '#b0c4e0', margin: '6px 8px' }} />

          {/* Links */}
          {[
            { icon: '🐙', label: 'GitHub', url: 'https://github.com/christianmk04' },
            { icon: '💼', label: 'LinkedIn', url: 'https://www.linkedin.com/in/04christiankoh/' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={itemStyle()}
                onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, { background: '#316AC5', color: '#fff' })}
                onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLDivElement).style, { background: 'transparent', color: '#000' })}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{link.icon}</span>
                <span>{link.label}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0058E6 0%, #3D9AEE 3%, #0080D4 6%, #0058C6 8%, #0054BD 50%, #0048A8 100%)',
          padding: '4px 8px',
          display: 'flex',
          justifyContent: 'flex-end',
          borderTop: '1px solid #003da5',
        }}
      >
        <div
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            background: 'linear-gradient(to bottom, #e88050, #c05820)',
            border: '1px solid #903010',
            borderRadius: 3,
            cursor: 'default',
            color: '#fff',
            fontSize: 11,
            fontFamily: 'Tahoma, Arial, sans-serif',
            fontWeight: 'bold',
            textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.1)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = 'none'; }}
        >
          🔴 Turn Off Computer
        </div>
      </div>
    </div>
  );
}
