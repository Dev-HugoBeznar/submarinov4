import { create } from "zustand";

//esto va a ser para el clicar en los cubos
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

export const useLayoutStore = create<LayoutStore>((set) => ({
  layout: { x: 0, y: 0, width: 0, height: 0 },
  setLayout: (newLayout) => set({ layout: newLayout }),
}));

//este estado es para el tamaño del tablero
interface grideState {
  size: number;
  updateSize: (newSize: number) => void;
}

export const useGridSize = create<grideState>((set) => ({
  size: 10,
  updateSize: (newSize) => set({ size: newSize }),
}));
