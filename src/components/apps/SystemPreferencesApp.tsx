import { useState } from 'react';
import { useDesktopStore } from '../../store/desktopStore';

type Pane = 'wallpaper' | 'appearance' | 'dock' | 'personality';

const PANES: { id: Pane; icon: string; label: string }[] = [
  { id: 'wallpaper',   icon: '🖼',  label: 'Wallpaper' },
  { id: 'appearance',  icon: '🎨',  label: 'Appearance' },
  { id: 'dock',        icon: '🞦',   label: 'Dock & Menu Bar' },
  { id: 'personality', icon: '☕',   label: 'Personality' },
];

export default function SystemPreferencesApp() {
  const [activePane, setActivePane] = useState<Pane>('wallpaper');
  const cycleWallpaper = useDesktopStore((s) => s.cycleWallpaper);
  const accentMode = useDesktopStore((s) => s.accentMode);
  const toggleAccentMode = useDesktopStore((s) => s.toggleAccentMode);
  const personalityMode = useDesktopStore((s) => s.personalityMode);
  const togglePersonalityMode = useDesktopStore((s) => s.togglePersonalityMode);
  const addToast = useDesktopStore((s) => s.addToast);

  const renderContent = () => {
    switch (activePane) {
      case 'wallpaper':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Wallpaper</div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Christian OS comes with 5 hand-crafted gradient wallpapers. Cycle through them to find your favourite.
            </p>
            <button
              onClick={() => { cycleWallpaper(); addToast('Wallpaper changed! 🖼'); }}
              style={btnStyle}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.38)')}
              onMouseLeave={e => (e.currentTarget.style.background = btnBg)}
            >
              Next Wallpaper →
            </button>
          </div>
        );

      case 'appearance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Appearance</div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Toggle between Dark Mode and Light Tint to adjust the desktop overlay brightness.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              {(['dark', 'light'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => { if (accentMode !== mode) toggleAccentMode(); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: accentMode === mode ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.15)',
                    background: accentMode === mode ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    color: accentMode === mode ? '#818cf8' : 'rgba(255,255,255,0.6)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {mode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Tint'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Current: {accentMode === 'dark' ? 'Dark Mode' : 'Light Tint'}
            </div>
          </div>
        );

      case 'dock':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Dock & Menu Bar</div>
            {[
              ['Position', 'Bottom · Fixed'],
              ['Magnification', 'Enabled · Proximity-based'],
              ['Auto-hide', 'Disabled'],
              ['Show in Menu Bar', 'Battery, Wi-Fi, Clock, Notifications'],
              ['Badges', 'Experience, Projects, Publications'],
            ].map(([key, val]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{key}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{val}</span>
              </div>
            ))}
          </div>
        );

      case 'personality':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Personality</div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Changes the now-playing ticker in the menu bar.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {([['coffee', '☕ Coffee Mode'], ['debug', '🐛 Debug Mode']] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => { if (personalityMode !== mode) togglePersonalityMode(); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: personalityMode === mode ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.15)',
                    background: personalityMode === mode ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    color: personalityMode === mode ? '#818cf8' : 'rgba(255,255,255,0.6)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Currently in {personalityMode === 'coffee' ? 'Coffee Mode ☕' : 'Debug Mode 🐛'}
            </div>
          </div>
        );
    }
  };

  const btnBg = 'rgba(99,102,241,0.25)';
  const btnStyle: React.CSSProperties = {
    padding: '9px 20px',
    background: btnBg,
    border: '1px solid rgba(99,102,241,0.45)',
    borderRadius: '8px',
    color: '#818cf8',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
    alignSelf: 'flex-start',
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      gap: '0',
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '140px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        background: 'rgba(0,0,0,0.12)',
      }}>
        {PANES.map(pane => (
          <button
            key={pane.id}
            onClick={() => setActivePane(pane.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 10px',
              borderRadius: '7px',
              background: activePane === pane.id ? 'rgba(99,102,241,0.25)' : 'transparent',
              border: activePane === pane.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              color: activePane === pane.id ? '#818cf8' : 'rgba(255,255,255,0.6)',
              fontSize: '12px',
              fontWeight: activePane === pane.id ? 600 : 400,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: '14px' }}>{pane.icon}</span>
            {pane.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        color: 'rgba(255,255,255,0.85)',
      }}>
        {renderContent()}
      </div>
    </div>
  );
}
