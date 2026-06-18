export type Locale = "en" | "zh";

export type ScenarioId = "checkout" | "pos" | "live" | "ops";

export type Scenario = {
  id: ScenarioId;
  status: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  merchant: Record<Locale, string>;
  customer: Record<Locale, string>;
  result: Record<Locale, string>;
  steps: Record<Locale, string[]>;
  metrics: Array<{
    label: Record<Locale, string>;
    value: string;
  }>;
};

export const siteCopy = {
  en: {
    nav: {
      home: "Home",
      scenarios: "Product",
      status: "Solutions",
      docs: "Developers",
      releases: "About",
      github: "GitHub",
      language: "ZH",
      languageAria: "Open Chinese version",
    },
    hero: {
      eyebrow: "Open, trusted, sustainable voucher payment protocol",
      title: "Make every voucher more valuable",
      body:
        "RedeemLoop keeps the VI promise narrow: existing voucher assets, transparent circulation, receipt confirmation, and commerce mark-as-paid.",
      primary: "Explore product",
      secondary: "Understand protocol",
      alpha:
        "Current release is alpha/pilot infrastructure. EVM checkout is implemented at integration level; Rune, Fractal, and inscription flows still require live certification.",
    },
    console: {
      title: "Scenario model",
      intent: "PaymentIntent",
      settlement: "Receipt confirmation",
      commerce: "Commerce mark-as-paid",
      merchant: "Merchant side",
      customer: "Customer side",
      result: "Result",
      chain: "Asset path",
    },
    protocol: {
      title: "The loop stays narrow",
      body:
        "RedeemLoop is deliberately scoped around existing voucher assets and commerce payment status. It does not issue assets, custody funds, price tokens, or replace logistics.",
    },
    status: {
      title: "Readiness status",
      body:
        "Public wording separates implemented integration support from live certification evidence.",
      columns: {
        rail: "Rail",
        status: "Status",
        scope: "Scope",
        next: "Next proof",
      },
    },
    visual: {
      title: "Brand system",
      body:
        "The public site uses the original transparent RedeemLoop mark, the exact VI palette, and clean commerce scenes without mixing languages.",
      cards: ["Transparent SVG mark", "Voucher checkout", "POS QR", "Merchant operations"],
    },
    developer: {
      title: "Developer entry",
      body:
        "Start with the local sandbox, then choose a web checkout, POS QR, or short-link path. The same PaymentIntent record reconciles payment, settlement proof, webhook delivery, and commerce status.",
      codeLabel: "Local sandbox",
    },
    boundary: {
      title: "Protocol boundary",
      does: "Does",
      doesNot: "Does not",
      doesItems: [
        "Bind merchant-owned voucher assets to SKUs and entitlements.",
        "Create checkout buttons, POS QR links, hosted pages, and livestream short links.",
        "Verify receipt through chain events or indexers.",
        "Notify WooCommerce, Shopify, or custom systems that the order is paid.",
      ],
      doesNotItems: [
        "Issue tokens, mint NFTs, etch Runes, or inscribe Ordinals.",
        "Custody private keys or merchant assets.",
        "Design tokenomics, token pricing, or secondary markets.",
        "Replace inventory, logistics, tax, or after-sales systems.",
      ],
    },
    footer: {
      line: "RedeemLoop is published as open-source infrastructure for voucher payment pilots.",
      domain:
        "Recommended public domain: redeemloop.aifund.com. Keep pay.aifund.com for production payment entry after live wallet and HTTPS certification.",
    },
  },
  zh: {
    nav: {
      home: "首页",
      scenarios: "商品",
      status: "解决方案",
      docs: "开发者",
      releases: "关于我们",
      github: "GitHub",
      language: "EN",
      languageAria: "打开英文版本",
    },
    hero: {
      eyebrow: "开放、可信、可持续的提货券协议",
      title: "让每一张提货券 更有价值",
      body:
        "RedeemLoop 保持 VI 里的克制承诺：已有提货资产、透明流通、收券确认和电商订单 mark-as-paid。",
      primary: "探索商品",
      secondary: "了解协议",
      alpha:
        "当前版本仍是 alpha/pilot 基础设施。EVM checkout 已具备集成层支持；Rune、Fractal、Inscription 仍需要真实钱包和索引器认证。",
    },
    console: {
      title: "应用场景模型",
      intent: "PaymentIntent",
      settlement: "收券确认",
      commerce: "电商 mark-as-paid",
      merchant: "商户侧",
      customer: "用户侧",
      result: "结果",
      chain: "资产路径",
    },
    protocol: {
      title: "协议边界保持克制",
      body:
        "RedeemLoop 围绕已有提货资产和电商付款状态工作，不发行资产、不托管资金、不做 token 定价，也不替代物流。",
    },
    status: {
      title: "可用度状态",
      body:
        "公开表述会区分已经实现的集成能力和仍需真实认证的生产证据。",
      columns: {
        rail: "路径",
        status: "状态",
        scope: "范围",
        next: "下一步证明",
      },
    },
    visual: {
      title: "视觉识别应用",
      body:
        "官网沿用你提供的 RedeemLoop VI 原图、透明 SVG 标识和原始色板，不重绘、不改色。",
      cards: ["透明 SVG 标识", "提货券支付", "POS 二维码", "商户运营"],
    },
    developer: {
      title: "开发者入口",
      body:
        "先跑本地 sandbox，再选择网页 checkout、POS QR 或直播短链。同一个 PaymentIntent 记录会统一串起付款、settlement proof、webhook delivery 和电商状态。",
      codeLabel: "本地 sandbox",
    },
    boundary: {
      title: "协议边界",
      does: "RedeemLoop 做",
      doesNot: "RedeemLoop 不做",
      doesItems: [
        "把商户自有提货资产绑定到 SKU 和权益。",
        "生成 checkout button、POS QR、hosted page 和直播短链。",
        "通过链上事件或索引器确认商户已经收券。",
        "通知 WooCommerce、Shopify 或自定义系统订单已付款。",
      ],
      doesNotItems: [
        "不发行 token、不 mint NFT、不 etch Rune、不 inscribe Ordinal。",
        "不托管私钥或商户资产。",
        "不设计 tokenomics、token 定价或二级市场。",
        "不替代库存、物流、税务或售后系统。",
      ],
    },
    footer: {
      line: "RedeemLoop 作为面向提货券支付 pilot 的开源基础设施发布。",
      domain:
        "建议官网域名使用 redeemloop.aifund.com；pay.aifund.com 保留给通过真实钱包和 HTTPS 认证后的支付入口。",
    },
  },
} as const;

