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
  // 1 — Aurora Borealis: dark arctic sky with flowing green/teal/violet aurora
  `radial-gradient(ellipse 90% 50% at 30% 55%, rgba(0,210,100,0.32) 0%, transparent 60%),
   radial-gradient(ellipse 70% 40% at 72% 48%, rgba(100,30,220,0.22) 0%, transparent 55%),
   radial-gradient(ellipse 110% 38% at 52% 42%, rgba(0,190,160,0.20) 0%, transparent 58%),
   radial-gradient(ellipse 45% 22% at 18% 32%, rgba(0,230,130,0.28) 0%, transparent 42%),
   radial-gradient(ellipse 55% 28% at 82% 38%, rgba(80,10,200,0.20) 0%, transparent 40%),
   radial-gradient(ellipse 100% 55% at 50% 100%, rgba(5,30,5,0.9) 0%, transparent 55%),
   linear-gradient(180deg, #010306 0%, #020610 18%, #010a0e 42%, #020e08 68%, #071a0a 100%)`,

  // 2 — Alpine Sunrise: warm golden sunrise behind mountain silhouettes
  `radial-gradient(ellipse 90% 45% at 50% 52%, rgba(255,185,55,0.65) 0%, transparent 48%),
   radial-gradient(ellipse 55% 28% at 50% 50%, rgba(255,100,25,0.45) 0%, transparent 40%),
   radial-gradient(ellipse 110% 55% at 50% 100%, rgba(15,35,8,0.85) 0%, transparent 58%),
   linear-gradient(180deg,
     #0e0520 0%, #1e0a42 7%, #520a60 13%, #94205a 19%,
     #d03818 24%, #ee7228 29%, #f4b040 34%, #ecc848 38%,
     #78a035 40%, #3a6018 44%, #1e4008 54%, #0e2205 70%, #080e02 100%)`,

  // 3 — Deep Ocean Horizon: tranquil ocean with golden sunrise reflection
  `radial-gradient(ellipse 75% 28% at 50% 43%, rgba(255,215,100,0.38) 0%, transparent 48%),
   radial-gradient(ellipse 45% 18% at 50% 43%, rgba(255,160,55,0.28) 0%, transparent 38%),
   radial-gradient(ellipse 110% 52% at 50% 100%, rgba(0,15,50,0.8) 0%, transparent 58%),
   linear-gradient(180deg,
     #060c18 0%, #0a1828 8%, #101e30 18%, #163545 28%,
     #155870 36%, #147898 41%, #158aaa 42%, #0e7898 43%,
     #0c5878 48%, #083060 62%, #040e22 84%, #020810 100%)`,

  // 4 — Ancient Forest: cathedral forest with golden morning light shafts
  `radial-gradient(ellipse 55% 75% at 50% 0%, rgba(210,170,55,0.52) 0%, transparent 52%),
   radial-gradient(ellipse 25% 55% at 38% 15%, rgba(190,145,35,0.38) 0%, transparent 42%),
   radial-gradient(ellipse 20% 55% at 62% 12%, rgba(170,125,25,0.28) 0%, transparent 38%),
   radial-gradient(ellipse 110% 55% at 50% 100%, rgba(3,12,1,0.75) 0%, transparent 58%),
   linear-gradient(180deg,
     #c8b848 0%, #88a038 5%, #507820 10%, #386015 16%,
     #264e0e 24%, #1a3c08 32%, #122e05 44%, #0a2203 58%,
     #071602 72%, #050e01 86%, #030a01 100%)`,

  // 5 — Desert Twilight: deep violet/crimson sky at desert dusk
  `radial-gradient(ellipse 75% 38% at 50% 52%, rgba(210,75,18,0.52) 0%, transparent 54%),
   radial-gradient(ellipse 48% 22% at 50% 50%, rgba(245,115,28,0.38) 0%, transparent 40%),
   radial-gradient(ellipse 110% 50% at 50% 100%, rgba(38,8,0,0.80) 0%, transparent 55%),
   linear-gradient(180deg,
     #060010 0%, #120030 7%, #280055 13%, #580888 19%,
     #941855 24%, #c82818 29%, #e84818 33%,
     #f07028 36%, #e06820 40%, #c04808 42%,
     #604025 44%, #3e2510 52%, #261208 68%, #160804 84%, #0c0402 100%)`,
];

// ── iOS wallpapers (shared between home screen and lock screen) ──
export const IOS_WALLPAPERS = [
  // Deep indigo/violet — default
  `radial-gradient(ellipse at 20% 10%, rgba(168,130,255,0.8) 0%, transparent 50%),
   radial-gradient(ellipse at 85% 80%, rgba(60,140,255,0.7) 0%, transparent 50%),
   radial-gradient(ellipse at 60% 40%, rgba(100,60,200,0.4) 0%, transparent 40%),
   linear-gradient(160deg, #0d0d2e 0%, #0a0a20 100%)`,
  // Sunset coral/rose
  `radial-gradient(ellipse at 30% 20%, rgba(255,150,80,0.8) 0%, transparent 50%),
   radial-gradient(ellipse at 75% 75%, rgba(255,80,120,0.6) 0%, transparent 50%),
   radial-gradient(ellipse at 60% 50%, rgba(200,50,150,0.4) 0%, transparent 40%),
   linear-gradient(160deg, #2a0a18 0%, #150510 100%)`,
  // Ocean teal
  `radial-gradient(ellipse at 20% 70%, rgba(0,200,180,0.7) 0%, transparent 50%),
   radial-gradient(ellipse at 80% 20%, rgba(0,140,255,0.6) 0%, transparent 50%),
   linear-gradient(160deg, #020f14 0%, #030a10 100%)`,
  // Midnight gold
  `radial-gradient(ellipse at 50% 20%, rgba(255,200,60,0.5) 0%, transparent 50%),
   radial-gradient(ellipse at 20% 80%, rgba(200,100,20,0.4) 0%, transparent 45%),
   linear-gradient(160deg, #0f0a00 0%, #180e00 100%)`,
];

interface DesktopStore {
  wallpaperIndex: number;
  cycleWallpaper: () => void;

  iosWallpaperIndex: number;
  cycleIOSWallpaper: () => void;

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

  iosWallpaperIndex: 0,
  cycleIOSWallpaper: () =>
    set((s) => ({ iosWallpaperIndex: (s.iosWallpaperIndex + 1) % IOS_WALLPAPERS.length })),

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
