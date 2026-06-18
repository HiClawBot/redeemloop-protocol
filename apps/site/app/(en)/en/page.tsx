import type { Metadata } from "next";

import { OfficialSite } from "../../../src/OfficialSite";

export const metadata: Metadata = {
  title: "RedeemLoop Protocol",
  description:
    "Open-source, non-issuing voucher payment protocol for Asset Binding, PaymentIntent, receipt confirmation, and commerce mark-as-paid.",
};

export default function EnglishHome() {
  return <OfficialSite locale="en" />;
}
