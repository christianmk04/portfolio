import { Box, Typography } from '@mui/material';
import { useClock } from '../../hooks/useClock';

export default function MenuBar() {
  const time = useClock();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '28px',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '16px',
        background: 'rgba(0, 0, 0, 0.38)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '0.01em',
        }}
      >
        Christian Koh
      </Typography>

      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.01em',
        }}
      >
        {time}
      </Typography>
    </Box>
  );
}
