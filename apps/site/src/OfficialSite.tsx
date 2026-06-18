"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowSquareOut,
  ArrowsClockwise,
  CheckCircle,
  ClockCounterClockwise,
  GithubLogo,
  GlobeHemisphereEast,
  LinkSimple,
  Monitor,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  Storefront,
  Ticket,
} from "@phosphor-icons/react";

import { quickStartCommands, readinessRows, repoLinks, scenarios, siteCopy, type Locale, type ScenarioId } from "./content";

const assetPath = (path: string) => {
  const basePath = process.env.NEXT_PUBLIC_REDEEMLOOP_SITE_BASE_PATH ?? "";
  return `${basePath}/${path}`.replace(/\/{2,}/g, "/");
};

const viAssets = {
  logoMark: assetPath("vi/redeemloop-logo-mark.svg"),
  wordmark: assetPath("vi/redeemloop-wordmark.svg"),
  uiBoard: assetPath("vi/redeemloop-ui-board.png"),
  brandApplications: assetPath("vi/redeemloop-brand-applications.png"),
};

const scenarioIcons = {
  checkout: ShoppingCart,
  pos: QrCode,
  live: LinkSimple,
  ops: Monitor,
} satisfies Record<ScenarioId, typeof ShoppingCart>;

const valuePillars = [
  {
    icon: ArrowsClockwise,
    en: "Value circulation",
    zh: "价值流转",
  },
  {
    icon: ShieldCheck,
    en: "Secure and transparent",
    zh: "安全透明",
  },
  {
    icon: Ticket,
    en: "Voucher exchange",
    zh: "价值兑换",
  },
];

const palette = [
  { name: "#0D1B2A", color: "#0D1B2A" },
  { name: "#0A7B6E", color: "#0A7B6E" },
  { name: "#DFF3EF", color: "#DFF3EF" },
  { name: "#F3F6F9", color: "#F3F6F9" },
];

