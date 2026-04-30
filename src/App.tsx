import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LockScreen from './components/LockScreen/LockScreen';
import IOSLockScreen from './components/LockScreen/IOSLockScreen';
import Desktop from './components/Desktop/Desktop';
import IOSDesktop from './components/iOS/IOSDesktop';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const [locked, setLocked] = useState(true);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop pre-renders underneath — instant reveal on unlock */}
      {isMobile ? <IOSDesktop /> : <Desktop />}

      {/* Lock screen slides upward on unlock */}
      <AnimatePresence>
        {locked && (
          isMobile
            ? <IOSLockScreen onUnlock={() => setLocked(false)} />
            : <LockScreen    onUnlock={() => setLocked(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
