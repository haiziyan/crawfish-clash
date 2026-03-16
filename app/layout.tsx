import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "小龙虾大战 | Crawfish Clash",
  description: "最火爆的小龙虾多人对战游戏！控制你的小龙虾，吃遍全场，称霸虾池！",
  keywords: "小龙虾,游戏,多人对战,io游戏",
  openGraph: {
    title: "小龙虾大战",
    description: "最火爆的小龙虾多人对战游戏！",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
