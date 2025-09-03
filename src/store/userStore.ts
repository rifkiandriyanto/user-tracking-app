// src/store/userStore.ts
import { atom } from "jotai";
import { User } from "@/lib//simulation";

export const usersAtom = atom<User[]>([]);
export const followUserIdAtom = atom<string | null>(null);
export const isFollowingAtom = atom((get) => get(followUserIdAtom) !== null);

export const userToFollowAtom = atom((get) => {
  const users = get(usersAtom);
  const userId = get(followUserIdAtom);
  if (!userId) return null;
  return users.find((user) => user.id === userId) || null;
});
