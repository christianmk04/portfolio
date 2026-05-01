import { create } from 'zustand';
import { APPS, VISIBLE_APPS } from '../data/content';

export type AppId =
  | 'about' | 'experience' | 'projects' | 'skills' | 'publications' | 'contact'
  | 'snake' | 'minesweeper' | 'terminal' | 'readme'
  | 'wordle' | 'mastermind' | 'flappybird' | 'twentyfortyeight'
  | 'resume' | 'finder' | 'games'
  | 'aboutmac' | 'preferences'
  | 'imessage';

interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  hasBeenPositioned: boolean;
  iconPosition: { x: number; y: number };
}

interface WindowStore {
  windows: Record<AppId, WindowState>;
  topZIndex: number;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  bringToFront: (id: AppId) => void;
  updatePosition: (id: AppId, pos: { x: number; y: number }) => void;
  updateIconPosition: (id: AppId, pos: { x: number; y: number }) => void;
  reinitializePositions: () => void;
}

const initialWindows = (): Record<AppId, WindowState> => {
  const result = {} as Record<AppId, WindowState>;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  // Two-column icon grid, anchored to the right edge (macOS style)
  const col0X = vw - 90;   // right column
  const col1X = vw - 178;  // left column (84px gap)

  // Build icon position map for visible (non-game) apps only
  const iconsPerCol = Math.ceil(VISIBLE_APPS.length / 2);
  const iconPositions: Partial<Record<AppId, { x: number; y: number }>> = {};
  VISIBLE_APPS.forEach((app, index) => {
    const col = Math.floor(index / iconsPerCol);
    const row = index % iconsPerCol;
    iconPositions[app.id as AppId] = {
      x: col === 0 ? col0X : col1X,
      y: 48 + row * 90,
    };
  });

  // ALL apps need window state (games are launched from the Games folder)
  APPS.forEach((app) => {
    const isReadme = app.id === 'readme';
    result[app.id as AppId] = {
      id: app.id as AppId,
      isOpen: isReadme,
      isMinimized: false,
      zIndex: isReadme ? 1001 : 1000,
      position: isReadme
        ? { x: Math.max(40, (vw - 500) / 2), y: Math.max(40, (vh - 560) / 2 - 20) }
        : { x: 0, y: 0 },
      hasBeenPositioned: isReadme,
      iconPosition: iconPositions[app.id as AppId] ?? { x: -200, y: -200 }, // off-screen for hidden apps
    };
  });
  return result;
};

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: initialWindows(),
  topZIndex: 1000,

  bringToFront: (id) => {
    const next = get().topZIndex + 1;
    set((state) => ({
      topZIndex: next,
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex: next },
      },
    }));
  },

  openWindow: (id) => {
    const state = get();
    const appIndex = APPS.findIndex((a) => a.id === id);
    const win = state.windows[id];
    const next = state.topZIndex + 1;

    // Calculate staggered initial position clamped to viewport
    const { defaultSize } = APPS[appIndex];
    const menuBarH = 28;
    const dockH = 90;
    const maxX = Math.max(0, window.innerWidth - defaultSize.width - 40);
    const maxY = Math.max(0, window.innerHeight - defaultSize.height - dockH - menuBarH - 40);

    const baseX = 80 + appIndex * 28;
    const baseY = 60 + appIndex * 22;
    const clampedX = Math.min(baseX, maxX);
    const clampedY = Math.min(baseY, maxY) + menuBarH;

    set((state) => ({
      topZIndex: next,
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: next,
          position: win.hasBeenPositioned ? win.position : { x: clampedX, y: clampedY },
          hasBeenPositioned: true,
        },
      },
    }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: false },
      },
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true },
      },
    }));
  },

  updatePosition: (id, pos) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position: pos, hasBeenPositioned: true },
      },
    }));
  },

  updateIconPosition: (id, pos) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], iconPosition: pos },
      },
    }));
  },

  reinitializePositions: () => {
    const vw = window.innerWidth;
    const col0X = vw - 90;
    const col1X = vw - 178;
    const iconsPerCol = Math.ceil(VISIBLE_APPS.length / 2);
    set((state) => {
      const updated = { ...state.windows };
      VISIBLE_APPS.forEach((app, index) => {
        const col = Math.floor(index / iconsPerCol);
        const row = index % iconsPerCol;
        const iconX = col === 0 ? col0X : col1X;
        const iconY = 48 + row * 90;
        updated[app.id as AppId] = {
          ...updated[app.id as AppId],
          iconPosition: { x: iconX, y: iconY },
        };
      });
      return { windows: updated };
    });
  },
}));
