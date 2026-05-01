import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS } from '../../data/content';

interface Props {
  onClose: () => void;
}

function formatLargeTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const NOTIFICATIONS = [
  { icon: '🎉', title: 'New offer received', time: '2m ago' },
  { icon: '✅', title: 'PR merged: ai-agent-v2', time: '1h ago' },
  { icon: '📧', title: 'Recruiter from Google', time: '3h ago' },
  { icon: '🏆', title: "Dean's List confirmed", time: '1d ago' },
  { icon: '🚀', title: 'Deployed to production', time: '2d ago' },
];

const DEV_QUOTES = [
  { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
];

// Valley – Lost In Translation (2023)
const PLAYLIST = [
  { videoId: 'Sn7vgfw6fT8', title: 'theme',                           artist: 'Valley' },
  { videoId: 'yt5XQ6vhfPw', title: 'Lost In Translation',             artist: 'Valley' },
  { videoId: 'mqfUs48xDOE', title: 'Throwback Tears',                 artist: 'Valley' },
  { videoId: 'DyG6e0zceY0', title: 'Natural',                         artist: 'Valley' },
  { videoId: 'dPhBFSOvRGg', title: 'Break For You',                   artist: 'Valley' },
  { videoId: 'LpGu_1N4hbs', title: 'Have A Good Summer (Without Me)', artist: 'Valley' },
  { videoId: 'mW6EmCQQjrc', title: 'Good, but not together',          artist: 'Valley' },
  { videoId: 'FfAwTOPehY0', title: 'Evenings & Weekends',             artist: 'Valley' },
  { videoId: 'YVr2wtYsI9w', title: 'i thought i could fly',           artist: 'Valley' },
  { videoId: 'DVIG38SRJrY', title: "Either Way, I'm Going Your Way",  artist: 'Valley' },
  { videoId: 'Xz8FjyPrR8g', title: "I Haven't Seen You In Forever",   artist: 'Valley' },
  { videoId: 'AQ2tRMTR7MY', title: "We Don't Need Malibu",            artist: 'Valley' },
  { videoId: 'RAdKQfyQK_8', title: 'Keep My Stuff',                   artist: 'Valley' },
  { videoId: 'GDcKYrnO0Aw', title: 'Big Jet Plane',                   artist: 'Valley' },
  { videoId: 'DhexJh5-k2g', title: 'Fishbowl',                        artist: 'Valley' },
];

// Generate a fake but realistic-looking contribution grid (16 weeks x 7 days)
function generateContributions(): number[][] {
  const seed = 42;
  const grid: number[][] = [];
  for (let w = 0; w < 16; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const v = Math.abs(Math.sin(seed * (w * 7 + d) + 1.7) * 4.3);
      week.push(d === 0 || d === 6 ? (v > 3 ? 0 : Math.floor(v)) : Math.floor(v));
    }
    grid.push(week);
  }
  return grid;
}
const CONTRIB_GRID = generateContributions();
const CONTRIB_COLORS = ['rgba(255,255,255,0.06)', '#0e4429', '#006d32', '#26a641', '#39d353'];

// Shazam widget: flatten all skills into a single array
const ALL_SKILLS: { name: string; category: string }[] = Object.entries(SKILLS).flatMap(
  ([cat, skills]) => skills.map((s) => ({ name: s, category: cat }))
);

const TECH_EMOJI: Record<string, string> = {
  Python: '🐍', React: '⚛️', 'React.js': '⚛️', TypeScript: '📘', Docker: '🐳',
  AWS: '☁️', 'AWS S3': '☁️', 'AWS Athena': '☁️', 'AWS Glue': '☁️', 'AWS EMR': '☁️',
  LLMs: '🤖', 'OpenAI GPT': '🤖', Go: '🐹', Java: '☕', Flask: '🧪', MongoDB: '🍃',
  Kubernetes: '⚙️', 'Node.js': '🟩', 'Vue.js': '💚', JavaScript: '🟨', SQL: '🗄️',
  Docker2: '🐳', RAG: '🔍', GenAI: '✨', HuggingFace: '🤗', vLLM: '⚡', 'Agentic AI': '🦾',
  PostgreSQL: '🐘', MySQL: '🗄️', Git: '📂', 'CI/CD': '🔄', 'Spring Boot': '🌱',
  'Apache Spark': '💥', Hadoop: '🐘', 'Apache Airflow': '🌬️', Pandas: '🐼',
};

