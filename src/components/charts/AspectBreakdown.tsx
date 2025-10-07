"use client";
import { Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import type { SwuCard } from "@/types/swu";


export default function AspectBreakdown({ pool }: { pool: { card: SwuCard; count: number }[] }) {
const data = useMemo(() => {
const map = new Map<string, number>();
for (const { card, count } of pool) {
for (const a of card.aspects ?? []) map.set(a, (map.get(a) ?? 0) + count);
}
return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}, [pool]);


return (
<div className="w-full h-64">
<ResponsiveContainer>
<PieChart>
<Pie data={data} dataKey="value" nameKey="name" outerRadius={90} />
<Tooltip />
</PieChart>
</ResponsiveContainer>
</div>
);
}