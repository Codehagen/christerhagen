import { type Lang } from "@/lib/companies"
import { contactContent, socialLinks } from "@/lib/content"
import { localizedPath } from "@/lib/seo"
import { cn } from "@/lib/utils"

import { CopyAddress } from "@/components/site/copy-address"
import { LangSwitch } from "@/components/site/lang-switch"
import { SignaturePortrait } from "@/components/site/portrait"
import { Link } from "next-view-transitions"

const LINKS = {
  en: { process: "How I work", brand: "Brand", privacy: "Privacy" },
  no: { process: "Slik jobber jeg", brand: "Brand kit", privacy: "Personvern" },
}

const quiet = "hit transition-colors duration-[var(--dur-color)] hover:text-ink"

/**
 * The footer (DESIGN.md §4 Footer): the address with its copy button and the
 * availability line under it, on a hairline about 64px below the content,
 * aligned to the page's column. Under it, one quiet line: the socials the
 * site lists, the three secondary pages, and EN / NO.
 *
 * - `column`: `"rail"` (28% / 528px: home, about, writing, posts) or
 *   `"wide"` (16% / 648px: portfolio, company pages). Phone: page padding.
 * - `variant="signature"` (about, 67): the small portrait, name and
 *   availability, then the address — the page's sign-off.
 * - `address={false}`: only the quiet line, for the contact page, whose
 *   column already leads with the address.
 */
export function SiteFooter({
  lang,
  column = "rail",
  variant = "default",
  address = true,
  className,
}: {
  lang: Lang
  column?: "rail" | "wide"
  variant?: "default" | "signature"
  address?: boolean
  className?: string
}) {
  const t = LINKS[lang]
  const availability = contactContent[lang].availability
  const socials = socialLinks(lang).filter((s) => !s.url.startsWith("mailto:"))

  return (
    <footer
      lang={lang === "en" ? "en" : "nb-NO"}
      className={cn("mt-16 border-t border-hairline pt-9 pb-12", className)}
    >
      <div
        className={cn(
          "px-[var(--page-pad-x)] lg:px-0",
          column === "rail"
            ? "lg:ml-[var(--column-left)] lg:w-[var(--column)]"
            : "lg:ml-[var(--column-wide-left)] lg:w-[var(--column-wide)]"
        )}
      >
        {!address ? null : variant === "signature" ? (
          <SignaturePortrait lang={lang} availability={availability} />
        ) : (
          <CopyAddress lang={lang} note={availability} />
        )}

        <div
          className={cn(
            address && "mt-6",
            "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-small text-ink-faint"
          )}
        >
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={quiet}
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={localizedPath("/process", lang)} className={quiet}>
                {t.process}
              </Link>
            </li>
            <li>
              <Link href={localizedPath("/brand", lang)} className={quiet}>
                {t.brand}
              </Link>
            </li>
            <li>
              {/* rel="privacy-policy": the registered link relation agents and
                  crawlers use to find a site's policy without guessing URLs. */}
              <Link
                rel="privacy-policy"
                href={localizedPath("/privacy", lang)}
                className={quiet}
              >
                {t.privacy}
              </Link>
            </li>
          </ul>
          <LangSwitch lang={lang} />
        </div>
      </div>
    </footer>
  )
}
