import type { Lang } from "@/lib/companies"

/* ------------------------------------------------------------------ shared */

export interface SocialLink {
  label: string
  handle: string
  url: string
}

export function socialLinks(lang: Lang): SocialLink[] {
  return [
    {
      label: lang === "no" ? "E-post" : "Email",
      handle: "christer@codenord.no",
      url: "mailto:christer@codenord.no",
    },
    { label: "X", handle: "@CodeHagen", url: "https://x.com/CodeHagen" },
    { label: "GitHub", handle: "Codehagen", url: "https://github.com/Codehagen" },
    {
      label: "LinkedIn",
      handle: "christerhagen",
      url: "https://www.linkedin.com/in/christerhagen",
    },
    {
      label: "Instagram",
      handle: "christerhagen",
      url: "https://www.instagram.com/christerhagen",
    },
  ]
}

export const EMAIL = "christer@codenord.no"

/* -------------------------------------------------------------------- home */

interface WorkItem {
  name: string
  role: string
  period: string
  url: string
}
interface DescLink {
  name: string
  desc: string
  url: string
}
interface HomeExit extends DescLink {
  stage: string
}
interface OssItem extends DescLink {
  stars: string
}
interface WritingLink {
  title: string
  date: string
  slug: string
}

export interface HomeContent {
  heroHead: string
  heroSub: string
  lblAbout: string
  lblNow: string
  lblWork: string
  lblInvest: string
  lblExits: string
  lblOss: string
  lblWriting: string
  lblContact: string
  aboutRole: string
  aboutBody: string
  now: string[]
  work: WorkItem[]
  investments: DescLink[]
  exits: HomeExit[]
  oss: OssItem[]
  writing: WritingLink[]
  ctaHead: string
  ctaBody: string
  ctaBtn: string
}

const NAV_URL = "https://notanother.vc"
const inv = (lang: Lang, slug: string) =>
  `${NAV_URL}/${lang}/portefolje/${slug}`

