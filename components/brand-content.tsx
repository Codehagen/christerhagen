import { type Lang } from "@/lib/companies"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { brandContent } from "@/lib/brand"

const label =
  "font-mono text-[12px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase"

function LogoCard({ tone }: { tone: "ink" | "paper" }) {
  const dark = tone === "ink"
  return (
    <div
      className={cn(
        "flex min-w-[240px] flex-1 flex-col justify-between gap-[22px] rounded-lg p-[34px]",
        dark ? "bg-foreground" : "border border-border bg-background"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon.svg"
        alt="CH monogram"
        width={52}
        height={52}
        className="rounded-[12px]"
      />
      <div
        className={cn(
          "text-[24px] leading-none font-medium",
          dark ? "text-background" : "text-(--ink-strong)"
        )}
      >
        Christer Hagen
      </div>
    </div>
  )
}

export function BrandContent({ lang }: { lang: Lang }) {
  const c = brandContent[lang]

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[740px] flex-1 px-5 sm:px-7"
    >
      {/* Hero */}
      <section className="pt-[84px] pb-[56px]">
        <div className={`${label} mb-6`}>{c.kicker}</div>
        <h1 className="m-0 max-w-[20ch] text-[clamp(27px,8vw,34px)] leading-[1.28] font-normal tracking-[-0.015em] text-(--ink-strong)">
          {c.head}
        </h1>
        <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.6] font-normal text-(--ink-muted)">
          {c.intro}
        </p>
      </section>

      {/* Logo */}
      <section className="mb-16">
        <h2 className={`${label} mb-[22px]`}>{c.lblLogo}</h2>
        <div className="flex flex-wrap gap-[18px]">
          <LogoCard tone="ink" />
          <LogoCard tone="paper" />
        </div>
        <p className="mt-4 max-w-[54ch] text-[14px] leading-[1.55] font-normal text-(--ink-soft)">
          {c.logoNote}
        </p>
      </section>

      {/* Colour */}
      <section className="mb-16">
        <h2 className={`${label} mb-[22px]`}>{c.lblColour}</h2>
        <div className="grid grid-cols-3 gap-4">
          {c.colours.map((col) => (
            <div key={col.name}>
              <div
                className="h-[92px] rounded-md border border-[color-mix(in_oklch,var(--ink),transparent_92%)]"
                style={{ background: col.css }}
              />
              <div className="mt-2.5 text-[13px] leading-[1.2] font-medium text-(--ink-strong)">
                {col.name}
              </div>
              <div className="mt-[3px] font-mono text-[11px] leading-[1.3] font-normal text-(--ink-faint)">
                {col.hex}
              </div>
              <div className="mt-1 text-[11.5px] leading-[1.4] font-normal text-(--ink-soft)">
                {col.use}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="mb-16">
        <h2 className={`${label} mb-[22px]`}>{c.lblType}</h2>
        <div className="border-t border-border py-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
            <span className="text-[22px] leading-none font-normal text-(--ink-strong)">
              Newsreader
            </span>
            <span className="font-mono text-[11px] leading-none font-normal text-(--ink-fainter)">
              {c.typeSerifUse}
            </span>
          </div>
          <div className="text-[clamp(26px,7vw,34px)] leading-[1.2] font-normal text-(--ink-strong)">
            Building things worth seeing.
          </div>
          <div className="mt-2 text-[20px] leading-[1.4] font-normal text-(--ink-soft) italic">
            Serif italic for emphasis and quiet detail.
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
            <span className="font-mono text-[18px] leading-none font-medium text-(--ink-strong)">
              JetBrains Mono
            </span>
            <span className="font-mono text-[11px] leading-none font-normal text-(--ink-fainter)">
              {c.typeMonoUse}
            </span>
          </div>
          <div className="font-mono text-[12px] leading-none font-medium tracking-[0.08em] text-(--ink-fainter) uppercase">
            Section label
          </div>
          <div className="mt-3 font-mono text-[14px] leading-none font-normal text-(--ink-muted)">
            Founder · 2017 · Pre-seed · ★ 2.7k
          </div>
        </div>
      </section>

      {/* Voice */}
      <section className="mb-16">
        <h2 className={`${label} mb-1.5`}>{c.lblVoice}</h2>
        {c.voice.map((v, i) => (
          <div
            key={i}
            className="flex items-baseline gap-[14px] border-b border-border py-[14px]"
          >
            <span
              aria-hidden
              className="flex-shrink-0 font-mono text-[13px] text-(--rust-bright)"
            >
              →
            </span>
            <span className="text-[17px] leading-[1.45] font-normal text-(--ink-body)">
              {v}
            </span>
          </div>
        ))}
      </section>

      {/* Elements */}
      <section className="mb-20">
        <h2 className={`${label} mb-[22px]`}>{c.lblElements}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              buttonVariants({ variant: "pill", size: "pill" }),
              "pointer-events-none py-[14px]"
            )}
          >
            Get in touch
          </span>
          <span
            className={cn(
              buttonVariants({ variant: "pill-outline", size: "pill" }),
              "pointer-events-none px-5 py-[13px] text-[12.5px]"
            )}
          >
            Secondary
          </span>
          <Badge variant="status">Pre-seed</Badge>
          <span className="flex items-baseline gap-[7px] rounded-full border border-(--pill-border) px-[14px] py-[9px] font-mono text-[12.5px] leading-none font-normal text-(--ink-muted)">
            <span className="text-[9.5px] tracking-[0.06em] text-(--ink-fainter) uppercase">
              X
            </span>
            <span>@CodeHagen</span>
          </span>
        </div>
      </section>
    </main>
  )
}
