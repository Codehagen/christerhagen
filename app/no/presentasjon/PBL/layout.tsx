import type { Metadata } from "next"

// X sitt videonettverk svarer 403 når forespørselen har en Referer fra et annet
// nettsted. Uten henvisning spilles Generativ UI-videoen.
export const metadata: Metadata = {
  referrer: "no-referrer",
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
