"use client";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCards } from "@/lib/swu";
import CardTile from "./CardTile";
import { useDeck } from "@/store/deck";
import { cardKey } from "@/types/swu";
import { useCardCache } from "@/store/cardCache";


const TYPES = ["", "unit", "event", "upgrade", "leader", "base"];
const ASPECTS = ["", "Aggression", "Command", "Vigilance", "Cunning", "Heroism", "Villainy"];


type AnyCard = Record<string, any>;
const safeKey = (c: AnyCard, i: number) => {
  const s = typeof c?.set === "string" && c.set ? c.set.toLowerCase() : "u";
  const nRaw = c?.setnumber ?? c?.number;
  const n = Number.isFinite(Number(nRaw)) ? Number(nRaw) : i; // fallback to index
  const nm = typeof c?.name === "string" && c.name ? c.name : "noname";
  return `${s}-${n}-${nm}-${i}`; // ensure uniqueness by appending index
};

export default function SearchPanel() {
const [text, setText] = useState("");
const [type, setType] = useState("");
const [aspect, setAspect] = useState("");
const add = useDeck((s) => s.addCard);
const put = useCardCache((s) => s.put);


const query = useMemo(() => {
  const parts: string[] = [];

  const raw = text.trim();

  // If the user typed operators like "type:" or "aspect:" treat it as a raw query.
  const looksRaw = /(^|\\s)[a-z]+:/.test(raw);

  if (raw) {
    parts.push(looksRaw ? raw : `t:"${raw}"`);
  }
  if (type) parts.push(`type:${type}`);
  if (aspect) parts.push(`aspect:${aspect}`);

  return parts.join(" ");
}, [text, type, aspect]);


const { data, isFetching, isError, error } = useQuery({
queryKey: ["search", query],
queryFn: () => searchCards(query),
enabled: !!query,
staleTime: 0,
});


useEffect(() => {
  if (!data) return;
  data.forEach(put);
}, [data,put]);


return (
<div className="space-y-3">
<div className="flex gap-2">
<input
className="border rounded px-3 py-2 w-full"
placeholder="Search text… (e.g. t:\'When Played\')"
value={text}
onChange={(e) => setText(e.target.value)}
/>
</div>
<div className="flex gap-2">
<select className="border rounded px-2 py-2" value={type} onChange={(e) => setType(e.target.value)}>
{TYPES.map((t) => (
<option key={t} value={t}>{t || "any type"}</option>
))}
</select>
<select className="border rounded px-2 py-2" value={aspect} onChange={(e) => setAspect(e.target.value)}>
{ASPECTS.map((a) => (
<option key={a} value={a}>{a || "any aspect"}</option>
))}
</select>
{isFetching && <span className="text-sm opacity-60 self-center">Loading…</span>}
{!query && <div className="text-sm opacity-60">Type a query (e.g. <code>type:leader</code>)</div>}
{isError && <div className="text-sm text-red-600">Search failed: {(error as Error).message}</div>}
{query && !isFetching && (data?.length ?? 0) === 0 && (
  <div className="text-sm opacity-60">No results for <code>{query}</code></div>
)}
</div>


<div className="text-xs opacity-70">Results: {data?.length ?? 0}</div>

<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
  {(data ?? []).map((c, i) => (
    <CardTile
      key={`${c.set}-${c.setnumber}-${i}`}
      card={c}
      onClick={() => add({ set: c.set, num: c.setnumber })} // ✅ straight from normalised fields
    />
  ))}
</div>
</div>
);
}