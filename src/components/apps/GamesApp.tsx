import { Box, Typography } from '@mui/material';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';

const GAMES: { id: AppId; icon: string; label: string; description: string }[] = [
  { id: 'snake',            icon: '🐍', label: 'Snake',       description: 'Arrow keys / WASD · eat food, avoid walls' },
  { id: 'minesweeper',      icon: '💣', label: 'Minesweeper', description: 'Click to reveal · right-click to flag' },
  { id: 'wordle',           icon: '🟩', label: 'Wordle',      description: 'Guess the 5-letter word in 6 tries' },
  { id: 'mastermind',       icon: '🎯', label: 'Mastermind',  description: 'Crack the hidden colour code in 10 guesses' },
  { id: 'flappybird',       icon: '🐦', label: 'Flappy Bird', description: 'Space / click to flap · avoid the pipes' },
  { id: 'twentyfortyeight', icon: '🔢', label: '2048',        description: 'Arrow keys to slide · merge tiles to 2048' },
];

export default function GamesApp() {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', mb: 0.5 }}>
        {GAMES.length} games · click to launch
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {GAMES.map((game) => (
          <Box
            key={game.id}
            onClick={() => openWindow(game.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
              '&:hover': {
                background: 'rgba(99,102,241,0.15)',
                borderColor: 'rgba(99,102,241,0.4)',
              },
              '&:active': { transform: 'scale(0.97)' },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: 'rgba(99,102,241,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {game.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff', mb: 0.25 }}>
                {game.label}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                {game.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
