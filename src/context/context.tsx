import { create } from "zustand";

// Define the shape of the layout state
export interface LayoutState {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutStore {
  layout: LayoutState;
  setLayout: (newLayout: LayoutState) => void;
}

// Create the store
export const useLayoutStore = create<LayoutStore>((set) => ({
  layout: { x: 0, y: 0, width: 0, height: 0 },
  setLayout: (newLayout) => set({ layout: newLayout }),
}));
