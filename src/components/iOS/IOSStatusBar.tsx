import { useState, useEffect } from 'react';

interface Props {
  /** When true the status bar text/icons render white (default). False = dark. */
  light?: boolean;
}

function formatIOSTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(' AM', '').replace(' PM', '');
}

export default function IOSStatusBar({ light = true }: Props) {
  const [time, setTime] = useState(() => formatIOSTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatIOSTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const color = light ? '#fff' : '#000';

  return (
    <div className="ios-status-bar">
      <span className="ios-status-time" style={{ color }}>{time}</span>

      <div className="ios-status-icons">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill={color} />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill={color} />
          <rect x="9" y="3" width="3" height="9" rx="1" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill={color} />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill={color} />
          <path d="M8 6C5.8 6 3.9 6.9 2.5 8.3l1.4 1.4A5.5 5.5 0 0 1 8 8a5.5 5.5 0 0 1 4.1 1.7l1.4-1.4A7.5 7.5 0 0 0 8 6z" fill={color} fillOpacity="0.6" />
          <path d="M8 2.5C4.4 2.5 1.2 4 0 6.3l1.5 1.3A8.5 8.5 0 0 1 8 4.5a8.5 8.5 0 0 1 6.5 3.1L16 6.3C14.8 4 11.6 2.5 8 2.5z" fill={color} fillOpacity="0.35" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color} strokeOpacity="0.35" />
          <rect x="22" y="3.5" width="2.5" height="5" rx="1.5" fill={color} fillOpacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill={color} />
        </svg>
      </div>
    </div>
  );
}