function getSkillEmoji(name: string): string {
  return TECH_EMOJI[name] ?? '💡';
}

// 28-day coding heatmap (4 weeks x 7 days), high density
function generateHeatmap(): boolean[][] {
  const rows: boolean[][] = [];
  for (let row = 0; row < 7; row++) {
    const week: boolean[] = [];
    for (let col = 0; col < 4; col++) {
      // ~80% fill, weekends slightly less
      const chance = row === 0 || row === 6 ? 0.5 : 0.85;
      week.push(Math.random() < chance);
    }
    rows.push(week);
  }
  return rows;
}

const HEATMAP = generateHeatmap();
const STREAK_SUBTITLES = [
  'Longer than most Netflix series',
  'No days off since February',
  'The grind is real 💪',
  'Running on caffeine and commits',
];

const frostedCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
};

const widgetLabel: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  color: '#818cf8',
  letterSpacing: '0.08em',
  marginBottom: 10,
  fontWeight: 600,
};

// ---- Widget: Motivation Battery ----
function MotivationBatteryWidget() {
  const [level] = useState(() => Math.floor(Math.random() * 21) + 75); // 75–95

  const barColor = level > 70 ? '#34d399' : level > 40 ? '#fbbf24' : '#f87171';
  const subtitle =
    level > 70 ? 'Shipping in full charge mode' :
    level > 40 ? 'Needs coffee' :
    '404: Motivation not found';

  return (
    <div style={frostedCard}>
      <div style={widgetLabel}>🔋 Motivation Level</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          flex: 1, height: 12, background: 'rgba(255,255,255,0.1)',
          borderRadius: 6, overflow: 'hidden',
        }}>
          <div style={{
            width: `${level}%`, height: '100%',
            background: barColor, borderRadius: 6,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', minWidth: 32, textAlign: 'right' }}>
          {level}%
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginBottom: 4 }}>
        "{subtitle}"
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Last commit: 2 hours ago</div>
    </div>
  );
}

// ---- Widget: Shazam for Skills ----
type ShazamState = 'idle' | 'scanning' | 'found';

