import { create } from "zustand";

export const useThreadStore = create((set) => ({
  threads: [],
  setThreads: (threads) => set({ threads }),
  addThread: (thread) => set((state) => ({ threads: [...state.threads, thread] })),
  clearThreads: () => set({ threads: [] }),
}));