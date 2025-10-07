"use client";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import type { SwuCard } from "@/types/swu";


export default function CostCurve({ pool }: { pool: { card: SwuCard; count: number }[] }) {
const data = useMemo(() => {
const map = new Map<number, number>();
for (const { card, count } of pool) {
const c = card.cost ?? 0;
map.set(c, (map.get(c) ?? 0) + count);
}
return Array.from(map.entries())
.sort((a, b) => a[0] - b[0])
.map(([cost, qty]) => ({ cost, qty }));
}, [pool]);


return (
<div className="w-full h-64">
<ResponsiveContainer>
<BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="cost" />
<YAxis allowDecimals={false} />
<Tooltip />
<Bar dataKey="qty" />
</BarChart>
</ResponsiveContainer>
</div>
);
}