export const homeContent: Record<Lang, HomeContent> = {
  en: {
    heroHead: "Serial entrepreneur and angel investor.",
    heroSub:
      "I start software companies, back technical founders early, and have built and sold several of my own.",
    lblAbout: "About",
    lblNow: "Now",
    lblWork: "Work",
    lblInvest: "Investments",
    lblExits: "Exits",
    lblOss: "Open source",
    lblWriting: "Writing",
    lblContact: "Contact",
    aboutRole: "Serial entrepreneur & angel investor · Bodø, Norway",
    aboutBody:
      "Christer Hagen is a Norwegian serial entrepreneur and angel investor based in Bodø. He founded Codebase and Not Another VC, is a partner at Advanti Estate, and writes software in the open. In 2026 he sold Docdir to Visma and placed in the top 4% of the Norwegian AI Championship.",
    now: [
      "Building Sailsdock, a CRM for Norwegian sales teams.",
      "Investing pre-seed as an angel through Not Another VC.",
      "Sold Docdir to Visma earlier this year.",
    ],
    work: [
      {
        name: "Codebase",
        role: "Founder · Technology studio & angel",
        period: "Since 2017",
        url: "https://github.com/Codehagen",
      },
      {
        name: "Not Another VC",
        role: "Founder · Pre-seed angel investing",
        period: "Since 2023",
        url: NAV_URL,
      },
      {
        name: "Advanti Estate",
        role: "Partner · Commercial real estate",
        period: "Since 2024",
        url: inv("en", "advanti-estate"),
      },
      {
        name: "Refenze",
        role: "Founder · Fitness apparel (closed)",
        period: "2016-2018",
        url: "#",
      },
    ],
    investments: [
      {
        name: "Codenord",
        desc: "Tailored software that removes bottlenecks in operations.",
        url: inv("en", "codenord"),
      },
      {
        name: "Propdock",
        desc: "Real-time insight into property portfolios for smarter decisions.",
        url: inv("en", "propdock"),
      },
      {
        name: "Sailsdock",
        desc: "CRM that prioritises sales opportunities with data and automation.",
        url: inv("en", "sailsdock"),
      },
      {
        name: "Vendo",
        desc: "Lets agents share campaigns landlords approve and pay for in seconds.",
        url: inv("en", "vendo"),
      },
      {
        name: "Fotovibe",
        desc: "Visual content that elevates home sales and the agent experience.",
        url: inv("en", "fotovibe"),
      },
      {
        name: "Somevibe",
        desc: "Measurable, optimised social-media growth for growing companies.",
        url: inv("en", "somevibe"),
      },
      {
        name: "Advanti Estate",
        desc: "Buys, sells and rents commercial property across Northern Norway.",
        url: inv("en", "advanti-estate"),
      },
    ],
    exits: [
      {
        name: "Docdir",
        desc: "AI for real-estate sales documents. Sold to Visma in 2026.",
        stage: "Acquired",
        url: inv("en", "docdir"),
      },
      {
        name: "Utleieoversikten",
        desc: "Portfolio calculator that gave investors full control and enabled exit.",
        stage: "Exit",
        url: inv("en", "utleieoversikten"),
      },
    ],
    oss: [
      {
        name: "Badget",
        desc: "Open-source finance platform",
        stars: "2.7k",
        url: "https://github.com/Codehagen",
      },
      {
        name: "Prismui",
        desc: "UI components built on shadcn/ui",
        stars: "789",
        url: "https://github.com/Codehagen",
      },
    ],
    writing: [
      { title: "Selling Docdir to Visma", date: "2026", slug: "docdir-visma" },
      {
        title: "Why I build companies in Bodø",
        date: "2025",
        slug: "building-in-bodo",
      },
      {
        title: "What apparel taught me about software",
        date: "2024",
        slug: "apparel-to-software",
      },
    ],
    ctaHead: "Building something? Let me know.",
    ctaBody:
      "I back technical founders at pre-seed. A few lines about what you're building is enough.",
    ctaBtn: "Get in touch",
  },
  no: {
    heroHead: "Seriegründer og engleinvestor.",
    heroSub:
      "Jeg starter programvareselskaper, investerer tidlig i tekniske gründere, og har bygget og solgt flere selv.",
    lblAbout: "Om",
    lblNow: "Akkurat nå",
    lblWork: "Arbeid",
    lblInvest: "Investeringer",
    lblExits: "Exits",
    lblOss: "Åpen kildekode",
    lblWriting: "Skriver",
    lblContact: "Kontakt",
    aboutRole: "Seriegründer & engleinvestor · Bodø, Norge",
    aboutBody:
      "Christer Hagen er en norsk seriegründer og engleinvestor fra Bodø. Han grunnla Codebase og Not Another VC, er partner i Advanti Estate, og skriver programvare i åpen kildekode. I 2026 solgte han Docdir til Visma og kom blant de 4 % beste i NM i AI.",
    now: [
      "Bygger Sailsdock, en CRM for norske salgsteam.",
      "Investerer pre-seed som engleinvestor gjennom Not Another VC.",
      "Solgte Docdir til Visma tidligere i år.",
    ],
    work: [
      {
        name: "Codebase",
        role: "Grunnlegger · Teknologistudio & engleinvestor",
        period: "Siden 2017",
        url: "https://github.com/Codehagen",
      },
      {
        name: "Not Another VC",
        role: "Grunnlegger · Pre-seed engleinvestering",
        period: "Siden 2023",
        url: NAV_URL,
      },
      {
        name: "Advanti Estate",
        role: "Partner · Næringseiendom",
        period: "Siden 2024",
        url: inv("no", "advanti-estate"),
      },
      {
        name: "Refenze",
        role: "Grunnlegger · Treningsklær (avsluttet)",
        period: "2016-2018",
        url: "#",
      },
    ],
    investments: [
      {
        name: "Codenord",
        desc: "Skreddersydd programvare som fjerner flaskehalser i driften.",
        url: inv("no", "codenord"),
      },
      {
        name: "Propdock",
        desc: "Sanntidsinnsikt i eiendomsporteføljer for smartere beslutninger.",
        url: inv("no", "propdock"),
      },
      {
        name: "Sailsdock",
        desc: "CRM som prioriterer salgsmuligheter med data og automatisering.",
        url: inv("no", "sailsdock"),
      },
      {
        name: "Vendo",
        desc: "Lar meglere dele kampanjer utleiere godkjenner og betaler på sekunder.",
        url: inv("no", "vendo"),
      },
      {
        name: "Fotovibe",
        desc: "Visuelt innhold som løfter boligsalg og megleropplevelsen.",
        url: inv("no", "fotovibe"),
      },
      {
        name: "Somevibe",
        desc: "Målbar, optimalisert vekst i sosiale medier for selskaper i vekst.",
        url: inv("no", "somevibe"),
      },
      {
        name: "Advanti Estate",
        desc: "Kjøper, selger og leier ut næringseiendom i Nord-Norge.",
        url: inv("no", "advanti-estate"),
      },
    ],
    exits: [
      {
        name: "Docdir",
        desc: "AI for salgsoppgaver i eiendom. Solgt til Visma i 2026.",
        stage: "Oppkjøpt",
        url: inv("no", "docdir"),
      },
      {
        name: "Utleieoversikten",
        desc: "Porteføljekalkulator som ga investorer full kontroll og muliggjorde exit.",
        stage: "Exit",
        url: inv("no", "utleieoversikten"),
      },
    ],
    oss: [
      {
        name: "Badget",
        desc: "Åpen finansplattform",
        stars: "2.7k",
        url: "https://github.com/Codehagen",
      },
      {
        name: "Prismui",
        desc: "UI-komponenter bygget på shadcn/ui",
        stars: "789",
        url: "https://github.com/Codehagen",
      },
    ],
    writing: [
      { title: "Å selge Docdir til Visma", date: "2026", slug: "docdir-visma" },
      {
        title: "Hvorfor jeg bygger selskaper i Bodø",
        date: "2025",
        slug: "building-in-bodo",
      },
      {
        title: "Hva treningsklær lærte meg om programvare",
        date: "2024",
        slug: "apparel-to-software",
      },
    ],
    ctaHead: "Bygger du noe? Si fra.",
    ctaBody:
      "Jeg investerer i tekniske gründere på pre-seed. Noen linjer om hva du bygger holder.",
    ctaBtn: "Ta kontakt",
  },
}