export const scenarios: Scenario[] = [
  {
    id: "checkout",
    status: {
      en: "EVM beta",
      zh: "EVM beta",
    },
    title: {
      en: "Product checkout button",
      zh: "商品页支付按钮",
    },
    summary: {
      en: "A merchant embeds the React Pay Button or script widget beside a product SKU.",
      zh: "商户把 React Pay Button 或 script widget 嵌入到商品 SKU 旁边。",
    },
    merchant: {
      en: "Maps SKU COFFEE-001 to an ERC-20 voucher binding and vault.",
      zh: "把 SKU COFFEE-001 映射到 ERC-20 提货券 binding 和收券 vault。",
    },
    customer: {
      en: "Connects an EIP-1193 wallet and sends the voucher asset to the merchant vault.",
      zh: "连接 EIP-1193 钱包，并把提货券资产转入商户 vault。",
    },
    result: {
      en: "RedeemLoop rechecks the receipt and posts mark-as-paid to commerce.",
      zh: "RedeemLoop 复核 receipt，并把 mark-as-paid 发给电商系统。",
    },
    steps: {
      en: ["Asset Binding", "Create PaymentIntent", "Wallet transfer", "EVM receipt recheck", "Webhook delivery"],
      zh: ["资产绑定", "创建 PaymentIntent", "钱包转券", "EVM receipt 复核", "Webhook 投递"],
    },
    metrics: [
      {
        label: { en: "Supported chains", zh: "已支持链" },
        value: "ETH / BSC / POL / ARB",
      },
      {
        label: { en: "Commerce", zh: "电商适配" },
        value: "Woo / Shopify alpha",
      },
    ],
  },
  {
    id: "pos",
    status: {
      en: "Pilot API",
      zh: "Pilot API",
    },
    title: {
      en: "POS QR payment",
      zh: "POS QR 收银",
    },
    summary: {
      en: "A terminal creates a token-scoped hosted payment URL for an in-store order.",
      zh: "收银终端为线下订单创建带 token 的 hosted payment URL。",
    },
    merchant: {
      en: "Registers the terminal and signs POS payment creation with terminal nonce protection.",
      zh: "注册终端，并用 terminal nonce 防止重复创建 POS payment。",
    },
    customer: {
      en: "Scans the QR code and opens `/pay/:intentId?token=...` on a wallet-enabled phone.",
      zh: "扫码打开 `/pay/:intentId?token=...`，在手机钱包中付款。",
    },
    result: {
      en: "The terminal polls the same PaymentIntent until settlement is confirmed.",
      zh: "终端轮询同一个 PaymentIntent，直到 settlement 确认。",
    },
    steps: {
      en: ["Terminal registration", "POS PaymentIntent", "Hosted URL", "Customer wallet", "Terminal reconciliation"],
      zh: ["终端注册", "POS PaymentIntent", "Hosted URL", "用户钱包", "终端对账"],
    },
    metrics: [
      {
        label: { en: "Customer link", zh: "用户链接" },
        value: "/pay/:intentId",
      },
      {
        label: { en: "Replay guard", zh: "防重放" },
        value: "terminal nonce",
      },
    ],
  },
  {
    id: "live",
    status: {
      en: "Pilot API",
      zh: "Pilot API",
    },
    title: {
      en: "Livestream short-link",
      zh: "直播带货短链",
    },
    summary: {
      en: "A livestream host shares a short checkout link tied to a single voucher-backed SKU.",
      zh: "直播间分享一个绑定提货券 SKU 的短 checkout 链接。",
    },
    merchant: {
      en: "Creates `/s/:slug?token=...` with expiry, SKU lines, binding ID, and order metadata.",
      zh: "创建带有效期、SKU lines、binding ID 和订单元数据的 `/s/:slug?token=...`。",
    },
    customer: {
      en: "Opens the link without receiving a merchant API key or admin credential.",
      zh: "用户打开短链，但不会拿到商户 API key 或管理凭证。",
    },
    result: {
      en: "The same settlement and webhook loop handles payment completion.",
      zh: "同一条 settlement 与 webhook 链路完成付款闭环。",
    },
    steps: {
      en: ["Short-link intent", "Token-scoped session", "Wallet transfer", "Public recheck", "Commerce update"],
      zh: ["短链 intent", "Token-scoped session", "钱包转券", "Public recheck", "电商更新"],
    },
    metrics: [
      {
        label: { en: "Customer link", zh: "用户链接" },
        value: "/s/:slug",
      },
      {
        label: { en: "Credential model", zh: "凭证模型" },
        value: "token-scoped",
      },
    ],
  },
  {
    id: "ops",
    status: {
      en: "Local pilot",
      zh: "本地 pilot",
    },
    title: {
      en: "Merchant operations",
      zh: "商户运营后台",
    },
    summary: {
      en: "Operators inspect vaults, bindings, PaymentIntents, webhook deliveries, and audit events.",
      zh: "运营人员查看 vault、binding、PaymentIntent、webhook delivery 和 audit event。",
    },
    merchant: {
      en: "Uses the local admin console to seed a binding and inspect delivery failures.",
      zh: "使用本地 admin console 创建 pilot binding 并排查投递失败。",
    },
    customer: {
      en: "Sees only the hosted payment page or embedded button, not the admin surface.",
      zh: "用户只看到 hosted payment page 或嵌入式按钮，看不到后台。",
    },
    result: {
      en: "Webhook replay and audit logs make pilot support traceable.",
      zh: "Webhook replay 和 audit logs 让 pilot 支持可以追踪。",
    },
    steps: {
      en: ["Seed merchant", "Verify vault", "Watch intents", "Replay webhook", "Inspect audit log"],
      zh: ["创建商户数据", "验证 vault", "查看 intent", "重放 webhook", "检查 audit log"],
    },
    metrics: [
      {
        label: { en: "Admin route", zh: "后台路由" },
        value: "/merchant-admin",
      },
      {
        label: { en: "Worker hook", zh: "Worker 入口" },
        value: "drain-pending",
      },
    ],
  },
];

