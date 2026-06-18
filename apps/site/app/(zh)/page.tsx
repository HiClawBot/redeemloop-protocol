import type { Metadata } from "next";

import { OfficialSite } from "../../src/OfficialSite";

export const metadata: Metadata = {
  title: "RedeemLoop Protocol | 兑环协议",
  description: "面向商户自有提货资产的开源提货券支付协议。",
};

export default function Home() {
  return <OfficialSite locale="zh" />;
}
