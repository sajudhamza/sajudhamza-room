import type { Metadata, Viewport } from "next";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import "./overlays.css";
import "./themes.css";
import "./objects.css";
import { site } from "@/data/content";

const title = `${site.name} ${site.surname} — Interactive 3D Portfolio`;
const description = "AI & machine learning researcher, senior data engineer and inventor. Explore the room: click the glowing dots to open publications, patents, press, judging and more.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://www.sajudhamza.com"),
  openGraph: { title, description, type: "website", siteName: `${site.name} — Portfolio`, images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#010101",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Newspaper masthead + book body faces; the other fonts are self-hosted via @fontsource. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
