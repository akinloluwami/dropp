import { create } from "zustand";

interface UserProps {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface UserStore {
  user: UserProps;
  setUser: (user: UserProps) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: { id: "", name: "", email: "", isVerified: false },
  setUser: (user) => set({ user }),
}));