/* ------------------------------------------------------------------- about */

interface TimelineItem {
  year: string
  event: string
}

export interface AboutContent {
  kicker: string
  head: string
  lblBackground: string
  bio: string[]
  timeline: TimelineItem[]
  ctaLine: string
  ctaPortfolio: string
  ctaProcess: string
}

export const aboutContent: Record<Lang, AboutContent> = {
  en: {
    kicker: "About",
    head: "A serial entrepreneur and angel investor, building from the north of Norway.",
    lblBackground: "Background",
    bio: [
      "I'm from Bodø, in the north of Norway. I grew up in Fauske, swam competitively, and studied entrepreneurship at Nord University before starting my first company.",
      "That company, Refenze, sold fitness apparel across Europe and the US. It taught me how unforgiving real businesses are, and I have been building them ever since.",
      "Through Codebase I build and back software companies. Sailsdock is the CRM I run day to day; Docdir, which I sold to Visma in 2026, automated real-estate documents with Norwegian AI. I am a partner at Advanti Estate and I invest pre-seed through Not Another VC.",
      "I build in the open on GitHub, placed in the top 4% of the Norwegian AI Championship, and I still believe the best companies can be built far from the capital.",
    ],
    timeline: [
      { year: "2016", event: "Founded Refenze, a fitness apparel brand." },
      { year: "2017", event: "Founded Codebase, my technology studio." },
      { year: "2021", event: "Founded Sailsdock, a CRM for sales teams." },
      {
        year: "2023",
        event: "Started angel investing through Not Another VC.",
      },
      { year: "2024", event: "Became a partner at Advanti Estate." },
      { year: "2026", event: "Sold Docdir to Visma." },
    ],
    ctaLine: "See what I have built and backed, or how I work with founders.",
    ctaPortfolio: "View portfolio",
    ctaProcess: "How I work",
  },
  no: {
    kicker: "Om",
    head: "En seriegründer og engleinvestor, som bygger fra Nord-Norge.",
    lblBackground: "Bakgrunn",
    bio: [
      "Jeg er fra Bodø, i Nord-Norge. Jeg vokste opp i Fauske, svømte på konkurransenivå, og studerte entreprenørskap ved Nord universitet før jeg startet mitt første selskap.",
      "Det selskapet, Refenze, solgte treningsklær i Europa og USA. Det lærte meg hvor nådeløs ekte forretning er, og jeg har bygget selskaper siden.",
      "Gjennom Codebase bygger og investerer jeg i programvareselskaper. Sailsdock er CRM-en jeg driver daglig; Docdir, som jeg solgte til Visma i 2026, automatiserte salgsoppgaver med norsk AI. Jeg er partner i Advanti Estate og investerer pre-seed gjennom Not Another VC.",
      "Jeg bygger i åpen kildekode på GitHub, kom blant de 4 % beste i NM i AI, og tror fortsatt de beste selskapene kan bygges langt fra hovedstaden.",
    ],
    timeline: [
      { year: "2016", event: "Grunnla Refenze, et treningsklærmerke." },
      { year: "2017", event: "Grunnla Codebase, teknologistudioet mitt." },
      { year: "2021", event: "Grunnla Sailsdock, en CRM for salgsteam." },
      {
        year: "2023",
        event: "Begynte å engleinvestere gjennom Not Another VC.",
      },
      { year: "2024", event: "Ble partner i Advanti Estate." },
      { year: "2026", event: "Solgte Docdir til Visma." },
    ],
    ctaLine:
      "Se hva jeg har bygget og investert i, eller hvordan jeg jobber med gründere.",
    ctaPortfolio: "Se portefølje",
    ctaProcess: "Slik jobber jeg",
  },
}

