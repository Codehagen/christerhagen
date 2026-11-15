export type Lang = "en" | "no"

export interface Company {
  name: string
  tagline: string
  role: string
  stage: string
  year: string
  sector: string
  status: string
  site: string
  body: string[]
}

export interface UiCopy {
  navAbout: string
  navPortfolio: string
  navWriting: string
  navContact: string
  getInTouch: string
  backLabel: string
  visitLabel: string
  nextLabel: string
  mRole: string
  mStage: string
  mYear: string
  mSector: string
}

/** Display order; also drives the "Next" link cycle. Shared across languages. */
export const companyOrder = [
  "codebase",
  "bedrifty",
  "sailsdock",
  "advanti-estate",
  "miniskatten",
  "refenze",
  "codenord",
  "propdock",
  "vendo",
  "fotovibe",
  "somevibe",
  "docdir",
  "utleieoversikten",
] as const

export type CompanySlug = (typeof companyOrder)[number]

export const defaultSlug: CompanySlug = "codebase"

export const uiCopy: Record<Lang, UiCopy> = {
  en: {
    navAbout: "About",
    navPortfolio: "Portfolio",
    navWriting: "Writing",
    navContact: "Contact",
    getInTouch: "Get in touch",
    backLabel: "Portfolio",
    visitLabel: "Visit",
    nextLabel: "Next",
    mRole: "Role",
    mStage: "Stage",
    mYear: "Year",
    mSector: "Sector",
  },
  no: {
    navAbout: "Om",
    navPortfolio: "Portefølje",
    navWriting: "Tekster",
    navContact: "Kontakt",
    getInTouch: "Ta kontakt",
    backLabel: "Portefølje",
    visitLabel: "Besøk",
    nextLabel: "Neste",
    mRole: "Rolle",
    mStage: "Fase",
    mYear: "År",
    mSector: "Sektor",
  },
}

