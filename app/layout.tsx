import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: "Nard.chat - Decentralized Narratives",
    description:
      "A decentralized mini-app for creating and sharing narratives on Base Sepolia. Write stories, engage with comments, and build communities.",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${URL}/nard-preview.png`,
        button: {
          title: "Open Nard.chat",
          action: {
            type: "launch_frame",
            name: "Nard.chat",
            url: URL,
            splashImageUrl: "https://nard-chat.onrender.com/assets/nard-chat-logo.png",
            splashBackgroundColor: "#1a1a1a",
          },
        },
      }),
      "fc:miniapp": JSON.stringify({
        version: "1",
        name: "Nard.chat",
        iconUrl: "https://nard-chat.onrender.com/assets/nard-chat-logo.png",
        homeUrl: URL,
        imageUrl: `${URL}/nard-preview.png`,
        buttonTitle: "Open Nard.chat",
        splashImageUrl: "https://nard-chat.onrender.com/assets/nard-chat-logo.png",
        splashBackgroundColor: "#1a1a1a"
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
