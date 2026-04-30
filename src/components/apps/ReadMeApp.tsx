import { Box, Typography } from '@mui/material';

interface Section {
  title: string;
  items: { icon: string; text: string }[];
}

const sections: Section[] = [
  {
    title: '🗂 Portfolio Apps',
    items: [
      { icon: '👤', text: 'About — who I am, education & scholarships' },
      { icon: '💼', text: 'Experience — 6 internships across AI & industry' },
      { icon: '🚀', text: 'Projects — things I\'ve built' },
      { icon: '⚡', text: 'Skills — my tech stack' },
      { icon: '📄', text: 'Publications — my ICSE-SEET 2024 paper' },
      { icon: '✉️', text: 'Contact — let\'s connect' },
    ],
  },
  {
    title: '🎮 Games & Tools',
    items: [
      { icon: '🐍', text: 'Snake — press Space to start, arrow keys to play' },
      { icon: '💣', text: 'Minesweeper — left-click reveals, right-click flags' },
      { icon: '💻', text: 'Terminal — type help for a list of commands' },
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

export default function ReadMeApp() {
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
          This is an interactive desktop OS — explore the apps below,<br />
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
