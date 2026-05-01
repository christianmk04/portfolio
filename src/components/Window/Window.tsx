import { useRef, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/windowStore';
import type { AppId } from '../../store/windowStore';
import TrafficLights from './TrafficLights';
import { APPS } from '../../data/content';

interface Props {
  appId: AppId;
  children: ReactNode;
}

type ResizeEdge = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
type DragMode = { kind: 'move' } | { kind: 'resize'; edge: ResizeEdge };

interface DragState {
  mode: DragMode;
  startMouseX: number;
  startMouseY: number;
  startPosX: number;
  startPosY: number;
  startW: number;
  startH: number;
}

const MIN_W = 280;
const MIN_H = 180;
const MENU_BAR_H = 28;

export default function Window({ appId, children }: Props) {
  const win = useWindowStore((s) => s.windows[appId]);
  const bringToFront = useWindowStore((s) => s.bringToFront);
  const updatePosition = useWindowStore((s) => s.updatePosition);

  const appMeta = APPS.find((a) => a.id === appId)!;
  const { defaultSize } = appMeta;

  // Local position + size — no Draggable library, full control
  const [pos, setPos] = useState({ x: win.position.x, y: win.position.y });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: defaultSize.width,
    height: defaultSize.height,
  });

  // Keep pos in sync when the store updates externally (e.g. reinitializePositions)
  const lastStorePos = useRef(win.position);
  useEffect(() => {
    const sp = win.position;
    if (sp.x !== lastStorePos.current.x || sp.y !== lastStorePos.current.y) {
      lastStorePos.current = sp;
      setPos({ x: sp.x, y: sp.y });
    }
  }, [win.position]);

  const dragRef = useRef<DragState | null>(null);

  // Flush final position to store on mouseup
  const flushPos = useCallback(
    (p: { x: number; y: number }) => {
      lastStorePos.current = p;
      updatePosition(appId, p);
    },
    [appId, updatePosition],
  );

  // ── Global mouse tracking ──────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;

      const dx = e.clientX - d.startMouseX;
      const dy = e.clientY - d.startMouseY;

      if (d.mode.kind === 'move') {
        setPos({
          x: d.startPosX + dx,
          y: Math.max(MENU_BAR_H, d.startPosY + dy),
        });
        return;
      }

      const edge = d.mode.edge;
      let newW = d.startW;
      let newH = d.startH;
      let newX = d.startPosX;
      let newY = d.startPosY;

      // Horizontal
      if (edge === 'e' || edge === 'se' || edge === 'ne') {
        newW = Math.max(MIN_W, d.startW + dx);
      }
      if (edge === 'w' || edge === 'sw' || edge === 'nw') {
        newW = Math.max(MIN_W, d.startW - dx);
        newX = d.startPosX + (d.startW - newW);
      }

      // South: bottom moves, top stays
      if (edge === 's' || edge === 'se' || edge === 'sw') {
        newH = Math.max(MIN_H, d.startH + dy);
      }

      // North: bottom is fixed, top moves
      if (edge === 'n' || edge === 'ne' || edge === 'nw') {
        const windowBottom = d.startPosY + d.startH;
        const rawTop = d.startPosY + dy;
        newY = Math.max(MENU_BAR_H, rawTop);
        newH = Math.max(MIN_H, windowBottom - newY);
      }

      setSize({ width: newW, height: newH });
      setPos({ x: newX, y: newY });
    };

    const onUp = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      // Flush position to store after drag/resize ends
      setPos((p) => {
        flushPos(p);
        return p;
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [flushPos]);

  // ── Initiators ─────────────────────────────────────────────────────────────
  const startMove = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      bringToFront(appId);
      setPos((p) => {
        dragRef.current = {
          mode: { kind: 'move' },
          startMouseX: e.clientX,
          startMouseY: e.clientY,
          startPosX: p.x,
          startPosY: p.y,
          startW: size.width,
          startH: size.height,
        };
        return p;
      });
    },
    [appId, bringToFront, size],
  );

  const startResize = useCallback(
    (e: React.MouseEvent, edge: ResizeEdge) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      bringToFront(appId);
      setPos((p) => {
        dragRef.current = {
          mode: { kind: 'resize', edge },
          startMouseX: e.clientX,
          startMouseY: e.clientY,
          startPosX: p.x,
          startPosY: p.y,
          startW: size.width,
          startH: size.height,
        };
        return p;
      });
    },
    [appId, bringToFront, size],
  );

  // ── Resize handle style ────────────────────────────────────────────────────
  const H = (extra: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    zIndex: 10,
    userSelect: 'none',
    ...extra,
  });

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          key={appId}
          style={{
            position: 'absolute',
            top: pos.y,
            left: pos.x,
            zIndex: win.zIndex,
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0, scale: 0.93, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onMouseDown={() => bringToFront(appId)}
        >
          {/*
           * Outer wrapper: gives resize handles a clipping-free positioning
           * context, so overflow:hidden on .window-frame doesn't eat them.
           */}
          <div style={{ position: 'relative', width: size.width, height: size.height }}>

            {/* Glass window — fills the outer wrapper exactly */}
            <div
              className="window-frame"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Title bar — drag handle */}
              <div className="window-titlebar" onMouseDown={startMove} style={{ cursor: 'grab' }}>
                <TrafficLights appId={appId} />
                <span className="window-title">{appMeta.label}</span>
                <div style={{ width: 52 }} />
              </div>

              {/* Scrollable content — flex:1 fills remaining height, overflowY in CSS */}
              <div className="window-content">
                {children}
              </div>
            </div>

            {/* ── Resize handles — outside .window-frame so overflow:hidden doesn't clip them ── */}
            {/* Edges */}
            <div style={H({ top: -6, left: 16, right: 16, height: 12, cursor: 'n-resize' })}     onMouseDown={(e) => startResize(e, 'n')} />
            <div style={H({ bottom: -6, left: 16, right: 16, height: 12, cursor: 's-resize' })}  onMouseDown={(e) => startResize(e, 's')} />
            <div style={H({ left: -6, top: 16, bottom: 16, width: 12, cursor: 'w-resize' })}     onMouseDown={(e) => startResize(e, 'w')} />
            <div style={H({ right: -6, top: 16, bottom: 16, width: 12, cursor: 'e-resize' })}    onMouseDown={(e) => startResize(e, 'e')} />
            {/* Corners */}
            <div style={H({ top: -6, left: -6, width: 20, height: 20, cursor: 'nw-resize' })}   onMouseDown={(e) => startResize(e, 'nw')} />
            <div style={H({ top: -6, right: -6, width: 20, height: 20, cursor: 'ne-resize' })}  onMouseDown={(e) => startResize(e, 'ne')} />
            <div style={H({ bottom: -6, left: -6, width: 20, height: 20, cursor: 'sw-resize' })} onMouseDown={(e) => startResize(e, 'sw')} />
            <div style={H({ bottom: -6, right: -6, width: 20, height: 20, cursor: 'se-resize' })} onMouseDown={(e) => startResize(e, 'se')} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