/* --------------------------------------------------------------- portfolio */

interface PortfolioItem {
  slug: string
  name: string
  desc: string
  meta: string
}
interface PortfolioExit {
  slug: string
  name: string
  desc: string
  stage: string
}

export interface PortfolioContent {
  kicker: string
  intro: string
  gBuilt: string
  gInvest: string
  gExits: string
  built: PortfolioItem[]
  invest: PortfolioItem[]
  exits: PortfolioExit[]
}

export const portfolioContent: Record<Lang, PortfolioContent> = {
  en: {
    kicker: "Portfolio",
    intro:
      "Companies I've built, backed and sold. Mostly software, mostly Norwegian, mostly pre-seed.",
    gBuilt: "Building",
    gInvest: "Angel investments",
    gExits: "Exits",
    built: [
      {
        slug: "codebase",
        name: "Codebase",
        desc: "Technology studio and the holding behind everything else.",
        meta: "Founder · 2017",
      },
      {
        slug: "sailsdock",
        name: "Sailsdock",
        desc: "CRM that prioritises sales opportunities for Norwegian teams.",
        meta: "Founder · 2021",
      },
      {
        slug: "advanti-estate",
        name: "Advanti Estate",
        desc: "Commercial real estate brokerage across Northern Norway.",
        meta: "Partner · 2024",
      },
      {
        slug: "refenze",
        name: "Refenze",
        desc: "Fitness apparel brand. First company, sold across Europe and the US.",
        meta: "Founder · 2016",
      },
    ],
    invest: [
      {
        slug: "codenord",
        name: "Codenord",
        desc: "Tailored software that removes bottlenecks in operations.",
        meta: "Pre-seed",
      },
      {
        slug: "propdock",
        name: "Propdock",
        desc: "Real-time insight into property portfolios for smarter decisions.",
        meta: "Pre-seed",
      },
      {
        slug: "vendo",
        name: "Vendo",
        desc: "Lets agents share campaigns landlords approve and pay for in seconds.",
        meta: "Pre-seed",
      },
      {
        slug: "fotovibe",
        name: "Fotovibe",
        desc: "Visual content that elevates home sales and the agent experience.",
        meta: "Pre-seed",
      },
      {
        slug: "somevibe",
        name: "Somevibe",
        desc: "Measurable, optimised social-media growth for growing companies.",
        meta: "Pre-seed",
      },
    ],
    exits: [
      {
        slug: "docdir",
        name: "Docdir",
        desc: "AI for real-estate sales documents. Sold to Visma in 2026.",
        stage: "Acquired",
      },
      {
        slug: "utleieoversikten",
        name: "Utleieoversikten",
        desc: "Portfolio calculator that gave investors full control and enabled exit.",
        stage: "Exit",
      },
    ],
  },
  no: {
    kicker: "Portefølje",
    intro:
      "Selskaper jeg har bygget, investert i og solgt. Mest programvare, mest norsk, mest pre-seed.",
    gBuilt: "Bygger",
    gInvest: "Engleinvesteringer",
    gExits: "Exits",
    built: [
      {
        slug: "codebase",
        name: "Codebase",
        desc: "Teknologistudio og holdingen bak alt det andre.",
        meta: "Grunnlegger · 2017",
      },
      {
        slug: "sailsdock",
        name: "Sailsdock",
        desc: "CRM som prioriterer salgsmuligheter for norske team.",
        meta: "Grunnlegger · 2021",
      },
      {
        slug: "advanti-estate",
        name: "Advanti Estate",
        desc: "Næringsmegling i Nord-Norge.",
        meta: "Partner · 2024",
      },
      {
        slug: "refenze",
        name: "Refenze",
        desc: "Treningsklær. Første selskap, solgt i Europa og USA.",
        meta: "Grunnlegger · 2016",
      },
    ],
    invest: [
      {
        slug: "codenord",
        name: "Codenord",
        desc: "Skreddersydd programvare som fjerner flaskehalser i driften.",
        meta: "Pre-seed",
      },
      {
        slug: "propdock",
        name: "Propdock",
        desc: "Sanntidsinnsikt i eiendomsporteføljer for smartere beslutninger.",
        meta: "Pre-seed",
      },
      {
        slug: "vendo",
        name: "Vendo",
        desc: "Lar meglere dele kampanjer utleiere godkjenner og betaler på sekunder.",
        meta: "Pre-seed",
      },
      {
        slug: "fotovibe",
        name: "Fotovibe",
        desc: "Visuelt innhold som løfter boligsalg og megleropplevelsen.",
        meta: "Pre-seed",
      },
      {
        slug: "somevibe",
        name: "Somevibe",
        desc: "Målbar, optimalisert vekst i sosiale medier for selskaper i vekst.",
        meta: "Pre-seed",
      },
    ],
    exits: [
      {
        slug: "docdir",
        name: "Docdir",
        desc: "AI for salgsoppgaver i eiendom. Solgt til Visma i 2026.",
        stage: "Oppkjøpt",
      },
      {
        slug: "utleieoversikten",
        name: "Utleieoversikten",
        desc: "Porteføljekalkulator som ga investorer full kontroll og muliggjorde exit.",
        stage: "Exit",
      },
    ],
  },
}

