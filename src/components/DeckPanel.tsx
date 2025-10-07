"use client";
import { useDeck, selectors } from "@/store/deck";
import { validateDeck } from "@/lib/validate";
import { useCardCache } from "@/store/cardCache";


function Row({ id, name, count, onInc, onDec }: { id: string; name: string; count: number; onInc: () => void; onDec: () => void }) {
return (
<div className="flex items-center justify-between py-1 border-b last:border-b-0">
<span className="truncate pr-2">{name}</span>
<div className="flex items-center gap-2">
<button onClick={onDec} className="border rounded px-2">-</button>
<span className="w-6 text-center">{count}</span>
<button onClick={onInc} className="border rounded px-2">+</button>
</div>
</div>
);
}


export default function DeckPanel() {
const deck = useDeck((s) => s.deck);
const setFormat = useDeck((s) => s.setFormat);
const setName = useDeck((s) => s.setName);
const add = useDeck((s) => s.addCard);
const remove = useDeck((s) => s.removeCard);
const total = useDeck(selectors.totalDraw);
const cache = useCardCache((s) => s.cache);
const safeCards = deck.cards.filter(
  (c) => c && typeof c.set === "string" && c.set && Number.isFinite(Number(c.num))
);


{safeCards.map((c) => {
  const id = `${c.set}-${c.num}`;
  const setLabel = c.set.toUpperCase();
  const numLabel = Number(c.num);
  return (
    <Row
      key={id}
      id={id}
      name={cache?.[id]?.name ?? `${setLabel} ${numLabel}`}
      count={c.count}
      onInc={() => add({ set: c.set, num: Number(c.num) })}
      onDec={() => remove({ set: c.set, num: Number(c.num) })}
    />
  );
})}


const v = validateDeck(deck);


return (
<div className="space-y-3">
<input className="border rounded px-3 py-2 w-full" value={deck.name} onChange={(e) => setName(e.target.value)} />


<div className="flex gap-2 items-center">
<label className="text-sm">Format:</label>
<select className="border rounded px-2 py-1" value={deck.format} onChange={(e) => setFormat(e.target.value as any)}>
<option>Premier</option>
<option>TwinSuns</option>
</select>
<span className="ml-auto text-sm opacity-75">Draw cards: {total}</span>
</div>


<div className="rounded-lg border p-2">
<div className="text-sm font-medium mb-1">Leader/Base</div>
<div className="text-xs opacity-70">Select by clicking cards in search and using the buttons below a card’s details (coming soon). For now, add cards to draw deck.</div>
</div>


<div className="rounded-lg border p-2">
  <div className="text-sm font-medium mb-2">Draw Deck</div>
  {deck.cards.length === 0 && (
    <div className="text-sm opacity-60">No cards yet. Click cards in the search to add.</div>
  )}

  {deck.cards
    .filter((c) => !!c?.set && c?.num !== undefined) // ⬅ ignore malformed entries
    .map((c) => {
      const id = `${c.set}-${c.num}`;
      const setLabel = (c.set || "").toUpperCase();
      const display = `${setLabel} ${c.num}`;

      return (
        <Row
          key={id}
          id={id}
          name={cache?.[id]?.name ?? display}
          count={c.count}
          onInc={() => add({ set: c.set!, num: c.num! })}
          onDec={() => remove({ set: c.set!, num: c.num! })}
        />
      );
    })}
</div>


<div className="rounded-lg border p-2">
<div className="text-sm font-medium mb-2">Legality</div>
{!v.ok && (
<ul className="text-red-600 text-sm list-disc pl-5">
{v.errors.map((e, i) => (
<li key={i}>{e}</li>
))}
</ul>
)}
{v.warnings.length > 0 && (
<ul className="text-amber-600 text-sm list-disc pl-5 mt-1">
{v.warnings.map((e, i) => (
<li key={i}>{e}</li>
))}
</ul>
)}
{v.ok && v.warnings.length === 0 && <div className="text-sm opacity-70">Looks good!</div>}
</div>
</div>
);
}