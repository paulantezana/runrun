import { SESSION_KEY } from "core/setting";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

const initialState = (() => {
  const loginData = JSON.parse(localStorage.getItem(SESSION_KEY));
  if(!loginData){
    return null;
  }

  // const isTokenExpired = new Date(jwtDecode(loginData.token).exp * 1000) < new Date();

  // if (!isTokenExpired) {
  //   return null;
  // }

  return loginData?.user ?? null;
})();

const useAuthStore = create((set) => ({
  user: initialState,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;

// export const useThreadStore = create((set) => ({
//   threads: [],
//   setThreads: (threads) => set({ threads }),
//   addThread: (thread) => set((state) => ({ threads: [...state.threads, thread] })),
//   clearThreads: () => set({ threads: [] }),
// }));

// export const useMessageStore = create((set) => ({
//   messages: [],
//   setMessages: (messages) => set({ messages }),
//   addMessage: (message) =>
//     set((state) => ({ messages: [...state.messages, message] })),
// }));
