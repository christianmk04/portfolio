import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8' },
    secondary: { main: '#38bdf8' },
    background: { default: 'transparent', paper: 'rgba(28,28,35,0.72)' },
  },
  typography: {
    fontFamily: "-apple-system, 'Inter', 'SF Pro Display', system-ui, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "inherit" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(20,20,28,0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
  },
});
