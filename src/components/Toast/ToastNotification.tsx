import { AnimatePresence, motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useDesktopStore } from '../../store/desktopStore';

export default function ToastNotification() {
  const toasts = useDesktopStore((s) => s.toasts);
  const removeToast = useDesktopStore((s) => s.removeToast);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 90,
        right: 16,
        zIndex: 9800,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ pointerEvents: 'auto' }}
          >
            <Box
              onClick={() => removeToast(toast.id)}
              sx={{
                width: 260,
                px: 2,
                py: 1.25,
                borderRadius: '10px',
                background: 'rgba(18,18,26,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>
                {toast.message}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
