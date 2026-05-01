import { Box, Typography } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─── macOS desktop version data ───────────────────────────────────────────────

interface Section {
  title: string;
  items: { icon: string; text: string }[];
}

const sections: Section[] = [
  {
    title: '🗂 Portfolio Apps',
    items: [
      { icon: '👤', text: 'About: who I am, education & scholarships' },
      { icon: '💼', text: 'Experience: 6 internships across AI & industry' },
      { icon: '🚀', text: 'Projects: things I\'ve built' },
      { icon: '⚡', text: 'Skills: my tech stack' },
      { icon: '📄', text: 'Publications: my ICSE-SEET 2024 paper' },
      { icon: '✉️', text: 'Contact: let\'s connect' },
      { icon: '📋', text: 'Resume: download my CV' },
      { icon: '🗂',  text: 'Finder: browse my projects as files' },
    ],
  },
  {
    title: '🎮 Games & Tools',
    items: [
      { icon: '🐍', text: 'Snake: press Space to start, arrow keys to play' },
      { icon: '💣', text: 'Minesweeper: click reveals, right-click flags' },
      { icon: '💻', text: 'Terminal: type help for a list of commands' },
      { icon: '🟩', text: 'Wordle: guess the 5-letter word in 6 tries' },
      { icon: '🎯', text: 'Mastermind: crack the hidden colour code in 10 guesses' },
      { icon: '🐦', text: 'Flappy Bird: tap or press Space to flap' },
      { icon: '🔢', text: '2048: swipe or use arrow keys to merge tiles' },
    ],
  },
  {
    title: '🖱 How to Navigate',
    items: [
      { icon: '🔵', text: 'Click any dock icon (bottom) or desktop icon to open an app' },
      { icon: '↔️', text: 'Drag a window by its title bar to move it' },
      { icon: '🔴', text: 'Red dot closes a window · Yellow dot minimises it' },
      { icon: '🖱', text: 'Right-click the desktop for the context menu' },
    ],
  },
  {
    title: '✨ Pro Tips',
    items: [
      { icon: '🖼', text: 'Change Wallpaper from the right-click context menu' },
      { icon: '📝', text: 'Add sticky notes anywhere via the context menu' },
      { icon: '🎲', text: '"Surprise Me!" opens a random app' },
      { icon: '💻', text: 'Try typing matrix or joke in the Terminal' },
    ],
  },
];

// ─── macOS desktop version ────────────────────────────────────────────────────

function DesktopReadMe() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header */}
      <Box
        sx={{
          textAlign: 'center',
          pb: 2,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Typography sx={{ fontSize: 28, mb: 0.5 }}>👋</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontFamily: 'Tahoma, Arial, sans-serif' }}>
          Welcome to Christian's Portfolio
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          This is an interactive desktop OS. Explore the apps below,<br />
          play some games, and feel free to drag windows around.
        </Typography>
      </Box>

      {/* Sections */}
      {sections.map((section) => (
        <Box key={section.title}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: '#818cf8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 1,
              fontFamily: 'Tahoma, Arial, sans-serif',
            }}
          >
            {section.title}
          </Typography>
          <Box
            sx={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {section.items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 0.8,
                  borderBottom:
                    i < section.items.length - 1
                      ? '1px solid rgba(255,255,255,0.05)'
                      : 'none',
                }}
              >
                <span style={{ fontSize: 15, flexShrink: 0, width: 22, textAlign: 'center' }}>
                  {item.icon}
                </span>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5, fontFamily: 'Tahoma, Arial, sans-serif' }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <Typography
        sx={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          mt: 0.5,
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}
      >
        Built with React · Vite · Material UI · Framer Motion
      </Typography>
    </Box>
  );
}

// ─── iOS mobile version ───────────────────────────────────────────────────────

const INDIGO = '#818cf8';
const FADED = 'rgba(255,255,255,0.45)';
const TEXT = 'rgba(255,255,255,0.82)';
const DIVIDER = '1px solid rgba(255,255,255,0.08)';

interface MobileRow {
  icon: string;
  text: string;
}

function MobileSection({ title, rows }: { title: string; rows: MobileRow[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: INDIGO,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderBottom: i < rows.length - 1 ? DIVIDER : 'none',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0, width: 22, textAlign: 'center' }}>
              {row.icon}
            </span>
            <span style={{ fontSize: 13, color: TEXT, lineHeight: 1.45 }}>{row.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileReadMe() {
  return (
    <div
      style={{
        padding: 16,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        color: '#fff',
        background: 'transparent',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Welcome 👋</div>
        <div style={{ fontSize: 13, color: FADED }}>Christian's Interactive Portfolio</div>
      </div>

      <MobileSection
        title="📱 How to navigate"
        rows={[
          { icon: '👆', text: 'Tap any app to open it' },
          { icon: '⬇️', text: 'Swipe down from the top for notifications' },
          { icon: '🔔', text: 'Tap the status bar to open the notification centre' },
          { icon: '🖼', text: 'Tap empty space to change wallpaper' },
          { icon: '📌', text: 'Long-press to flag in Minesweeper' },
        ]}
      />

      <MobileSection
        title="🗂 Portfolio"
        rows={[
          { icon: '👤', text: 'About: who I am, education & scholarships' },
          { icon: '💼', text: 'Experience: 6 internships across AI & industry' },
          { icon: '🚀', text: 'Projects: things I\'ve built' },
          { icon: '⚡', text: 'Skills: my tech stack' },
          { icon: '📄', text: 'Publications: ICSE-SEET 2024 paper' },
          { icon: '✉️', text: 'Contact: in the dock' },
        ]}
      />

      <MobileSection
        title="🎮 Arcade"
        rows={[
          { icon: '🐍', text: 'Snake' },
          { icon: '💣', text: 'Minesweeper' },
          { icon: '🟩', text: 'Wordle' },
          { icon: '🎯', text: 'Mastermind' },
          { icon: '🐦', text: 'Flappy Bird' },
          { icon: '🔢', text: '2048' },
        ]}
      />

      <MobileSection
        title="📋 Resume"
        rows={[
          { icon: '📥', text: 'Tap Resume to view & download my CV' },
        ]}
      />

      <div
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Built with React · Vite · Framer Motion
      </div>
    </div>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function ReadMeApp() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileReadMe /> : <DesktopReadMe />;
}
