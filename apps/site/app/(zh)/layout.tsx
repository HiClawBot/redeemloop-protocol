import type { Metadata, Viewport } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "RedeemLoop Protocol | 兑环协议",
  description: "面向商户自有提货资产的开源提货券支付协议。",
  openGraph: {
    title: "RedeemLoop Protocol | 兑环协议",
    description: "面向商户自有提货资产的开源提货券支付协议。",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f3f6f9",
};

export default function ChineseRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
