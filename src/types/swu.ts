export type SwuCard = {
name: string;
set: string; // e.g. "sor"
setnumber: number; // e.g. 10
type: "unit" | "event" | "upgrade" | "leader" | "base" | string;
cost?: number | null;
power?: number | null;
hp?: number | null;
rarity?: string | null;
traits?: string[] | null;
aspects?: string[] | null; // e.g. ["Command", "Villainy"]
arenas?: string[] | null; // e.g. ["ground"] | ["space"]
text?: string | null;
artist?: string | null;
};


export type CardKey = { set: string; num: number };


export function cardKey(c: SwuCard): CardKey {
return { set: c.set, num: c.setnumber };
}


export function keyToId(k: CardKey) {
return `${k.set}-${k.num}`;
}