/* ----------------------------------------------------------------- process */

interface ProcessStep {
  no: string
  title: string
  body: string
}

export interface ProcessContent {
  kicker: string
  head: string
  intro: string
  steps: ProcessStep[]
  lblLook: string
  lookBody: string
  ctaLine: string
  ctaBtn: string
}

export const processContent: Record<Lang, ProcessContent> = {
  en: {
    kicker: "How I work",
    head: "I invest early and stay close.",
    intro:
      "A cheque is the start of the relationship, not the whole of it. I work with founders the way I wish investors had worked with me.",
    steps: [
      {
        no: "01",
        title: "Back early",
        body: "I write pre-seed cheques on conviction, not process. If I believe in the founder and the problem, I move fast and decide myself.",
      },
      {
        no: "02",
        title: "Build with you",
        body: "I am a builder first. I help with product, go-to-market, hiring and the unglamorous operational work, as part of the team rather than from a board seat.",
      },
      {
        no: "03",
        title: "Stay close",
        body: "I invest for the long run and stay involved through the hard parts, not just the announcements. Fewer companies, more attention each.",
      },
    ],
    lblLook: "What I look for",
    lookBody:
      "Technical founders solving real problems, mostly in Norway and the Nordics. Software, proptech and real estate are home turf.",
    ctaLine: "Building something? Let me know.",
    ctaBtn: "Get in touch",
  },
  no: {
    kicker: "Slik jobber jeg",
    head: "Jeg investerer tidlig og holder meg nær.",
    intro:
      "En investering er starten på forholdet, ikke hele det. Jeg jobber med gründere slik jeg skulle ønsket investorer jobbet med meg.",
    steps: [
      {
        no: "01",
        title: "Investerer tidlig",
        body: "Jeg skriver pre-seed-sjekker på overbevisning, ikke prosess. Tror jeg på gründeren og problemet, beveger jeg meg raskt og bestemmer selv.",
      },
      {
        no: "02",
        title: "Bygger med deg",
        body: "Jeg er bygger først. Jeg hjelper med produkt, markedsstrategi, ansettelser og det lite glamorøse driftsarbeidet, som del av teamet snarere enn fra en styreplass.",
      },
      {
        no: "03",
        title: "Holder meg nær",
        body: "Jeg investerer for det lange løp og er involvert gjennom de vanskelige delene, ikke bare kunngjøringene. Færre selskaper, mer oppmerksomhet på hvert.",
      },
    ],
    lblLook: "Hva jeg ser etter",
    lookBody:
      "Tekniske gründere som løser ekte problemer, for det meste i Norge og Norden. Programvare, proptech og eiendom er hjemmebane.",
    ctaLine: "Bygger du noe? Si fra.",
    ctaBtn: "Ta kontakt",
  },
}

/* ----------------------------------------------------------------- contact */

export interface ContactContent {
  kicker: string
  head: string
  body: string
  availability: string
  lookHead: string
  lookBody: string
}

export const contactContent: Record<Lang, ContactContent> = {
  en: {
    kicker: "Contact",
    head: "Ready to take the next step?",
    body: "I'd love to hear what you're building. Tell me about your project — a few lines is enough.",
    availability: "Based in Bodø, Norway · usually replies within a day",
    lookHead: "What I look for",
    lookBody:
      "I back early-stage technical founders, mostly in Norway and the Nordics — pre-seed and seed. If that sounds like you, get in touch.",
  },
  no: {
    kicker: "Kontakt",
    head: "Klar for neste steg?",
    body: "Jeg vil gjerne høre hva du bygger. Fortell meg om prosjektet ditt — noen linjer holder.",
    availability: "Basert i Bodø, Norge · svarer som regel innen en dag",
    lookHead: "Hva jeg ser etter",
    lookBody:
      "Jeg investerer i tekniske gründere i tidlig fase, for det meste i Norge og Norden — pre-seed og seed. Høres det ut som deg, så ta kontakt.",
  },
}
