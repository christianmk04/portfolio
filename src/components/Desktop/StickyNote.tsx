import { useRef } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';

interface Props {
  id: string;
  text: string;
  x: number;
  y: number;
  colorIndex: number;
}

const COLORS = [
  { bg: '#fef08a', header: '#eab308', text: '#713f12' },
  { bg: '#fbcfe8', header: '#ec4899', text: '#831843' },
  { bg: '#bae6fd', header: '#38bdf8', text: '#0c4a6e' },
  { bg: '#bbf7d0', header: '#34d399', text: '#065f46' },
];

export default function StickyNote({ id, text, x, y, colorIndex }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const deleteNote = useDesktopStore((s) => s.deleteNote);
  const updateNoteText = useDesktopStore((s) => s.updateNoteText);
  const updateNotePosition = useDesktopStore((s) => s.updateNotePosition);

  const color = COLORS[colorIndex % COLORS.length];

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x, y }}
      handle=".sticky-header"
      onStop={(_, d) => updateNotePosition(id, { x: d.x, y: d.y })}
    >
      <motion.div
        ref={nodeRef}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 500,
          width: 180,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          borderRadius: 6,
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Header / drag handle */}
        <div
          className="sticky-header"
          style={{
            background: color.header,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            cursor: 'grab',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)' }}>Note</span>
          <button
            onClick={() => deleteNote(id)}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 16,
              height: 16,
              cursor: 'pointer',
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.6)',
              lineHeight: 1,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <textarea
          value={text}
          onChange={(e) => updateNoteText(id, e.target.value)}
          placeholder="Type a note…"
          style={{
            display: 'block',
            width: '100%',
            minHeight: 100,
            background: color.bg,
            color: color.text,
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: '8px 10px',
            fontSize: 12,
            lineHeight: 1.55,
            fontFamily: 'Tahoma, Arial, sans-serif',
            cursor: 'text',
            userSelect: 'text',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </motion.div>
    </Draggable>
  );
}
