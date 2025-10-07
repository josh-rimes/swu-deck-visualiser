"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardKey } from "@/types/swu";


export type DeckFormat = "Premier" | "TwinSuns";
export type DeckCard = CardKey & { count: number };


export type Deck = {
id: string;
name: string;
format: DeckFormat;
leader: CardKey | null;
leader2: CardKey | null; // only for TwinSuns
base: CardKey | null;
cards: DeckCard[]; // draw deck only
};


const defaultDeck: Deck = {
id: "local",
name: "New Deck",
format: "Premier",
leader: null,
leader2: null,
base: null,
cards: [],
};


function maxCopies(format: DeckFormat) {
return format === "TwinSuns" ? 1 : 3;
}


export type DeckState = {
deck: Deck;
setName: (name: string) => void;
setFormat: (fmt: DeckFormat) => void;
setLeader: (k: CardKey | null) => void;
setLeader2: (k: CardKey | null) => void;
setBase: (k: CardKey | null) => void;
addCard: (k: CardKey) => void;
removeCard: (k: CardKey) => void;
setCount: (k: CardKey, count: number) => void;
clear: () => void;
};


export const useDeck = create<DeckState>()(
persist(
(set, get) => ({
deck: defaultDeck,
setName: (name) => set((s) => ({ deck: { ...s.deck, name } })),
setFormat: (format) => set((s) => {
const m = maxCopies(format);
// clamp counts when switching to TwinSuns
const clamped = s.deck.cards.map((c) => ({ ...c, count: Math.min(c.count, m) }));
return { deck: { ...s.deck, format, cards: clamped, leader2: format === "TwinSuns" ? s.deck.leader2 : null } };
}),
setLeader: (leader) => set((s) => ({ deck: { ...s.deck, leader } })),
setLeader2: (leader2) => set((s) => ({ deck: { ...s.deck, leader2 } })),
setBase: (base) => set((s) => ({ deck: { ...s.deck, base } })),
addCard: (k) => set((s) => {
const m = maxCopies(s.deck.format);
const key = `${k.set}-${k.num}`;
const cards = [...s.deck.cards];
const i = cards.findIndex((c) => `${c.set}-${c.num}` === key);
if (i === -1) cards.push({ ...k, count: 1 });
else cards[i] = { ...cards[i], count: Math.min(cards[i].count + 1, m) };
return { deck: { ...s.deck, cards } };
}),
removeCard: (k) => set((s) => {
const key = `${k.set}-${k.num}`;
let cards = [...s.deck.cards];
const i = cards.findIndex((c) => `${c.set}-${c.num}` === key);
if (i !== -1) {
const n = Math.max(0, cards[i].count - 1);
if (n === 0) cards.splice(i, 1);
else cards[i] = { ...cards[i], count: n };
}
return { deck: { ...s.deck, cards } };
}),
setCount: (k, count) => set((s) => {
const m = maxCopies(s.deck.format);
const capped = Math.max(0, Math.min(count, m));
const key = `${k.set}-${k.num}`;
let cards = [...s.deck.cards];
const i = cards.findIndex((c) => `${c.set}-${c.num}` === key);
if (i === -1 && capped > 0) cards.push({ ...k, count: capped });
else if (i !== -1) {
if (capped === 0) cards.splice(i, 1);
else cards[i] = { ...cards[i], count: capped };
}
return { deck: { ...s.deck, cards } };
}),
clear: () => set({ deck: { ...defaultDeck } }),
}),
{ name: "swu-deck" }
)
);


export const selectors = {
totalDraw: (s: DeckState) => s.deck.cards.reduce((acc, c) => acc + c.count, 0),
};