export function OfficialSite({ locale }: { locale: Locale }) {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>("checkout");
  const copy = siteCopy[locale];
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];
  const languageHref = locale === "en" ? "/" : "/en";
  const brandSubtitle = locale === "en" ? "Protocol" : "兑环协议";

  return (
    <main className="min-h-screen bg-paper text-ink" lang={locale === "en" ? "en" : "zh-CN"}>
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3" href="#top" aria-label="RedeemLoop Protocol">
            <img
              className="size-11 object-contain"
              src={viAssets.logoMark}
              alt="RedeemLoop circular voucher logo mark"
            />
            <span className="hidden leading-none sm:block">
              <span className="block text-[15px] font-extrabold tracking-normal">
                <span className="text-ink">Redeem</span>
                <span className="text-pine">Loop</span>
              </span>
              <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-pine">{brandSubtitle}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 text-sm font-semibold text-ink/72 md:flex" aria-label="Primary">
            <a className="rounded-md px-3 py-2 text-ink hover:bg-field hover:text-pine" href="#top">
              {copy.nav.home}
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-field hover:text-pine" href="#scenarios">
              {copy.nav.scenarios}
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-field hover:text-pine" href="#status">
              {copy.nav.status}
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-field hover:text-pine" href={repoLinks.docs}>
              {copy.nav.docs}
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-field hover:text-pine" href={repoLinks.releases}>
              {copy.nav.releases}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine active:translate-y-px"
              href={languageHref}
              title={copy.nav.languageAria}
              aria-label={copy.nav.languageAria}
            >
              <GlobeHemisphereEast size={18} weight="bold" />
              <span className="hidden sm:inline">{copy.nav.language}</span>
            </Link>
            <a
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-pine px-3 text-sm font-semibold text-white transition hover:bg-[#086e63] active:translate-y-px"
              href={repoLinks.github}
              title={copy.nav.github}
              aria-label={copy.nav.github}
            >
              <GithubLogo size={19} weight="bold" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <section id="top" className="overflow-hidden border-b border-line/80 bg-[linear-gradient(180deg,#ffffff_0%,#f3f6f9_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <BrandSignature locale={locale} className="mb-8" size="hero" />
            <p className="mb-4 text-sm font-semibold text-pine">{copy.hero.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-normal text-ink sm:text-6xl">
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{copy.hero.body}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a className="btn-primary" href="#scenarios">
                <Storefront size={19} weight="bold" />
                {copy.hero.primary}
              </a>
              <a className="btn-secondary" href={repoLinks.integration}>
                <ArrowSquareOut size={19} weight="bold" />
                {copy.hero.secondary}
              </a>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {valuePillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.en} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[0_14px_30px_-26px_rgba(13,27,42,0.32)]">
                    <span className="grid size-9 place-items-center rounded-md bg-field text-pine">
                      <Icon size={19} weight="bold" />
                    </span>
                    <span className="text-sm font-semibold text-ink">{pillar[locale]}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 max-w-2xl rounded-xl border border-line bg-white px-4 py-3 text-sm leading-6 text-muted shadow-[0_14px_30px_-28px_rgba(13,27,42,0.3)]">
              {copy.hero.alpha}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[22px] border border-line bg-white p-6 shadow-panel">
              <img className="mx-auto aspect-square w-full max-w-[420px] object-contain" src={viAssets.logoMark} alt="RedeemLoop circular voucher mark" />
              <div className="mt-5 grid grid-cols-4 gap-3">
                {palette.map((swatch) => (
                  <div key={swatch.name} className="min-w-0">
                    <span className="block h-12 rounded-md border border-line" style={{ backgroundColor: swatch.color }} />
                    <span className="mt-2 block truncate font-mono text-[11px] text-muted">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <ScenarioConsole
              locale={locale}
              activeScenarioId={activeScenarioId}
              setActiveScenarioId={setActiveScenarioId}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 bg-white" id="scenarios">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="section-kicker">{copy.protocol.title}</p>
            <h2 className="section-title">{activeScenario.title[locale]}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{activeScenario.summary[locale]}</p>
            <div className="mt-7 grid gap-3">
              <RoleLine label={copy.console.merchant} value={activeScenario.merchant[locale]} />
              <RoleLine label={copy.console.customer} value={activeScenario.customer[locale]} />
              <RoleLine label={copy.console.result} value={activeScenario.result[locale]} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map((scenario) => {
              const Icon = scenarioIcons[scenario.id];
              const selected = scenario.id === activeScenarioId;
              return (
                <button
                  key={scenario.id}
                  className={`scenario-tile ${selected ? "scenario-tile-active" : ""}`}
                  type="button"
                  onClick={() => setActiveScenarioId(scenario.id)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-md border border-line bg-field text-pine">
                      <Icon size={22} weight="bold" />
                    </span>
                    <span className="rounded-md border border-line bg-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                      {scenario.status[locale]}
                    </span>
                  </span>
                  <span className="mt-5 block text-left text-xl font-bold tracking-normal text-ink">{scenario.title[locale]}</span>
                  <span className="mt-3 block text-left text-sm leading-6 text-muted">{scenario.summary[locale]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 bg-paper">
        {locale === "zh" ? <ChineseVisualGallery /> : <EnglishVisualGallery />}
      </section>

      <section className="border-b border-line/80 bg-white" id="status">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-3xl">
            <p className="section-kicker">{copy.status.title}</p>
            <h2 className="section-title">{copy.status.body}</h2>
          </div>
          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-panel">
            <div className="grid min-w-[760px] grid-cols-[1fr_1fr_1.35fr_1.2fr] border-b border-line bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              <span>{copy.status.columns.rail}</span>
              <span>{copy.status.columns.status}</span>
              <span>{copy.status.columns.scope}</span>
              <span>{copy.status.columns.next}</span>
            </div>
            <div className="overflow-x-auto">
              {readinessRows.map((row) => (
                <div
                  key={row.rail}
                  className="grid min-w-[760px] grid-cols-[1fr_1fr_1.35fr_1.2fr] border-b border-line px-5 py-4 text-sm last:border-b-0"
                >
                  <span className="font-bold text-ink">{row.rail}</span>
                  <span className="font-semibold text-pine">{row.status[locale]}</span>
                  <span className="text-muted">{row.scope[locale]}</span>
                  <span className="text-muted">{row.next[locale]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="section-kicker">{copy.developer.title}</p>
            <h2 className="section-title">{copy.developer.body}</h2>
          </div>
          <div className="rounded-[18px] border border-line bg-white p-5 font-mono text-sm text-ink shadow-panel">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-pine">{copy.developer.codeLabel}</span>
              <Ticket size={21} weight="bold" className="text-pine" />
            </div>
            {quickStartCommands.map((command) => (
              <div key={command} className="flex min-h-8 items-center gap-3">
                <span className="text-pine">$</span>
                <code>{command}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <BoundaryColumn title={copy.boundary.does} items={copy.boundary.doesItems} good />
          <BoundaryColumn title={copy.boundary.doesNot} items={copy.boundary.doesNotItems} />
        </div>
      </section>

      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <BrandSignature locale={locale} className="max-w-[280px]" inverted />
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">{copy.footer.line}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">{copy.footer.domain}</p>
          </div>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <a className="footer-link" href={repoLinks.github}>
              <GithubLogo size={18} weight="bold" />
              GitHub
            </a>
            <a className="footer-link" href={repoLinks.releases}>
              <ClockCounterClockwise size={18} weight="bold" />
              Releases
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function BrandSignature({
  locale,
  className = "",
  size = "compact",
  inverted = false,
}: {
  locale: Locale;
  className?: string;
  size?: "compact" | "hero";
  inverted?: boolean;
}) {
  if (locale === "zh") {
    return (
      <img
        className={`${size === "hero" ? "h-auto w-full max-w-[360px]" : "h-auto w-full max-w-[280px]"} ${className}`}
        src={viAssets.wordmark}
        alt="RedeemLoop 兑环协议"
      />
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img
        className={`${size === "hero" ? "size-20" : "size-12"} shrink-0 object-contain`}
        src={viAssets.logoMark}
        alt="RedeemLoop circular voucher logo mark"
      />
      <span className="leading-none">
        <span className={`${size === "hero" ? "text-4xl sm:text-5xl" : "text-2xl"} block font-extrabold tracking-normal`}>
          <span className={inverted ? "text-white" : "text-ink"}>Redeem</span>
          <span className="text-pine">Loop</span>
        </span>
        <span className={`mt-2 block text-xs font-semibold uppercase tracking-[0.22em] ${inverted ? "text-white/72" : "text-pine"}`}>
          Protocol
        </span>
      </span>
    </div>
  );
}

function ChineseVisualGallery() {
  const copy = siteCopy.zh.visual;

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
      <div className="lg:col-span-2">
        <p className="section-kicker">{copy.title}</p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">{copy.body}</p>
      </div>
      <figure className="overflow-hidden rounded-[22px] border border-line bg-white shadow-panel">
        <img className="h-full w-full object-cover" src={viAssets.uiBoard} alt="RedeemLoop 视觉识别界面应用图" />
      </figure>
      <figure className="overflow-hidden rounded-[22px] border border-line bg-white shadow-panel">
        <img
          className="h-full w-full object-cover"
          src={viAssets.brandApplications}
          alt="RedeemLoop 视觉识别场景应用图"
        />
      </figure>
    </div>
  );
}

function EnglishVisualGallery() {
  const copy = siteCopy.en.visual;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
      <div className="rounded-[22px] border border-line bg-white p-6 shadow-panel">
        <p className="section-kicker">{copy.title}</p>
        <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight tracking-normal text-ink">
          RedeemLoop visual identity
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{copy.body}</p>
        <div className="mt-8 flex items-center gap-5 rounded-2xl border border-line bg-paper p-5">
          <img className="size-24 object-contain" src={viAssets.logoMark} alt="RedeemLoop circular voucher logo mark" />
          <div>
            <p className="text-3xl font-extrabold tracking-normal">
              <span className="text-ink">Redeem</span>
              <span className="text-pine">Loop</span>
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine">Protocol</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {palette.map((swatch) => (
            <div key={swatch.name} className="min-w-0">
              <span className="block h-12 rounded-md border border-line" style={{ backgroundColor: swatch.color }} />
              <span className="mt-2 block truncate font-mono text-[11px] text-muted">{swatch.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {copy.cards.map((card, index) => {
          const icons = [Ticket, ShoppingCart, QrCode, Monitor] as const;
          const Icon = icons[index] ?? Ticket;

          return (
            <div key={card} className="rounded-[18px] border border-line bg-white p-5 shadow-panel">
              <span className="grid size-11 place-items-center rounded-md bg-field text-pine">
                <Icon size={22} weight="bold" />
              </span>
              <p className="mt-5 text-xl font-bold tracking-normal text-ink">{card}</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {index === 0
                  ? "Transparent SVG assets sit directly on the page surface."
                  : "Merchant-facing commerce scenes stay concise and operational."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScenarioConsole({
  locale,
  activeScenarioId,
  setActiveScenarioId,
}: {
  locale: Locale;
  activeScenarioId: ScenarioId;
  setActiveScenarioId: (id: ScenarioId) => void;
}) {
  const copy = siteCopy[locale];
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];
  const Icon = scenarioIcons[activeScenario.id];

  return (
    <div className="rounded-[22px] border border-line bg-white p-4 shadow-panel sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pine">{copy.console.title}</p>
          <p className="mt-1 text-2xl font-bold tracking-normal text-ink">{activeScenario.title[locale]}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md border border-line bg-field px-3 py-2 text-sm font-semibold text-pine">
          <Icon size={18} weight="bold" />
          {activeScenario.status[locale]}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2" role="tablist" aria-label={copy.console.title}>
        {scenarios.map((scenario) => {
          const ScenarioIcon = scenarioIcons[scenario.id];
          const selected = scenario.id === activeScenario.id;
          return (
            <button
              key={scenario.id}
              className={`tab-button ${selected ? "tab-button-active" : ""}`}
              type="button"
              onClick={() => setActiveScenarioId(scenario.id)}
              aria-selected={selected}
              role="tab"
              title={scenario.title[locale]}
            >
              <ScenarioIcon size={20} weight="bold" />
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3">
        {activeScenario.steps[locale].map((step, index) => (
          <div key={step} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-line bg-paper px-3 py-3">
            <span className="grid size-8 place-items-center rounded-md bg-pine font-mono text-xs font-bold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 text-sm font-semibold text-ink">{step}</span>
            {index < activeScenario.steps[locale].length - 1 ? (
              <span className="h-px w-10 bg-line" aria-hidden="true" />
            ) : (
              <CheckCircle size={20} weight="fill" className="text-pine" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {activeScenario.metrics.map((metric) => (
          <div key={metric.label.en} className="min-h-[86px] rounded-xl border border-line bg-field p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{metric.label[locale]}</p>
            <p className="mt-3 break-words font-mono text-sm font-bold text-ink">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-xl border border-line bg-paper px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-pine">{label}</span>
      <span className="text-sm leading-6 text-muted">{value}</span>
    </div>
  );
}

function BoundaryColumn({ title, items, good = false }: { title: string; items: readonly string[]; good?: boolean }) {
  return (
    <div className="rounded-[18px] border border-line bg-white p-5 shadow-panel">
      <div className="mb-5 flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-md ${good ? "bg-field text-pine" : "bg-ink text-white"}`}>
          <ShieldCheck size={21} weight="bold" />
        </span>
        <h2 className="text-2xl font-bold tracking-normal">{title}</h2>
      </div>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
            <span className={`mt-2 size-2 shrink-0 rounded-full ${good ? "bg-pine" : "bg-ink"}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
