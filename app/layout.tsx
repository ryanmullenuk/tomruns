import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tomruns.co.uk"),
  title: "Tom Runs for Phab | London Marathon 2027",
  description: "Follow Tom's London Marathon 2027 journey and help him raise £2,500 for Phab.",
  openGraph: {
    title: "Tom Runs for Phab",
    description: "26.2 miles. A £2,500 target. One brilliant cause.",
    type: "website",
    url: "https://tomruns.co.uk",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tom Runs — London Marathon 2027 for Phab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tom Runs for Phab",
    description: "26.2 miles. A £2,500 target. One brilliant cause.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
