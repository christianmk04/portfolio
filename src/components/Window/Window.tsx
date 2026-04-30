import { useRef } from 'react';
import type { ReactNode } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import TrafficLights from './TrafficLights';
import { APPS } from '../../data/content';

interface Props {
  appId: AppId;
  children: ReactNode;
}

export default function Window({ appId, children }: Props) {
  const win = useWindowStore((s) => s.windows[appId]);
  const bringToFront = useWindowStore((s) => s.bringToFront);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  // nodeRef is required by react-draggable in React 18 to avoid findDOMNode
  const nodeRef = useRef<HTMLDivElement>(null);

  const appMeta = APPS.find((a) => a.id === appId)!;
  const { defaultSize } = appMeta;

  const dragBounds = {
    left: 0,
    top: 28,
    right: Math.max(0, window.innerWidth - defaultSize.width),
    bottom: Math.max(0, window.innerHeight - 100),
  };

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          key={appId}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: win.zIndex,
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0, scale: 0.93, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onMouseDown={() => bringToFront(appId)}
        >
          <Draggable
            nodeRef={nodeRef}
            handle=".window-titlebar"
            bounds={dragBounds}
            position={win.position}
            onStop={(_, data) => updatePosition(appId, { x: data.x, y: data.y })}
          >
            <div
              ref={nodeRef}
              className="window-frame"
              style={{
                width: defaultSize.width,
                minHeight: 200,
              }}
            >
              <div className="window-titlebar">
                <TrafficLights appId={appId} />
                <span className="window-title">{appMeta.label}</span>
                <div style={{ width: 52 }} />
              </div>
              <div
                className="window-content"
                style={{ maxHeight: defaultSize.height - 40 }}
              >
                {children}
              </div>
            </div>
          </Draggable>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
