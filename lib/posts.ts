import type { Lang } from "@/lib/companies"

export interface Post {
  title: string
  date: string
  dateISO: string
  read: string
  excerpt: string
  body: string[]
}

export const postOrder = [
  "docdir-visma",
  "building-in-bodo",
  "apparel-to-software",
] as const

export type PostSlug = (typeof postOrder)[number]

export function isPostSlug(slug: string): slug is PostSlug {
  return (postOrder as readonly string[]).includes(slug)
}

export function nextPostSlug(slug: PostSlug): PostSlug {
  const i = postOrder.indexOf(slug)
  return postOrder[(i + 1) % postOrder.length]
}

export const posts: Record<Lang, Record<PostSlug, Post>> = {
  en: {
    "docdir-visma": {
      title: "Selling Docdir to Visma",
      date: "Feb 2026",
      dateISO: "2026-02-15",
      read: "2 min",
      excerpt:
        "How a small tool for Norwegian real-estate documents became an acquisition by Visma.",
      body: [
        "Docdir started as a small tool to take the worst part of a real-estate transaction — assembling and quality-checking the sales prospectus — and let software do it. We trained it on Norwegian documents, in Norwegian, for Norwegian agents.",
        "In early 2026 it was acquired by Broker AS, part of the Visma group. It is the second Bodø company Visma has bought; PowerOffice was the first. For a product built in the north, that meant a great deal.",
        "What I took from it: solve a boring, expensive problem for a specific group of people, in their own language, and the size of the city you build in stops mattering.",
      ],
    },
    "building-in-bodo": {
      title: "Why I build companies in Bodø",
      date: "Nov 2025",
      dateISO: "2025-11-15",
      read: "2 min",
      excerpt:
        "You do not have to move to Oslo to build technology companies. Here is the case for the north.",
      body: [
        "People assume you have to move to Oslo, or further, to build technology companies. I have built mine 1,200 kilometres north of the capital, and I would not change it.",
        "Bodø is small enough that you know everyone worth knowing within a week, and serious enough that real companies — in software, real estate and energy — actually get built here. Talent is loyal, rent is cheap, focus is easy.",
        "The internet does not care where you are. Customers care that you solve their problem. Everything else is a story we tell ourselves.",
      ],
    },
    "apparel-to-software": {
      title: "What apparel taught me about software",
      date: "Jun 2024",
      dateISO: "2024-06-15",
      read: "2 min",
      excerpt:
        "My first company sold fitness apparel. The instincts from physical products never left.",
      body: [
        "My first company, Refenze, made fitness apparel. Manufactured in China, sold to customers across Europe and the US, growing 25% a month at its peak. I was in my mid-twenties, learning everything the hard way.",
        "Physical products teach you things software founders skip: cash is real, inventory is a bet, and a refund is a conversation rather than a button. You feel every single unit.",
        "When I moved to software, those instincts stayed. Ship something people pay for. Watch the money, not the vanity metrics. Treat every customer like you still had to mail them a box.",
      ],
    },
  },
  no: {
    "docdir-visma": {
      title: "Å selge Docdir til Visma",
      date: "feb 2026",
      dateISO: "2026-02-15",
      read: "2 min",
      excerpt:
        "Hvordan et lite verktøy for norske eiendomsdokumenter ble kjøpt opp av Visma.",
      body: [
        "Docdir startet som et lite verktøy for å ta den verste delen av en eiendomshandel — å sette sammen og kvalitetssikre salgsoppgaven — og la programvare gjøre jobben. Vi trente det på norske dokumenter, på norsk, for norske meglere.",
        "Tidlig i 2026 ble det kjøpt opp av Broker AS, en del av Visma-konsernet. Det er det andre Bodø-selskapet Visma har kjøpt; PowerOffice var det første. For et produkt bygget i nord betydde det mye.",
        "Det jeg tok med meg: løs et kjedelig, dyrt problem for en bestemt gruppe mennesker, på deres eget språk, så slutter størrelsen på byen du bygger i å bety noe.",
      ],
    },
    "building-in-bodo": {
      title: "Hvorfor jeg bygger selskaper i Bodø",
      date: "nov 2025",
      dateISO: "2025-11-15",
      read: "2 min",
      excerpt:
        "Du trenger ikke flytte til Oslo for å bygge teknologiselskaper. Her er argumentet for nord.",
      body: [
        "Folk tror du må flytte til Oslo, eller lenger, for å bygge teknologiselskaper. Jeg har bygget mine 1 200 kilometer nord for hovedstaden, og jeg ville ikke byttet.",
        "Bodø er lite nok til at du kjenner alle verdt å kjenne i løpet av en uke, og seriøst nok til at ekte selskaper — innen programvare, eiendom og energi — faktisk blir bygget her. Folk er lojale, husleia er billig, det er lett å fokusere.",
        "Internett bryr seg ikke om hvor du er. Kundene bryr seg om at du løser problemet deres. Alt annet er en historie vi forteller oss selv.",
      ],
    },
    "apparel-to-software": {
      title: "Hva treningsklær lærte meg om programvare",
      date: "jun 2024",
      dateISO: "2024-06-15",
      read: "2 min",
      excerpt:
        "Mitt første selskap solgte treningsklær. Instinktene fra fysiske produkter forsvant aldri.",
      body: [
        "Mitt første selskap, Refenze, lagde treningsklær. Produsert i Kina, solgt til kunder i Europa og USA, med 25 % vekst i måneden på det meste. Jeg var midt i tjueårene og lærte alt på den harde måten.",
        "Fysiske produkter lærer deg ting programvaregründere hopper over: penger er ekte, lager er et veddemål, og en refusjon er en samtale — ikke en knapp. Du kjenner hver eneste enhet.",
        "Da jeg gikk over til programvare, ble de instinktene sittende. Lag noe folk betaler for. Følg pengene, ikke forfengelighetstallene. Behandle hver kunde som om du fortsatt måtte sende dem en eske.",
      ],
    },
  },
}

export interface WritingCopy {
  kicker: string
  intro: string
  backLabel: string
  readNextLabel: string
}

export const writingCopy: Record<Lang, WritingCopy> = {
  en: {
    kicker: "Writing",
    intro:
      "Notes on building software companies, real estate and investing — from the north of Norway.",
    backLabel: "All writing",
    readNextLabel: "Read next",
  },
  no: {
    kicker: "Tekster",
    intro:
      "Tekster om å bygge programvareselskaper, eiendom og investering — fra Nord-Norge.",
    backLabel: "Alle tekster",
    readNextLabel: "Les neste",
  },
}