export const readinessRows = [
  {
    rail: "EVM ERC-20",
    status: { en: "Integration beta", zh: "集成 beta" },
    scope: { en: "ETH, BSC, Polygon PoS, Arbitrum One", zh: "ETH、BSC、Polygon PoS、Arbitrum One" },
    next: { en: "Funded wallet certification", zh: "真实钱包付费认证" },
  },
  {
    rail: "WooCommerce",
    status: { en: "Sandbox plugin", zh: "Sandbox 插件" },
    scope: { en: "Gateway settings, SKU mapping, webhook mark-as-paid", zh: "支付设置、SKU 映射、webhook mark-as-paid" },
    next: { en: "Real WordPress runtime certification", zh: "真实 WordPress 运行认证" },
  },
  {
    rail: "Shopify",
    status: { en: "Private-app alpha", zh: "Private-app alpha" },
    scope: { en: "Admin API diagnostics and mocked mark-as-paid tests", zh: "Admin API 诊断和 mocked mark-as-paid 测试" },
    next: { en: "Live store and token certification", zh: "真实店铺和 token 认证" },
  },
  {
    rail: "Bitcoin Rune",
    status: { en: "Adapter beta", zh: "Adapter beta" },
    scope: { en: "UniSat, Xverse, Xverse indexer adapter, API recheck", zh: "UniSat、Xverse、Xverse indexer adapter、API recheck" },
    next: { en: "Funded UniSat/Xverse flow", zh: "有资金的 UniSat/Xverse 流程" },
  },
  {
    rail: "Fractal / Inscription / NFT",
    status: { en: "Mocked alpha boundary", zh: "Mocked alpha 边界" },
    scope: { en: "Stable adapter shapes, not live certified", zh: "稳定 adapter 形态，未做真实认证" },
    next: { en: "Indexer and wallet partner tests", zh: "索引器和钱包伙伴测试" },
  },
];

export const quickStartCommands = ["pnpm install", "pnpm verify", "pnpm api:dev", "pnpm pos:dev", "pnpm site:dev"];

export const repoLinks = {
  github: "https://github.com/RedeemLoopProtocol/redeemloop-protocol",
  docs: "https://github.com/RedeemLoopProtocol/redeemloop-protocol/tree/main/docs",
  integration: "https://github.com/RedeemLoopProtocol/redeemloop-protocol/blob/main/docs/INTEGRATION_GUIDE.md",
  releases: "https://github.com/RedeemLoopProtocol/redeemloop-protocol/releases",
};
