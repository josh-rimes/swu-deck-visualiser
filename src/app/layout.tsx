import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";


export const metadata: Metadata = {
title: "SWU Deck Visualizer",
description: "Build and visualise Star Wars: Unlimited decks",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<Providers>{children}</Providers>
</body>
</html>
);
}
