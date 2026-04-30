import { create } from 'zustand';
import { APPS } from '../data/content';

export type AppId =
  | 'about' | 'experience' | 'projects' | 'skills' | 'publications' | 'contact'
  | 'snake' | 'minesweeper' | 'terminal' | 'readme';

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
}

const initialWindows = (): Record<AppId, WindowState> => {
  const result = {} as Record<AppId, WindowState>;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  // Two-column icon grid, anchored to the right edge
  const col0X = vw - 90;   // right column
  const col1X = vw - 178;  // left column (84px gap)

  APPS.forEach((app, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const iconX = col === 0 ? col0X : col1X;
    const iconY = 48 + row * 90;

    const isReadme = app.id === 'readme';
    result[app.id as AppId] = {
      id: app.id as AppId,
      // readme opens automatically on first load, centred
      isOpen: isReadme,
      isMinimized: false,
      zIndex: isReadme ? 1001 : 1000,
      position: isReadme
        ? { x: Math.max(40, (vw - 500) / 2), y: Math.max(40, (vh - 560) / 2 - 20) }
        : { x: 0, y: 0 },
      hasBeenPositioned: isReadme,
      iconPosition: { x: iconX, y: iconY },
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
}));
