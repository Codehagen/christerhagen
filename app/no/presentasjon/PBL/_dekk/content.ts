// innholdet i PBL-dekket, én gang. Tre layouter tegner det samme.

export type Track = "Utviklere" | "Salg" | "Marked"

export type Chapter = "Intro" | "AI" | "Docdir" | "Advanti" | "Tunnel" | "Verid" | "Fremover"

type Base = { id: string; chapter: Chapter; eyebrow: string; title: string; track?: Track }

export type Slide =
  | (Base & { kind: "cover"; lead: string })
  | (Base & { kind: "statement"; body?: string; items?: Array<[string, string]>; close?: string })
  | (Base & { kind: "steps"; steps: Array<{ n: string; title: string; text: string }>; close?: string })
  | (Base & {
      kind: "agents"
      agents: Array<{ name: string; role: string; mode: string; does: string; track?: Track }>
      close?: string
    })
  | (Base & { kind: "timeline"; body?: string; events: Array<[string, string]>; close?: string })
  | (Base & { kind: "stats"; body?: string; stats: Array<[string, string]>; close?: string })
  | (Base & { kind: "code"; body: string; code: string; close: string })
  | (Base & { kind: "demo"; body: string; links: Array<{ label: string; href: string; note: string }> })
  | (Base & { kind: "tracks"; tracks: Array<[Track, string]>; close?: string })
  | (Base & { kind: "end"; lead: string })
  | (Base & { kind: "principles"; body: string; questions: Array<[string, string]>; close: string })
  | (Base & { kind: "github"; caption: string; who: Array<[Track, string, string]>; companies: Array<[string, string]> })
  | (Base & {
      kind: "feed"
      body: string
      close: string
      handle: string
      posts: Array<{ kicker: string; title: string; source: string; status: "Ute" | "Utkast" }>
    })
  | (Base & { kind: "video"; src: string; poster: string; credit: string; href: string; body: string })
  | (Base & { kind: "braindump"; body: string; note: string; result: Array<[string, string]>; close: string })
  | (Base & { kind: "figure"; figure: "chat" | "agent" | "agentfil" | "ui" | "connectors" | "page" | "brief" | "gate" | "utkast"; body: string; close: string })

