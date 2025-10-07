"use client";
import { cardImageUrl } from "@/lib/swu";
import type { SwuCard } from "@/types/swu";

export default function CardTile({ card, onClick }: { card: SwuCard; onClick?: () => void }) {
  const src = cardImageUrl(card?.set, (card as any)?.setnumber);
  return (
    <button onClick={onClick} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? (
        <img
          src={src}
          alt={card.name}
          className="w-full h-auto block"
          loading="lazy"
          onError={(e) => {
            // hide if the redirect returns 404
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="aspect-[63/88] w-full grid place-items-center text-xs opacity-70">Image unavailable</div>
      )}
    </button>
  );
}