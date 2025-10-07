"use client";
import { create } from "zustand";
import type { SwuCard } from "@/types/swu";


type Entry = { [id: string]: SwuCard };


export const useCardCache = create<{ cache: Entry; put: (c: SwuCard) => void }>((set) => ({
cache: {},
put: (c) => set((s) => ({ cache: { ...s.cache, [`${c.set}-${c.setnumber}`]: c } })),
}));