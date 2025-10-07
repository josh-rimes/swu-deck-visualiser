import type { Deck } from "@/store/deck";


export type Validation = { ok: boolean; errors: string[]; warnings: string[] };


export function validateDeck(deck: Deck): Validation {
const errors: string[] = [];
const warnings: string[] = [];


// required slots
if (!deck.leader) errors.push("Missing Leader");
if (!deck.base) errors.push("Missing Base");


// counts & copies
const total = deck.cards.reduce((a, c) => a + c.count, 0);
const maxCopies = deck.format === "TwinSuns" ? 1 : 3;
const minCards = deck.format === "TwinSuns" ? 80 : 50;


if (total < minCards) errors.push(`Minimum ${minCards} draw cards`);


const copyViolations = deck.cards.filter((c) => c.count > maxCopies);
if (copyViolations.length) {
errors.push(`Copy limit exceeded on ${copyViolations.length} card(s)`);
}


// Twin Suns requires two leaders (often same alignment; not enforced here due to data needs)
if (deck.format === "TwinSuns" && !deck.leader2) warnings.push("Twin Suns: add your second Leader");


return { ok: errors.length === 0, errors, warnings };
}