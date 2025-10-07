import type { SwuCard } from "@/types/swu";

export const SWU_BASE = "https://api.swu-db.com";

export function cardImageUrl(set: string, num: number, opts?: { face?: boolean }) {
  const face = opts?.face ? "&face=true" : "";
  return `${SWU_BASE}/cards/${set.toLowerCase()}/${num}?format=image${face}`;
}

// turn any API record shape into our SwuCard (or null if unusable)
function normalizeApiCard(r: any): SwuCard | null {
  const setRaw =
    r.set ?? r.Set ?? r.setCode ?? r.SetCode ?? r.set_code ?? r.setcode ?? "";
  const numRaw =
    r.setnumber ?? r.number ?? r.Number ?? r.cardNumber ?? r.CardNumber;

  const set = String(setRaw || "").toLowerCase();
  const setnumber = Number.parseInt(String(numRaw ?? ""), 10);

  if (!set || !Number.isFinite(setnumber)) return null;

  const name =
    (r.name ??
    r.Name ??
    [r.Title, r.Subtitle].filter(Boolean).join(": ")) ||
    `${set.toUpperCase()} ${setnumber}`;

  const toNum = (v: any) =>
    v === 0 || v === "0" ? 0 : Number.isFinite(Number(v)) ? Number(v) : undefined;

  const toArr = (v: any): string[] =>
    Array.isArray(v)
      ? v
      : typeof v === "string"
      ? v.split(/[,;]|·/).map((s) => s.trim()).filter(Boolean)
      : [];

  return {
    name,
    set,
    setnumber,
    type: (r.type ?? r.Type ?? "").toLowerCase(),
    cost: toNum(r.cost ?? r.Cost),
    power: toNum(r.power ?? r.Power),
    hp: toNum(r.hp ?? r.HP ?? r.Health),
    rarity: r.rarity ?? r.Rarity ?? null,
    traits: toArr(r.traits ?? r.Traits),
    aspects: toArr(r.aspects ?? r.Aspects),
    arenas: toArr(r.arenas ?? r.Arenas ?? r.Arena),
    text: r.text ?? r.Text ?? r.Rules ?? null,
    artist: r.artist ?? r.Artist ?? null,
  };
}

export async function searchCards(q: string): Promise<SwuCard[]> {
  if (!q) return [];
  const url = `/api/swu?path=/cards/search&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json().catch(() => []);
  const raw = Array.isArray(data) ? data : (data.results ?? data.cards ?? data.data ?? []);
  return (raw as any[]).map(normalizeApiCard).filter(Boolean) as SwuCard[];
}