import SearchPanel from "@/components/SearchPanel";
import DeckPanel from "@/components/DeckPanel";


export default function Page() {
return (
<main className="p-4 md:p-6">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
<section className="lg:col-span-5 rounded-xl border p-3">
<h2 className="font-semibold mb-2">Search</h2>
<SearchPanel />
</section>
<section className="lg:col-span-7 rounded-xl border p-3">
<h2 className="font-semibold mb-2">Deck</h2>
<DeckPanel />
</section>
</div>
</main>
);
}