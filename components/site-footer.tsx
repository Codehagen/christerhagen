import { Link } from "next-view-transitions"

import { type Lang } from "@/lib/companies"
import { localizedPath } from "@/lib/seo"

const footerLinks = {
  en: { process: "How I work", brand: "Brand" },
  no: { process: "Slik jobber jeg", brand: "Brand kit" },
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = footerLinks[lang]

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[740px] flex-col gap-3 px-5 sm:px-7 py-6 font-mono text-[11.5px] leading-[1.5] font-normal text-(--ink-fainter)">
        <nav className="flex flex-wrap items-center gap-4">
          <Link
            href={localizedPath("/process", lang)}
            className="relative inline-flex items-center transition-colors before:absolute before:-inset-x-1.5 before:-inset-y-3.5 before:content-[''] hover:text-(--rust-strong)"
          >
            {t.process}
          </Link>
          <Link
            href={localizedPath("/brand", lang)}
            className="relative inline-flex items-center transition-colors before:absolute before:-inset-x-1.5 before:-inset-y-3.5 before:content-[''] hover:text-(--rust-strong)"
          >
            {t.brand}
          </Link>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>Bodø, Norway</span>
          <span>© {new Date().getFullYear()} Christer Hagen</span>
        </div>
      </div>
    </footer>
  )
}
