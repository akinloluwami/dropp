import { create } from "zustand";

interface UserProps {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: UserProps;
  setUser: (user: UserProps) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: { id: "", name: "", email: "" },
  setUser: (user) => set({ user }),
}));
