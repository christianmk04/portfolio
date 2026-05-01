import { useDesktopStore } from '../../store/desktopStore';

const SPECS = [
  { label: 'Processor',      value: 'Caffeine-driven · 3.2 GHz' },
  { label: 'Memory',         value: '6 Internships · Scalable' },
  { label: 'Storage',        value: '247 GitHub commits · Always syncing' },
  { label: 'Graphics',       value: 'MUI + Framer Motion · 60fps' },
  { label: 'GPA',            value: '3.96 / 4.0 · Summa Cum Laude' },
  { label: 'Serial Number',  value: 'SMU2021-IS-0001' },
];

export default function AboutThisMacApp() {
  const addToast = useDesktopStore((s) => s.addToast);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px 28px',
      color: 'rgba(255,255,255,0.85)',
      minHeight: '100%',
    }}>
      {/* Apple logo + OS name */}
      <div style={{ fontSize: '52px', lineHeight: 1 }}>🍎</div>
      <div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          textAlign: 'center',
          color: '#fff',
          letterSpacing: '-0.02em',
        }}>
          Christian OS
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
          marginTop: '4px',
        }}>
          Version 2025.1 (Build 3.96) · SMU Edition
        </div>
      </div>

      {/* Specs table */}
      <div style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}>
        {SPECS.map((spec, i) => (
          <div
            key={spec.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '9px 16px',
              borderBottom: i < SPECS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              gap: '16px',
            }}
          >
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.45)',
              flexShrink: 0,
              minWidth: '110px',
            }}>
              {spec.label}
            </span>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'right',
            }}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Software Update button */}
      <button
        onClick={() => addToast("You're up to date! 🎉")}
        style={{
          padding: '8px 24px',
          background: 'rgba(99,102,241,0.25)',
          border: '1px solid rgba(99,102,241,0.45)',
          borderRadius: '8px',
          color: '#818cf8',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.15s',
          marginTop: '4px',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.38)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.25)')}
      >
        Software Update...
      </button>

      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: 'auto', textAlign: 'center' }}>
        Copyright © 2025 Christian Koh Inc. All rights reserved.
      </div>
    </div>
  );
}