export const companies: Record<Lang, Record<CompanySlug, Company>> = {
  en: {
    codebase: {
      name: "Codebase",
      tagline: "Technology studio and angel investing arm.",
      role: "Founder",
      stage: "Studio",
      year: "2017",
      sector: "Software",
      status: "Active",
      site: "https://github.com/Codehagen",
      body: [
        "Codebase is the studio and holding company behind most of what I do. It builds software products, starts new companies and makes early angel investments.",
        "It started as a way to ship my own ideas without asking permission, and grew into the structure everything else now runs through.",
      ],
    },
    bedrifty: {
      name: "Bedrifty",
      tagline: "AI-native CRM with built-in Norwegian company data.",
      role: "Founder",
      stage: "Building",
      year: "2026",
      sector: "SaaS / CRM",
      status: "Active",
      site: "https://bedrifty.com",
      body: [
        "Bedrifty is an AI-native CRM with company data from Brønnøysundregistrene built in. You can search over two million Norwegian companies, see their financials and let AI do the research before the sales call.",
        "I’m building it through Codebase as the successor to Sailsdock. Same problem, rebuilt around AI and official Norwegian business data.",
      ],
    },
    sailsdock: {
      name: "Sailsdock",
      tagline: "CRM that prioritised sales opportunities for Norwegian teams.",
      role: "Founder",
      stage: "Sunset",
      year: "2021",
      sector: "SaaS / CRM",
      status: "Sunset",
      site: "https://www.sailsdock.no",
      body: [
        "Sailsdock was a CRM built for how Norwegian sales teams actually work. It ranked opportunities by signal instead of gut feeling and automated the busywork around them.",
        "I founded it through Codebase and ran it for a few years before winding it down. Its ideas live on in Bedrifty.",
      ],
    },
    "advanti-estate": {
      name: "Advanti Estate",
      tagline: "Commercial real estate brokerage across Northern Norway.",
      role: "Partner",
      stage: "Operating",
      year: "2024",
      sector: "Real estate",
      status: "Active",
      site: "https://notanother.vc/en/portefolje/advanti-estate",
      body: [
        "Advanti Estate advises on buying, selling and renting commercial property in Northern Norway. It runs on local knowledge the national chains don’t have.",
        "I came in as a partner to bring software and a sharper go-to-market to a traditionally analogue industry.",
      ],
    },
    miniskatten: {
      name: "Miniskatten",
      tagline: "Second-hand children’s clothing, sorted by size.",
      role: "Co-founder · Chair",
      stage: "Building",
      year: "2026",
      sector: "E-commerce",
      status: "Active",
      site: "https://www.miniskatten.no",
      body: [
        "Miniskatten sells second-hand children’s clothing online, sorted by size from 50 to 152. Parents can send in what their children have outgrown, and we check, photograph, price and sell it.",
        "I’m in Miniskatten together with my partner Maria. She runs it day to day. I chair the board and built the software.",
      ],
    },
    refenze: {
      name: "Refenze",
      tagline: "Fitness apparel brand. My first company.",
      role: "Founder",
      stage: "Sunset",
      year: "2016",
      sector: "E-commerce",
      status: "Sunset",
      site: "#",
      body: [
        "Refenze made fitness apparel, manufactured in Asia and sold to customers across Europe and the US. At its peak it grew around 25% a month.",
        "It is where I learned the hard parts of business: cash, inventory, and shipping a physical product to a real customer. I have since wound it down.",
      ],
    },
    codenord: {
      name: "Codenord",
      tagline: "Tailored software that removes bottlenecks in operations.",
      role: "Angel investor",
      stage: "Pre-seed",
      year: "2023",
      sector: "Software",
      status: "Active",
      site: "https://notanother.vc/en/portefolje/codenord",
      body: [
        "Codenord builds custom software for companies whose growth is capped by manual, repetitive operations. They find the bottleneck and remove it with code.",
        "I invested pre-seed through Not Another VC and help on product and go-to-market.",
      ],
    },
    propdock: {
      name: "Propdock",
      tagline: "Real-time insight into property portfolios.",
      role: "Angel investor",
      stage: "Pre-seed",
      year: "2022",
      sector: "Proptech",
      status: "Active",
      site: "https://notanother.vc/en/portefolje/propdock",
      body: [
        "Propdock gives property owners real-time insight into their portfolios, so they can decide faster and with better numbers.",
        "An early Not Another VC investment, close to the real-estate work I do elsewhere.",
      ],
    },
    vendo: {
      name: "Vendo",
      tagline: "Campaigns landlords approve and pay for in seconds.",
      role: "Angel investor",
      stage: "Pre-seed",
      year: "2024",
      sector: "Proptech",
      status: "Active",
      site: "https://notanother.vc/en/portefolje/vendo",
      body: [
        "Vendo lets agents share marketing campaigns that landlords approve and pay for in seconds. That takes days of back-and-forth out of every listing.",
        "Pre-seed, through Not Another VC.",
      ],
    },
    fotovibe: {
      name: "Fotovibe",
      tagline: "Visual content that helps sell homes.",
      role: "Angel investor",
      stage: "Pre-seed",
      year: "2024",
      sector: "Media / Proptech",
      status: "Active",
      site: "https://notanother.vc/en/portefolje/fotovibe",
      body: [
        "Fotovibe produces the visual content that sells homes and makes the agent look good doing it. It delivers at the speed a listing needs.",
        "Pre-seed, through Not Another VC.",
      ],
    },
    somevibe: {
      name: "Somevibe",
      tagline: "Measurable social-media growth for companies on the way up.",
      role: "Angel investor",
      stage: "Pre-seed",
      year: "2024",
      sector: "Marketing",
      status: "Active",
      site: "https://notanother.vc/en/portefolje/somevibe",
      body: [
        "Somevibe grows companies on social media, measures the results and keeps tuning. It treats reach as a system, not luck.",
        "Pre-seed, through Not Another VC.",
      ],
    },
    docdir: {
      name: "Docdir",
      tagline: "AI for real-estate sales documents.",
      role: "Founder",
      stage: "Acquired",
      year: "2024",
      sector: "AI / Proptech",
      status: "Acquired by Visma",
      site: "https://notanother.vc/en/portefolje/docdir",
      body: [
        "Docdir automated and quality-checked the sales prospectus that every Norwegian property transaction depends on. We trained it on Norwegian documents, in Norwegian.",
        "Broker AS, part of the Visma group, acquired it in 2026. It is the second Bodø company Visma has bought.",
      ],
    },
    utleieoversikten: {
      name: "Utleieoversikten",
      tagline: "Portfolio calculator for property investors.",
      role: "Investor",
      stage: "Exit",
      year: "2021",
      sector: "Proptech",
      status: "Exited",
      site: "https://notanother.vc/en/portefolje/utleieoversikten",
      body: [
        "Utleieoversikten gave property investors a portfolio calculator that put them in full control of their numbers.",
        "The company reached an exit and returned the early investment.",
      ],
    },
  },
  no: {
    codebase: {
      name: "Codebase",
      tagline: "Teknologistudio og engleinvesteringsarm.",
      role: "Grunnlegger",
      stage: "Studio",
      year: "2017",
      sector: "Programvare",
      status: "Aktiv",
      site: "https://github.com/Codehagen",
      body: [
        "Codebase er studioet og holdingselskapet bak det meste jeg gjør. Det bygger programvareprodukter, starter nye selskaper og gjør tidlige engleinvesteringer.",
        "Det startet som en måte å lansere egne ideer på uten å spørre om lov, og vokste til strukturen alt annet nå går gjennom.",
      ],
    },
    bedrifty: {
      name: "Bedrifty",
      tagline: "AI-native CRM med innebygd norsk bedriftsdata.",
      role: "Grunnlegger",
      stage: "Bygger",
      year: "2026",
      sector: "SaaS / CRM",
      status: "Aktiv",
      site: "https://bedrifty.com",
      body: [
        "Bedrifty er et AI-native CRM med bedriftsdata fra Brønnøysundregistrene innebygd. Du kan søke blant over to millioner norske selskaper, se regnskapstallene og la AI gjøre researchen før salgsmøtet.",
        "Jeg bygger det gjennom Codebase som etterfølgeren til Sailsdock. Samme problem, bygget på nytt rundt AI og offentlige norske bedriftsdata.",
      ],
    },
    sailsdock: {
      name: "Sailsdock",
      tagline: "CRM som prioriterte salgsmuligheter for norske team.",
      role: "Grunnlegger",
      stage: "Sunset",
      year: "2021",
      sector: "SaaS / CRM",
      status: "Sunset",
      site: "https://www.sailsdock.no",
      body: [
        "Sailsdock var et CRM bygget for hvordan norske salgsteam faktisk jobber. Det rangerte muligheter etter signal i stedet for magefølelse og automatiserte arbeidet rundt dem.",
        "Jeg grunnla det gjennom Codebase og drev det i noen år før jeg avviklet det. Ideene lever videre i Bedrifty.",
      ],
    },
    "advanti-estate": {
      name: "Advanti Estate",
      tagline: "Næringsmegling i Nord-Norge.",
      role: "Partner",
      stage: "I drift",
      year: "2024",
      sector: "Eiendom",
      status: "Aktiv",
      site: "https://notanother.vc/no/portefolje/advanti-estate",
      body: [
        "Advanti Estate gir råd om kjøp, salg og utleie av næringseiendom i Nord-Norge. Selskapet bygger på lokalkunnskap de nasjonale kjedene ikke har.",
        "Jeg kom inn som partner for å ta med programvare og en skarpere markedsstrategi inn i en bransje som tradisjonelt har vært analog.",
      ],
    },
    miniskatten: {
      name: "Miniskatten",
      tagline: "Brukte barneklær, sortert etter størrelse.",
      role: "Medgründer · styreleder",
      stage: "Bygger",
      year: "2026",
      sector: "E-handel",
      status: "Aktiv",
      site: "https://www.miniskatten.no",
      body: [
        "Miniskatten selger brukte barneklær på nett, sortert etter størrelse fra 50 til 152. Foreldre kan sende inn det barna har vokst ut av, så sjekker, fotograferer, priser og selger vi det.",
        "Jeg er i Miniskatten sammen med samboeren min, Maria. Hun driver den til daglig. Jeg er styreleder og har bygget programvaren.",
      ],
    },
    refenze: {
      name: "Refenze",
      tagline: "Treningsklær. Mitt første selskap.",
      role: "Grunnlegger",
      stage: "Sunset",
      year: "2016",
      sector: "E-handel",
      status: "Sunset",
      site: "#",
      body: [
        "Refenze lagde treningsklær, produsert i Asia og solgt til kunder i Europa og USA. På det meste vokste det rundt 25 % i måneden.",
        "Det var her jeg lærte de harde delene av forretning: kapital, lager og å sende et fysisk produkt til en ekte kunde. Jeg har siden avviklet det.",
      ],
    },
    codenord: {
      name: "Codenord",
      tagline: "Skreddersydd programvare som fjerner flaskehalser i driften.",
      role: "Engleinvestor",
      stage: "Pre-seed",
      year: "2023",
      sector: "Programvare",
      status: "Aktiv",
      site: "https://notanother.vc/no/portefolje/codenord",
      body: [
        "Codenord bygger skreddersydd programvare for selskaper der veksten begrenses av manuelle, repetitive oppgaver. De finner flaskehalsen og fjerner den med kode.",
        "Jeg investerte pre-seed gjennom Not Another VC og hjelper med produkt og markedsstrategi.",
      ],
    },
    propdock: {
      name: "Propdock",
      tagline: "Sanntidsinnsikt i eiendomsporteføljer.",
      role: "Engleinvestor",
      stage: "Pre-seed",
      year: "2022",
      sector: "Proptech",
      status: "Aktiv",
      site: "https://notanother.vc/no/portefolje/propdock",
      body: [
        "Propdock gir eiendomseiere sanntidsinnsikt i porteføljene sine, så de kan bestemme seg raskere og med bedre tall.",
        "En tidlig Not Another VC-investering, nær eiendomsarbeidet jeg gjør ellers.",
      ],
    },
    vendo: {
      name: "Vendo",
      tagline: "Kampanjer utleiere godkjenner og betaler på sekunder.",
      role: "Engleinvestor",
      stage: "Pre-seed",
      year: "2024",
      sector: "Proptech",
      status: "Aktiv",
      site: "https://notanother.vc/no/portefolje/vendo",
      body: [
        "Vendo lar meglere dele markedskampanjer som utleiere godkjenner og betaler på sekunder. Det tar bort dager med fram og tilbake fra hver annonse.",
        "Pre-seed, gjennom Not Another VC.",
      ],
    },
    fotovibe: {
      name: "Fotovibe",
      tagline: "Visuelt innhold som hjelper å selge boliger.",
      role: "Engleinvestor",
      stage: "Pre-seed",
      year: "2024",
      sector: "Media / Proptech",
      status: "Aktiv",
      site: "https://notanother.vc/no/portefolje/fotovibe",
      body: [
        "Fotovibe lager det visuelle innholdet som selger boliger og får megleren til å se bra ut. Det leveres i tempoet en annonse krever.",
        "Pre-seed, gjennom Not Another VC.",
      ],
    },
    somevibe: {
      name: "Somevibe",
      tagline: "Målbar vekst i sosiale medier for selskaper på vei opp.",
      role: "Engleinvestor",
      stage: "Pre-seed",
      year: "2024",
      sector: "Markedsføring",
      status: "Aktiv",
      site: "https://notanother.vc/no/portefolje/somevibe",
      body: [
        "Somevibe hjelper selskaper å vokse i sosiale medier, måler resultatene og justerer underveis. De behandler rekkevidde som et system, ikke flaks.",
        "Pre-seed, gjennom Not Another VC.",
      ],
    },
    docdir: {
      name: "Docdir",
      tagline: "AI for salgsoppgaver i eiendom.",
      role: "Grunnlegger",
      stage: "Oppkjøpt",
      year: "2024",
      sector: "AI / Proptech",
      status: "Kjøpt av Visma",
      site: "https://notanother.vc/no/portefolje/docdir",
      body: [
        "Docdir automatiserte og kvalitetssikret salgsoppgaven som hver norsk eiendomshandel er avhengig av. Vi trente det på norske dokumenter, på norsk.",
        "Broker AS, en del av Visma-konsernet, kjøpte det i 2026. Det er det andre Bodø-selskapet Visma har kjøpt.",
      ],
    },
    utleieoversikten: {
      name: "Utleieoversikten",
      tagline: "Porteføljekalkulator for eiendomsinvestorer.",
      role: "Investor",
      stage: "Exit",
      year: "2021",
      sector: "Proptech",
      status: "Exitet",
      site: "https://notanother.vc/no/portefolje/utleieoversikten",
      body: [
        "Utleieoversikten ga eiendomsinvestorer en porteføljekalkulator som ga dem full kontroll på tallene sine.",
        "Selskapet nådde en exit og ga avkastning på den tidlige investeringen.",
      ],
    },
  },
}

export function isCompanySlug(slug: string): slug is CompanySlug {
  return (companyOrder as readonly string[]).includes(slug)
}

export function nextSlug(slug: CompanySlug): CompanySlug {
  const i = companyOrder.indexOf(slug)
  return companyOrder[(i + 1) % companyOrder.length]
}
