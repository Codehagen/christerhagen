import type { Lang } from "@/lib/companies"

export const faqItems: Record<Lang, { q: string; a: string }[]> = {
  en: [
    {
      q: "Who is Christer Hagen?",
      a: "I am a Norwegian serial entrepreneur and angel investor based in Bodø. I founded Codebase, run pre-seed investing through Not Another VC, and have built and backed companies across software, proptech, and real estate.",
    },
    {
      q: "What did he sell to Visma?",
      a: "I sold Docdir, a tool that automated and quality-checked the sales documents behind Norwegian property transactions. It was acquired by Broker AS, part of the Visma group, in 2026, the second Bodø company Visma has bought.",
    },
    {
      q: "What has he founded?",
      a: "I founded Codebase, my technology studio, along with Sailsdock, a CRM for Norwegian sales teams, and Docdir, later acquired by Visma. My first company was Refenze, a fitness apparel brand I built in my twenties.",
    },
    {
      q: "Where is he based?",
      a: "I live and work in Bodø, about 1,200 kilometres north of Oslo. I build companies from the north of Norway and believe you do not have to move to the capital to do serious work.",
    },
    {
      q: "What does he invest in?",
      a: "I make pre-seed angel investments through Not Another VC, mostly in Norwegian founders building software, SaaS, and proptech. I look for people solving boring, expensive problems for a clear group of customers in their own language.",
    },
  ],
  no: [
    {
      q: "Hvem er Christer Hagen?",
      a: "Jeg er en norsk seriegründer og engleinvestor med base i Bodø. Jeg grunnla Codebase, driver pre-seed-investering gjennom Not Another VC, og har bygget og støttet selskaper innen programvare, proptech og eiendom.",
    },
    {
      q: "Hva solgte han til Visma?",
      a: "Jeg solgte Docdir, et verktøy som automatiserte og kvalitetssikret salgsoppgavene bak norske eiendomshandler. Det ble kjøpt opp av Broker AS, en del av Visma-konsernet, i 2026, det andre Bodø-selskapet Visma har kjøpt.",
    },
    {
      q: "Hva har han grunnlagt?",
      a: "Jeg grunnla Codebase, teknologistudioet mitt, sammen med Sailsdock, en CRM for norske salgsteam, og Docdir, som senere ble kjøpt av Visma. Mitt første selskap var Refenze, et treningsklesmerke jeg bygget i tjueårene.",
    },
    {
      q: "Hvor holder han til?",
      a: "Jeg bor og jobber i Bodø, rundt 1 200 kilometer nord for Oslo. Jeg bygger selskaper fra Nord-Norge og mener du ikke trenger å flytte til hovedstaden for å gjøre seriøst arbeid.",
    },
    {
      q: "Hva investerer han i?",
      a: "Jeg gjør pre-seed-engleinvesteringer gjennom Not Another VC, mest i norske gründere som bygger programvare, SaaS og proptech. Jeg ser etter folk som løser kjedelige, dyre problemer for en tydelig gruppe kunder på deres eget språk.",
    },
  ],
}
