import { create } from 'zustand';

export interface StickyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  colorIndex: number;
}

export interface Toast {
  id: string;
  message: string;
}

export const WALLPAPERS = [
  // Purple / blue (default)
  `radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.4) 0%, transparent 60%),
   radial-gradient(ellipse at 80% 20%, rgba(0,120,220,0.5) 0%, transparent 55%),
   radial-gradient(ellipse at 60% 80%, rgba(0,180,180,0.35) 0%, transparent 50%),
   radial-gradient(ellipse at 10% 10%, rgba(80,0,180,0.3) 0%, transparent 40%),
   linear-gradient(135deg, #0d0d1a 0%, #0a1628 50%, #0d1a2e 100%)`,
  // Emerald / teal
  `radial-gradient(ellipse at 30% 60%, rgba(0,180,100,0.45) 0%, transparent 60%),
   radial-gradient(ellipse at 75% 25%, rgba(0,200,160,0.4) 0%, transparent 55%),
   radial-gradient(ellipse at 60% 80%, rgba(0,140,120,0.3) 0%, transparent 50%),
   linear-gradient(135deg, #020f0a 0%, #051a10 50%, #061a14 100%)`,
  // Amber / red
  `radial-gradient(ellipse at 70% 30%, rgba(220,80,0,0.45) 0%, transparent 60%),
   radial-gradient(ellipse at 20% 70%, rgba(200,40,0,0.4) 0%, transparent 55%),
   radial-gradient(ellipse at 50% 50%, rgba(180,100,0,0.3) 0%, transparent 50%),
   linear-gradient(135deg, #130800 0%, #1a0e00 50%, #130800 100%)`,
  // Rose / pink
  `radial-gradient(ellipse at 50% 40%, rgba(200,0,120,0.4) 0%, transparent 60%),
   radial-gradient(ellipse at 80% 70%, rgba(180,0,180,0.35) 0%, transparent 55%),
   radial-gradient(ellipse at 20% 20%, rgba(220,50,100,0.3) 0%, transparent 50%),
   linear-gradient(135deg, #130010 0%, #1a001a 50%, #130010 100%)`,
];

interface DesktopStore {
  wallpaperIndex: number;
  cycleWallpaper: () => void;

  stickyNotes: StickyNote[];
  addStickyNote: (x: number, y: number) => void;
  deleteNote: (id: string) => void;
  updateNoteText: (id: string, text: string) => void;
  updateNotePosition: (id: string, pos: { x: number; y: number }) => void;

  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: string) => void;

  openedApps: Set<string>;
  markOpened: (id: string) => void;
}

let noteColorCounter = 0;

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  wallpaperIndex: 0,
  cycleWallpaper: () =>
    set((s) => ({ wallpaperIndex: (s.wallpaperIndex + 1) % WALLPAPERS.length })),

  stickyNotes: [],
  addStickyNote: (x, y) => {
    const colorIndex = noteColorCounter % 4;
    noteColorCounter++;
    set((s) => ({
      stickyNotes: [
        ...s.stickyNotes,
        { id: crypto.randomUUID(), text: '', x, y, colorIndex },
      ],
    }));
  },
  deleteNote: (id) =>
    set((s) => ({ stickyNotes: s.stickyNotes.filter((n) => n.id !== id) })),
  updateNoteText: (id, text) =>
    set((s) => ({
      stickyNotes: s.stickyNotes.map((n) => (n.id === id ? { ...n, text } : n)),
    })),
  updateNotePosition: (id, pos) =>
    set((s) => ({
      stickyNotes: s.stickyNotes.map((n) => (n.id === id ? { ...n, ...pos } : n)),
    })),

  toasts: [],
  addToast: (message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openedApps: new Set(),
  markOpened: (id) =>
    set((s) => ({ openedApps: new Set([...s.openedApps, id]) })),
}));
