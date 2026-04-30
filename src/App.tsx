import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootScreen from './components/BootScreen/BootScreen';
import Desktop from './components/Desktop/Desktop';

export default function App() {
  const [hasBooted, setHasBooted] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!hasBooted && (
          <BootScreen onComplete={() => setHasBooted(true)} />
        )}
      </AnimatePresence>

      {hasBooted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'fixed', inset: 0 }}
        >
          <Desktop />
        </motion.div>
      )}
    </>
  );
}