export const slides: Slide[] = [
  {
    kind: "cover",
    id: "intro",
    chapter: "Intro",
    eyebrow: "Drømmedag · PBL Mentor",
    title: "Slik bygger du et AI‑native selskap.",
    lead: "Jeg skal vise dere hvordan vi gjorde det — fra en kundesamtale som ble en app samme formiddag, til et selskap vi lanserte i går.",
  },
  {
    kind: "github",
    id: "github",
    chapter: "Intro",
    eyebrow: "Kort om meg",
    title: "Hvem jeg er, kommer an på hvem du spør.",
    caption: "9 306 bidrag siste år. 362 av 369 dager. 299 dager på rad. Beste dag: 20. mars, 245 bidrag. Ikke spør hva som skjedde.",
    who: [
      ["Salg", "Megler i ni år.", "Den eneste i rommet som kan selge dere et næringsbygg i pausen."],
      ["Marked", "Bygger ting jeg selv har savnet.", "Så markedsplanen er å finne flere som ligner på meg."],
      ["Utviklere", "Tre exits på ting jeg har kodet.", "Den siste var Docdir, til Visma. Ingen av dem ble solgt fordi koden var pen."],
    ],
    companies: [
      ["Bygger", "Verid · Advanti Estate · Bedrifty · Codebase"],
      ["Solgt", "Docdir (Visma) · Utleieoversikten · Sailsdock"],
      ["Investert i", "Propdock · Fotovibe · Somevibe"],
      ["Lagt ned", "Refenze · Vendo · Codenord"],
    ],
  },
  {
    kind: "statement",
    id: "business",
    chapter: "Intro",
    eyebrow: "Før vi begynner",
    title: "Koden har blitt billig.",
    body: "Det som er dyrt nå, er å vite hva som skal bygges, for hvem, og hvorfor de vil betale for det. Det står ikke i noen modell.",
    items: [
      ["Før", "Den som kunne kode, bestemte hva som var mulig."],
      ["Nå", "Den som kjenner problemet, bestemmer hva som blir bygget."],
    ],
    close: "Dere kjenner barnehagene. Det er fortrinnet.",
  },
  {
    kind: "steps",
    id: "tresteg",
    chapter: "AI",
    eyebrow: "Slik ser jeg AI",
    title: "Tre steg.",
    steps: [
      { n: "01", title: "Du snakker med den.", text: "Du skriver til ChatGPT og limer svaret inn selv. Den vet ingenting om bedriften din." },
      { n: "02", title: "Den gjør jobben.", text: "En agent er en side med tekst og en nøkkel. Den skriver e-posten, finner vedlegget, og sender." },
      { n: "03", title: "Skjermen lages rundt deg.", text: "To ansatte åpner samme system og ser hver sin skjerm, bygget der og da." },
    ],
    close: "De fleste står på steg én. Vi jobber på steg to.",
  },
  {
    kind: "figure",
    id: "steg1",
    chapter: "AI",
    eyebrow: "Steg 01",
    title: "Du snakker med den.",
    figure: "chat",
    body: "Du skriver til ChatGPT og får et svar tilbake. Nesten alle er her nå, og det er en enorm forbedring fra ingenting.",
    close: "Men den vet ingenting om bedriften din, og husker ingenting til neste gang.",
  },
  {
    kind: "figure",
    id: "steg2",
    chapter: "AI",
    eyebrow: "Steg 02",
    title: "Den gjør jobben for deg.",
    figure: "agent",
    body: "I dag skriver du e-posten i ChatGPT og limer den inn selv. Steg to er at den skriver den, finner vedlegget og sender den.",
    close: "Du slutter å spørre og begynner å delegere.",
  },
  {
    kind: "figure",
    id: "agentfil",
    chapter: "AI",
    eyebrow: "Steg 02, tett på",
    title: "En side med tekst. Og en nøkkel.",
    figure: "agentfil",
    body: "Siden er vanlig norsk, ikke kode. Du har skrevet sånne før — de heter stillingsbeskrivelser. Nøkkelen er forskjellen fra chatten: den kan skrive e-posten, agenten kan sende den.",
    close: "Vi har tretten. Ingen av dem er programmert. De er skrevet.",
  },
  {
    kind: "figure",
    id: "steg3",
    chapter: "AI",
    eyebrow: "Steg 03",
    title: "Skjermen lages rundt deg.",
    figure: "ui",
    body: "To ansatte åpner det samme systemet: den ene ser regnskapstall, den andre noe helt annet. Begge skjermbildene bygges der og da.",
    close: "Da er det bare dataene dine som skiller dere fra alle andre.",
  },
  {
    kind: "video",
    id: "genui-video",
    chapter: "AI",
    eyebrow: "Steg 03, i praksis",
    title: "Han snakker skjermen fram.",
    body: "Ingen tegner, ingen koder. Han sier hva han vil ha, og grensesnittet bygges mens han snakker.",
    src: "https://video.twimg.com/amplify_video/2102076539386937344/vid/avc1/1732x1080/xbHJQrUkah0n2BG0.mp4",
    poster: "https://pbs.twimg.com/amplify_video_thumb/2102076539386937344/img/r7ia_XA8QLmSOMmt.jpg",
    credit: "Jonathan Moore (@Moore) · «Designing at the speed of voice» · 21. september 2026",
    href: "https://x.com/Moore/status/2102078191758102998",
  },
  {
    kind: "statement",
    id: "docdir",
    chapter: "Docdir",
    eyebrow: "Første gang",
    title: "Docdir. Solgt til Visma.",
    body: "Som megler brukte jeg uker på salgsoppgaver — tekst om noe som allerede sto i papirene. Så vi lot AI skrive den.",
    close: "Det var ikke koden som var verdt noe. Det var at noen som gjorde jobben, bygde verktøyet.",
  },
  {
    kind: "stats",
    id: "advanti-intro",
    chapter: "Advanti",
    eyebrow: "Advanti Estate",
    title: "Et meglerkontor, bygget fra bunnen med AI.",
    body: "Næringsmegling i Nord-Norge. Vi startet på nytt, og spurte hvordan kontoret ville sett ut hvis vi bygde det i dag.",
    stats: [
      ["3", "som startet"],
      ["6 mnd", "siden starten"],
      ["1,8 mrd", "i eiendommer i pipeline"],
    ],
  },
  {
    kind: "principles",
    id: "advanti",
    chapter: "Advanti",
    eyebrow: "Det første vi gjorde",
    title: "Vi tegnet opp et salg, og spurte hvorfor.",
    body: "Før vi skrev en linje kode, gikk vi gjennom hvordan et næringssalg faktisk går. Så brøt vi det ned til det som må være sant, og bygde opp igjen derfra. Det er first principles.",
    questions: [
      ["Målet", "Hva er jobben egentlig til for? Finne kjøper fort, og få svar til dem enda fortere."],
      ["Behovet", "Hva trenger kjøperen for å si ja? Tallene: leiekontrakter, tilstand, regnskap."],
      ["Vanen", "Hvorfor kommer det sist? Fordi det alltid har gjort det. Ingen har bestemt det."],
    ],
    close: "Spør hvorfor til svaret er «sånn har vi alltid gjort det». Der ligger jobben.",
  },
  {
    kind: "code",
    id: "brain",
    chapter: "Advanti",
    eyebrow: "Company brain",
    title: "Så bygde vi en hjerne.",
    body: "Alt selskapet vet, samlet ett sted. Hver person, hvert selskap, hver eiendom og hver handel har sin egen side. Menneskene og agentene skriver til den samme hjernen, og leser fra den samme.",
    code: `hjernen/
  personer/
    ole-nordvik.md
    berg.md
  selskaper/
    nordvik-bygg.md
  eiendommer/
    sjogata-12.md
    havneveien-4.md
  handler/
    2026-08-sjogata-12.md
  møter/
    2026-08-24-ole-nordvik.md`,
    close: "Uten den er en agent bare en chat som ikke kjenner deg. Alt resten av foredraget bygger på denne mappa.",
  },
  {
    kind: "braindump",
    id: "braindump",
    chapter: "Advanti",
    eyebrow: "Arbeidsløkka · 1 · du skriver",
    title: "Fem setninger etter en telefon.",
    body: "Ingen mal, ingen felter. Du skriver som du ville skrevet til en kollega.",
    note: "ringte ole hos nordvik bygg nå. de vokser ut av lokalet og trenger 600 kvm i bodø før sommeren. skal ta det opp i styret neste uke. lovte å ringe tilbake fredag. han nevnte at broren driver noe lignende i mo.",
    result: [
      ["Personen", "Ole er lagt inn, med det han sa."],
      ["Selskapet", "Nordvik Bygg hentet fra Brønnøysund. Org.nr, styre, roller."],
      ["Fredag", "Påminnelse. Du lovte å ringe."],
      ["Broren", "Eget spor i Mo. Det hadde jeg aldri skrevet ned selv."],
    ],
    close: "Vi skriver alle til den samme, og vi leser alle fra den.",
  },
  {
    kind: "figure",
    id: "connectorer",
    chapter: "Advanti",
    eyebrow: "Arbeidsløkka · 2 · den henter",
    title: "Det meste skriver vi ikke inn i det hele tatt.",
    figure: "connectors",
    body: "En connector er en kobling til et sted vi allerede jobber — møtene, innboksen, kalenderen. Den henter det som skjer der, og legger det i hjernen uten at noen gjør noe.",
    close: "Et kvarter å koble på hver av dem. Så går de av seg selv.",
  },
  {
    kind: "figure",
    id: "lagrer",
    chapter: "Advanti",
    eyebrow: "Arbeidsløkka · 3 · den lagrer",
    title: "Alt havner ett sted, og bare ett.",
    figure: "page",
    body: "Handler det om en person, ligger det under personen. Handler det om et selskap, under selskapet. Og sidene er vanlige tekstfiler — du kan åpne dem selv.",
    close: "Over streken: det som gjelder nå. Under streken: det som skjedde, og det endres aldri.",
  },
  {
    kind: "figure",
    id: "tilbake",
    chapter: "Advanti",
    eyebrow: "Arbeidsløkka · 4 · du får det igjen",
    title: "Og så får du alt sammen tilbake.",
    figure: "brief",
    body: "Hver morgen ligger det en oppsummering klar. Ikke alt — bare det som har endret seg, det du har lovet, og det du aldri hadde sett selv.",
    close: "Ingen skriver ned ting bare for arkivets skyld.",
  },
  {
    kind: "agents",
    id: "agentene",
    chapter: "Advanti",
    eyebrow: "Organisasjonen",
    title: "Hva hver agent gjør.",
    agents: [
      { name: "Viktor", role: "Stabssjef", mode: "Alltid på", does: "Tar imot alt vi skriver, og finner ut hvem som skal gjøre det." },
      { name: "Kent", role: "Analyse", mode: "Ved behov", does: "Due diligence, verdivurderinger, salgsoppgaver." },
      { name: "Advanti CTO", role: "Kode", mode: "Ved behov", does: "Bygger det som mangler i hvordan vi jobber.", track: "Utviklere" },
      { name: "Advanti CMO", role: "Marked", mode: "Hver uke", does: "Innlegg og nyhetsbrev. Finner aldri på et tall.", track: "Marked" },
      { name: "Advanti Dok", role: "Dokumenter", mode: "Ved behov", does: "Oppdragsavtaler og leiekontrakter." },
      { name: "Advanti Salg", role: "Salg", mode: "Hver morgen", does: "Matcher kjøpere mot alt vi har til salgs.", track: "Salg" },
      { name: "Wintermute", role: "Bakgrunn", mode: "Natt", does: "Synker, beriker og helsesjekker." },
    ],
    close: "Tretten agenter. Ingen av dem er programmert. De er skrevet.",
  },
  {
    kind: "timeline",
    id: "sammen",
    chapter: "Advanti",
    eyebrow: "Agentene jobber sammen",
    title: "Én eiendom inn. En ringeliste ut.",
    track: "Salg",
    events: [
      ["Megleren", "Legger inn ett bygg."],
      ["Matcheren", "Finner leietakere og kjøpere, sjekket mot Brønnøysund. Ring i dag, send denne uken, følg med."],
      ["Megleren", "Svarer «ta 1, 2 og 5»."],
      ["Utkastene", "Skrives i meglerens egen stemme, én per kunde."],
      ["Svaret", "Når kunden svarer, foreslår neste agent hva vi sier tilbake."],
    ],
    close: "Første dagen: 13 aktuelle for et bygg på Stokmarknes. Agenten skriver. Mennesket trykker send.",
  },
  {
    kind: "feed",
    id: "marked",
    chapter: "Advanti",
    eyebrow: "Innholdslista",
    title: "Vi skriver aldri fra et blankt ark.",
    track: "Marked",
    body: "Hver uke setter agenten opp en liste med innlegg. Alle bygger på noe vi faktisk har gjort: et bygg vi har lagt ut, en rapport vi har skrevet, et spørsmål en kunde stilte. Ingenting er funnet på.",
    close: "Markedsføreren velger hva som går ut, og leser alt før det publiseres.",
    handle: "advantiestate",
    posts: [
      { kicker: "Til salgs", title: "Bodø Byport. 18 700 m² vis-à-vis City Nord.", source: "Fra oppdraget", status: "Ute" },
      { kicker: "Til salgs", title: "Kransvikveien 19, ved nye Hammerfest sykehus.", source: "Fra oppdraget", status: "Ute" },
      { kicker: "Marked", title: "Mo i Rana 2026. Hva leietakerne betaler nå.", source: "Fra markedsrapporten", status: "Ute" },
      { kicker: "Marked", title: "Sydvaranger og Kirkenes. Hvorfor det skjer noe i øst.", source: "Fra markedsrapporten", status: "Utkast" },
      { kicker: "Spørsmål", title: "Hva koster en verdivurdering?", source: "Fra en kundesamtale", status: "Utkast" },
      { kicker: "Rente", title: "Renta falt 0,25. Dette betyr det for yield.", source: "Fra morgenbriefen", status: "Utkast" },
    ],
  },
  {
    kind: "code",
    id: "skill",
    chapter: "Advanti",
    eyebrow: "Under panseret",
    title: "En skill er en mappe.",
    track: "Utviklere",
    body: "En markdown-fil som sier hva jobben er, eksempler den kan lære av, og små skript den har lov til å kjøre. Det faste ligger først i prompten og caches — fra femten kroner i uka per agent til én.",
    code: `advanti-property-match/
  SKILL.md
  references/outreach-examples.md
  scripts/bronnoysund.sh

---
name: advanti-property-match
description: Finn leietakere og kjøpere.
  Triggere: «hvem trenger dette lokalet»
---
0. Les brokers.json. Bruk meglerens
   voice_profile. Mangler et felt:
   IKKE gjett.`,
    close: "Den viktigste linja er den siste.",
  },
  {
    kind: "stats",
    id: "bygget",
    chapter: "Advanti",
    eyebrow: "Slik ble det bygget",
    title: "Første versjon feilet.",
    body: "Ti agenter på én dag i april. Fem dager senere så vi at matcheren leste en tom fil. Lærdommen: lukkede løkker — det én agent lager, må en annen kunne lese.",
    stats: [
      ["4 mnd", "fra første commit til CRM-et vi bruker hver dag"],
      ["1 468", "commits"],
      ["432", "av dem skrevet av en AI-agent"],
    ],
    close: "Ikke bygg agenten før ritualet er bevist.",
  },
  {
    kind: "figure",
    id: "reglene",
    chapter: "Advanti",
    eyebrow: "Reglene",
    title: "Hjernen foreslår. Mennesket bestemmer.",
    figure: "gate",
    body: "Ole sa 600 kvm. Det er en påstand, ikke et faktum, og påstander går rett inn i hjernen. Men står tallet i CRM-et, ringer noen en gårdeier på grunnlag av det. Derfor står disken imellom.",
    close: "Agenten skriver utkast. Jeg trykker send. Kunderelasjonen delegerer vi ikke.",
  },
  {
    kind: "figure",
    id: "utkast",
    chapter: "Advanti",
    eyebrow: "Reglene, én gang",
    title: "Hver setning har en fotnote.",
    figure: "utkast",
    body: "Ole sier én setning på telefonen. Agenten slår opp tre sider i hjernen, og skriver utkastet av det som allerede sto der. Finner den ikke dekning, skriver den ikke setningen.",
    close: "Og så stopper den. E-posten ligger der til jeg har lest den.",
  },
  {
    kind: "statement",
    id: "disiplin",
    chapter: "Advanti",
    eyebrow: "Disiplinen",
    title: "Alt du gjør to ganger, skriver du ned.",
    body: "Første gangen er treg. Du forklarer, den bommer, du retter. Men i det den endelig sitter, skriver du ned hvordan — og da er den jobben gjort for alltid.",
    close: "Sånn blir det tretten agenter: ikke ett stort prosjekt, men mange små ganger noen orket å skrive ned det de nettopp fant ut.",
  },
  {
    kind: "demo",
    id: "demo-advanti",
    chapter: "Advanti",
    eyebrow: "Demo",
    title: "Det de ansatte faktisk bruker.",
    body: "CRM-et, datarommene og agentene i drift — bygget av oss.",
    links: [{ label: "app.advantiestate.no", href: "https://app.advantiestate.no", note: "Krever innlogging" }],
  },
  {
    kind: "timeline",
    id: "lns",
    chapter: "Tunnel",
    eyebrow: "Kundesamtale · 28. august",
    title: "Fra samtale til app på under to timer.",
    body: "En tunnelentreprenør ville ha enklere avviksrapportering. Arbeiderne snakker norsk, polsk og engelsk.",
    events: [
      ["09:49", "Første linje kode."],
      ["11:42", "Live på telefonen. Du snakker, AI skriver rapporten på norsk."],
      ["12:23", "«Prøv et eksempel» — så kunden kan teste uten å ta opp noe."],
    ],
    close: "Én regel i prompten: aldri finn på informasjon. Mangler noe, spør appen.",
  },
  {
    kind: "timeline",
    id: "lns2",
    chapter: "Tunnel",
    eyebrow: "Neste samtale · 1. oktober",
    title: "Det de egentlig trengte, var noe annet.",
    body: "«Jeg kan ingenting om sensorer eller tunneldrift.» Det var det første jeg skrev.",
    events: [
      ["11:25", "Første prompt."],
      ["13:53", "Demo ute: åtte maskiner på en tidslinje, varsler, neste sprengning."],
      ["20:51", "Live data fra nettbrettene. Rapporter på støy, vibrasjon og ventetid."],
    ],
    close: "Domenet kom fra kunden. Researchen og byggingen gjorde AI.",
  },
  {
    kind: "demo",
    id: "demo-lns",
    chapter: "Tunnel",
    eyebrow: "Demo",
    title: "Begge appene, slik kunden så dem.",
    body: "Ta gjerne opp telefonen og prøv selv.",
    links: [
      { label: "Rapporter avvik", href: "https://lns-drab.vercel.app", note: "28. august" },
      { label: "Driftsoversikt", href: "https://lns.christerhagen.com", note: "1. oktober" },
    ],
  },
  {
    kind: "stats",
    id: "verid",
    chapter: "Verid",
    eyebrow: "Lansert i går",
    title: "Verid.",
    body: "Meglere må vite hvem de handler med. Verid sjekker sanksjons- og PEP-lister, eierskap og offentlige registre, med kilde og tidspunkt på hver opplysning. Megleren vurderer og signerer med navn.",
    stats: [
      ["1 time", "før, per sak"],
      ["5 min", "med Verid"],
    ],
    close: "AI foreslår. Et menneske signerer. Samme regel på kontoret, i tunnelen og her.",
  },
  {
    kind: "statement",
    id: "tror",
    chapter: "Fremover",
    eyebrow: "Hva jeg tror",
    title: "Fra å spørre til å delegere.",
    items: [
      ["01", "Hver ansatt får et lite team av agenter."],
      ["02", "Fra kundemøte til klikkbar demo samme dag."],
      ["03", "Alle leier den samme modellen. Det dere vet om barnehagene, er det eneste dere eier."],
    ],
    close: "Det som blir knapt, er dømmekraft, domenekunnskap og smak.",
  },
  {
    kind: "tracks",
    id: "dagen",
    chapter: "Fremover",
    eyebrow: "Resten av dagen",
    title: "Tre ting å prøve før dere går hjem.",
    tracks: [
      ["Utviklere", "Skriv én skill: en jobb dere gjør hver uke, som en mappe med en markdown-fil."],
      ["Salg", "Ta én kundesamtale fra denne uka og lag en klikkbar demo av den."],
      ["Marked", "Skriv svartelista, og la AI skrive neste nyhetsbrev."],
    ],
  },
  {
    kind: "end",
    id: "slutt",
    chapter: "Fremover",
    eyebrow: "Takk",
    title: "Spørsmål?",
    lead: "christer@verid.no · 984 53 571",
  },
]