function ShazamWidget() {
  const [state, setState] = useState<ShazamState>('idle');
  const [found, setFound] = useState<{ name: string; category: string } | null>(null);
  const [ripple, setRipple] = useState(0);

  const handleTap = () => {
    if (state === 'scanning') return;
    setState('scanning');
    setFound(null);
    setRipple((r) => r + 1);
    setTimeout(() => {
      const pick = ALL_SKILLS[Math.floor(Math.random() * ALL_SKILLS.length)];
      setFound(pick);
      setState('found');
    }, 1500);
  };

  return (
    <div style={frostedCard}>
      <div style={widgetLabel}>🎵 Skill Identifier</div>
      <div
        onClick={handleTap}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 12, cursor: 'pointer', userSelect: 'none',
          minHeight: 90,
        }}
      >
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(99,102,241,0.25)',
              border: '2px solid rgba(99,102,241,0.6)',
              borderRadius: 14, padding: '10px 24px',
              fontSize: 14, fontWeight: 700, color: '#a5b4fc',
              letterSpacing: '0.05em',
            }}
          >
            TAP TO IDENTIFY
          </motion.div>
        )}

        {state === 'scanning' && (
          <div key={`scan-${ripple}`} style={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  border: '2px solid #818cf8',
                }}
                initial={{ width: 20, height: 20, opacity: 0.9 }}
                animate={{ width: 70, height: 70, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#818cf8' }} />
          </div>
        )}

        {state === 'found' && found && (
          <motion.div
            key="found"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: 32, marginBottom: 4 }}>{getSkillEmoji(found.name)}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{found.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>{found.category}</div>
            <div style={{
              fontSize: 11, color: '#818cf8', cursor: 'pointer',
              background: 'rgba(99,102,241,0.15)', borderRadius: 8, padding: '4px 10px',
              display: 'inline-block',
            }}>
              Tap again to identify another
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ---- Widget: Coding Streak ----
function CodingStreakWidget() {
  const [subtitleIdx, setSubtitleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSubtitleIdx((i) => (i + 1) % STREAK_SUBTITLES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const WEEK_LABELS = ['3w ago', '2w ago', 'Last wk', 'This wk'];

  return (
    <div style={frostedCard}>
      <div style={widgetLabel}>🔥 Coding Streak</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
        47-day streak
      </div>

      {/* Heatmap grid: rows=days, cols=weeks */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 8 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {DAY_LABELS.map((d) => (
            <div key={d} style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', height: 10, lineHeight: '10px' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Heatmap cells */}
        <div style={{ flex: 1 }}>
          {/* Week labels */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            {WEEK_LABELS.map((w) => (
              <div key={w} style={{ flex: 1, fontSize: 8, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                {w}
              </div>
            ))}
          </div>
          {HEATMAP.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              {row.map((active, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    flex: 1, height: 10, borderRadius: 2,
                    background: active ? '#26a641' : 'rgba(255,255,255,0.07)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subtitleIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}
        >
          "{STREAK_SUBTITLES[subtitleIdx]}"
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---- Widget: LeetCode Stats ----
function LeetCodeWidget() {
  const stats = [
    { label: 'Easy',   solved: 45,  total: 150, color: '#34d399' },
    { label: 'Medium', solved: 38,  total: 200, color: '#fbbf24' },
    { label: 'Hard',   solved: 12,  total: 60,  color: '#f87171' },
  ];

  return (
    <div style={frostedCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={widgetLabel}>⚡ LeetCode</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>🏆 #142,847</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
        {stats.map((s) => (
          <div key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                {s.solved}/{s.total}
              </span>
            </div>
            <div style={{
              height: 6, background: 'rgba(255,255,255,0.1)',
              borderRadius: 3, overflow: 'hidden',
            }}>
              <div style={{
                width: `${(s.solved / s.total) * 100}%`,
                height: '100%', background: s.color, borderRadius: 3,
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Acceptance rate</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#a5b4fc' }}>68.3%</div>
      </div>
    </div>
  );
}

// ---- Main Component ----
export default function IOSNotificationCenter({ onClose }: Props) {
  const [now, setNow] = useState(new Date());
  const swipeTouchRef = useRef<{ x: number; y: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  // iframeAutoplay controls the ?autoplay= param baked into the src.
  // When switching tracks while playing we set this to true so the newly
  // mounted iframe starts immediately — no postMessage race condition.
  const [iframeAutoplay, setIframeAutoplay] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Rotate dev quote every 8 seconds
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % DEV_QUOTES.length), 8000);
    return () => clearInterval(id);
  }, []);

  const sendCommand = (func: string) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args: '' }),
      '*',
    );
  };

  // Play/pause on the SAME track — postMessage is reliable here because the
  // iframe is already loaded and the YouTube API is ready.
  const togglePlay = () => {
    sendCommand(isPlaying ? 'pauseVideo' : 'playVideo');
    setIsPlaying((p) => !p);
  };

  // Switch tracks: bake autoplay into the src so the newly mounted iframe
  // starts immediately without any postMessage timing gamble.
  const changeTrack = (direction: 'prev' | 'next') => {
    const wasPlaying = isPlaying;
    setIsPlaying(false);
    setCurrentTrack((prev) =>
      direction === 'next'
        ? (prev + 1) % PLAYLIST.length
        : (prev - 1 + PLAYLIST.length) % PLAYLIST.length,
    );
    // Set autoplay flag — this becomes part of the iframe key so React
    // remounts with ?autoplay=1 when the user was playing.
    setIframeAutoplay(wasPlaying);
    // Sync the play button state after the iframe has had time to start
    if (wasPlaying) setTimeout(() => setIsPlaying(true), 600);
  };

  // Swipe up from the home indicator bar at the bottom dismisses the panel
  const handleBarTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const t = e.touches[0];
    swipeTouchRef.current = { x: t.clientX, y: t.clientY };
  };
  const handleBarTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!swipeTouchRef.current) return;
    const t = e.changedTouches[0];
    const dy = t.clientY - swipeTouchRef.current.y;
    swipeTouchRef.current = null;
    if (dy < -40) onClose();
  };

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(10,10,20,0.88)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        overflowY: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '48px 16px 32px' }}>

        {/* Top bar — time + close */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <div
            style={{
              fontSize: 48,
              fontWeight: 200,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            {formatLargeTime(now)}
          </div>
          <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {formatDate(now)}
          </div>
        </div>

        {/* Music Widget */}
        <div style={frostedCard}>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              color: '#818cf8',
              letterSpacing: '0.08em',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Now Playing
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                {PLAYLIST[currentTrack].title}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                {PLAYLIST[currentTrack].artist}
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {/* Prev */}
            <button
              onClick={() => changeTrack('prev')}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                width: 36, height: 36, color: '#fff', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ⏮
            </button>
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                width: 36, height: 36, color: '#fff', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            {/* Next */}
            <button
              onClick={() => changeTrack('next')}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                width: 36, height: 36, color: '#fff', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ⏭
            </button>
          </div>
          {/* Hidden YouTube iframe — key includes autoplay flag so React remounts with
              correct ?autoplay= value baked in; avoids postMessage race on track change */}
          <iframe
            key={`${currentTrack}-${iframeAutoplay}`}
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${PLAYLIST[currentTrack].videoId}?autoplay=${iframeAutoplay ? 1 : 0}&enablejsapi=1`}
            allow="autoplay"
            style={{
              position: 'absolute',
              opacity: 0,
              width: 1,
              height: 1,
              pointerEvents: 'none',
            }}
            title="background-music"
          />
        </div>

        {/* Quick Stats Widget */}
        <div style={frostedCard}>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              color: '#818cf8',
              letterSpacing: '0.08em',
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Quick Stats
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: '🎓', label: 'GPA', value: '3.96' },
              { icon: '💼', label: 'Internships', value: '6' },
              { icon: '📄', label: 'Publications', value: '1' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  padding: '10px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === NEW WIDGETS === */}

        {/* Widget A: Motivation Battery */}
        <MotivationBatteryWidget />

        {/* Widget B: Shazam for Skills */}
        <ShazamWidget />

        {/* Widget C: Coding Streak */}
        <CodingStreakWidget />

        {/* Widget D: LeetCode Stats */}
        <LeetCodeWidget />

        {/* === END NEW WIDGETS === */}

        {/* Availability Widget */}
        <div style={frostedCard}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 600 }}>
            Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
              <div style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                background: 'rgba(52,211,153,0.35)',
                animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
              }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Open to Opportunities</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
                Graduating May 2026 · Available full-time
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' as const }}>
            {['AI / ML', 'Full Stack', 'Singapore'].map((tag) => (
              <span key={tag} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* GitHub Activity Widget */}
        <div style={frostedCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.08em', fontWeight: 600 }}>
              GitHub Activity
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Last 16 weeks</div>
          </div>
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {CONTRIB_GRID.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {week.map((level, di) => (
                  <div
                    key={di}
                    style={{
                      width: 10, height: 10, borderRadius: 2,
                      background: CONTRIB_COLORS[Math.min(level, 4)],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>🔥 12-day streak</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>247 contributions</div>
          </div>
        </div>

        {/* Dev Quote Widget */}
        <div style={{ ...frostedCard, minHeight: 90, position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 600 }}>
            Dev Quote
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 6 }}>
                "{DEV_QUOTES[quoteIdx].quote}"
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                ~ {DEV_QUOTES[quoteIdx].author}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Notifications Widget */}
        <div style={{ ...frostedCard, marginBottom: 0 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              color: '#818cf8',
              letterSpacing: '0.08em',
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Notifications
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {NOTIFICATIONS.map((n, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingTop: i === 0 ? 0 : 10,
                  paddingBottom: i === NOTIFICATIONS.length - 1 ? 0 : 10,
                  borderBottom:
                    i < NOTIFICATIONS.length - 1
                      ? '1px solid rgba(255,255,255,0.07)'
                      : 'none',
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#fff',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {n.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
                    {n.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator — swipe up from here to dismiss */}
        <div
          style={{ textAlign: 'center', marginTop: 24, paddingBottom: 8, cursor: 'pointer' }}
          onTouchStart={handleBarTouchStart}
          onTouchEnd={handleBarTouchEnd}
          onClick={onClose}
        >
          <div
            style={{
              width: 134,
              height: 5,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.3)',
              display: 'inline-block',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
