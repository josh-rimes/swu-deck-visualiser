import { NextRequest, NextResponse } from "next/server";

const SWU = "https://api.swu-db.com";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path"); // e.g. "/cards/search"
  const q = req.nextUrl.searchParams.get("q");       // raw query for search
  const url =
    path === "/cards/search"
      ? `${SWU}${path}?q=${encodeURIComponent(q ?? "")}`
      : `${SWU}${path}`;

  const res = await fetch(url, { headers: { accept: "application/json" } });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}