import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LockScreen from './components/LockScreen/LockScreen';
import IOSLockScreen from './components/LockScreen/IOSLockScreen';
import Desktop from './components/Desktop/Desktop';
import IOSDesktop from './components/iOS/IOSDesktop';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const [macLocked, setMacLocked] = useState(true);
  const [iosLocked, setIosLocked] = useState(true);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Both desktops pre-render; only the active one is visible */}
      {isMobile ? <IOSDesktop /> : <Desktop />}

      {/* Lock screen sits on top, slides up on unlock */}
      <AnimatePresence>
        {isMobile
          ? iosLocked && <IOSLockScreen key="ios-lock" onUnlock={() => setIosLocked(false)} />
          : macLocked && <LockScreen    key="mac-lock" onUnlock={() => setMacLocked(false)} />
        }
      </AnimatePresence>
    </>
  );
}
