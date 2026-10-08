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
  | (Base & { kind: "tracks"; tracks: Array<[Track, string, string]>; close?: string })
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
  | (Base & { kind: "figure"; figure: "chat" | "agent" | "agentfil" | "ui" | "connectors" | "page" | "brief" | "gate" | "utkast" | "brain" | "brainstack" | "clipping" | "race" | "salgdemo" | "markedutkast" | "prflow"; body: string; close: string })

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
    kind: "figure",
    id: "brain",
    chapter: "Advanti",
    eyebrow: "Company brain",
    title: "Så bygde vi en hjerne.",
    figure: "brain",
    body: "Alt selskapet vet, samlet ett sted. Hver person, hvert selskap og hver eiendom har sin egen side, og sidene lenker til hverandre. Menneskene og agentene skriver til den samme hjernen, og leser fra den samme.",
    close: "Ole trenger plass. Berg har spurt om det samme bygget. Ingen av oss hadde holdt de to i hodet samtidig. Hjernen gjør det.",
  },
  {
    kind: "figure",
    id: "brain-tech",
    chapter: "Advanti",
    eyebrow: "Company brain, teknisk",
    title: "Slik er hjernen bygget.",
    track: "Utviklere",
    figure: "brainstack",
    body: "Sidene er markdown. De ligger i Postgres med pgvector, så agentene kan søke på mening og ikke bare ord. Agentene snakker med hjernen over MCP. Om natta henter nattskiftet inn nye kilder og oppdaterer embeddings for sidene som er endret.",
    close: "Hjernen kan ta feil. CRM-et kan ikke det. Ingenting flyttes fra hjernen til CRM-et før en megler har godkjent det.",
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
      { name: "Nattskiftet", role: "Bakgrunn", mode: "Natt", does: "Synker, beriker og helsesjekker." },
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
    body: "CRM-et, datarommene og agentene i drift, bygget av oss. Og denne presentasjonen, laget på samme måte.",
    links: [
      { label: "app.advantiestate.no", href: "https://app.advantiestate.no", note: "Krever innlogging" },
      { label: "Slik lager jeg presentasjoner", href: "/no/presentasjon/PBL/prototype", note: "Tre versjoner av dette dekket" },
    ],
  },
  {
    kind: "timeline",
    id: "lns",
    chapter: "Tunnel",
    eyebrow: "LNS · en samtale som ble flere",
    title: "Det startet med et spørsmål: hva kan vi gjøre?",
    body: "Ingen bestilling, ingen kravspesifikasjon. Bare en samtale, og så en til.",
    events: [
      ["Runde 1", "En app der arbeiderne snakker inn avvik på norsk, polsk eller engelsk. Live på telefonen etter to timer."],
      ["Runde 2", "Det de egentlig lurte på: hvor blir tiden av inne i tunnelen?"],
      ["Runde 3", "Kan vi sette sensorer på maskinene og se det?"],
    ],
    close: "Jeg kunne ingenting om sensorer eller tunneldrift. Det trengte jeg ikke. De kunne domenet, AI gjorde researchen.",
  },
  {
    kind: "timeline",
    id: "lns2",
    chapter: "Tunnel",
    eyebrow: "Sensorene · 1. oktober",
    title: "Fra spørsmål til noe de kan trykke på.",
    body: "Et Android-nettbrett på hver maskin. Det kjenner vibrasjon og lyd, og vet om maskinen jobber, går på tomgang eller står.",
    events: [
      ["11:25", "Første prompt: hva kan et nettbrett på en maskin faktisk måle?"],
      ["MVP 1", "Tabeller og rå tall. Stygt, men det svarte på spørsmålet."],
      ["13:53", "Driftsoversikten: åtte maskiner på en tidslinje, varsler og neste sprengning."],
      ["20:51", "Live data fra nettbrettene, og rapporter på støy, vibrasjon og ventetid."],
    ],
    close: "Ventetid som skyldes byggherren er nå et tall med tidspunkt. Det er der pengene ligger.",
  },
  {
    kind: "demo",
    id: "demo-lns",
    chapter: "Tunnel",
    eyebrow: "Demo",
    title: "Først stygt. Så riktig.",
    body: "Den første versjonen, og den de fikk to timer senere.",
    links: [
      { label: "MVP 1", href: "https://claude.ai/artifact/PTPV41STSL1UknhdNFogW2", note: "Første utkast" },
      { label: "Driftsoversikt", href: "https://lns.christerhagen.com", note: "To timer senere" },
      { label: "Rapporter avvik", href: "https://lns-drab.vercel.app", note: "Runde 1 · 28. august" },
    ],
  },
  {
    kind: "figure",
    id: "verid-hvorfor",
    chapter: "Verid",
    eyebrow: "Lansert i går",
    title: "Jeg bygger det jeg selv har savnet som megler.",
    figure: "clipping",
    body: "Med Docdir var det salgsoppgaven. Nå er det kundekontrollen. En megler må vite hvem de handler med, og i dag hentes opplysningene fra flere steder og legges i saksmappen for hånd.",
    close: "Jeg har aldri møtt en megler som synes hvitvaskingsarbeid er gøy.",
  },
  {
    kind: "figure",
    id: "verid",
    chapter: "Verid",
    eyebrow: "Verid",
    title: "Fra en time til fem minutter.",
    figure: "race",
    body: "Verid sjekker sanksjons- og PEP-lister, eierskap og offentlige registre, med kilde og tidspunkt på hver opplysning. Megleren vurderer og signerer med navn. Flere meglerforetak bruker det allerede.",
    close: "AI foreslår. Et menneske signerer. Samme regel på kontoret, i tunnelen og her.",
  },
  {
    kind: "statement",
    id: "verid-tech",
    chapter: "Verid",
    eyebrow: "Verid, teknisk",
    title: "90 prosent kode. 10 prosent AI.",
    track: "Utviklere",
    items: [
      ["90 %", "Kode som henter fra Brønnøysund, Kartverket og sanksjons- og PEP-lister. Hver kilde har egne tester, og de kjører uten nett."],
      ["10 %", "AI på to steder: vurdere om et navnetreff er riktig person, og foreslå en risikovurdering. Svaret kommer i et fast skjema, aldri som fri tekst i rapporten."],
      ["Aldri", "Fødselsnummer sendes aldri til en språkmodell."],
      ["807", "commits siden 12. august."],
    ],
    close: "AI der det trengs skjønn. Kode der det må stemme.",
  },
  {
    kind: "video",
    id: "verid-film",
    chapter: "Verid",
    eyebrow: "Filmen",
    title: "Filmen er også laget med AI.",
    body: "Hvert bilde i filmen er en nettside, tegnet ut fra tiden. En nettleser tar bilde av hvert enkelt, og ffmpeg setter dem sammen. Ingen redigering, ingen skjermopptak.",
    src: "/presentasjon/pbl/verid-forklaring.mp4",
    poster: "/presentasjon/pbl/verid-forklaring.jpg",
    credit: "Verid · slik virker det · 30 sekunder",
    href: "https://verid.no",
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
    kind: "figure",
    id: "ta-med-salg",
    chapter: "Fremover",
    eyebrow: "Ta med herfra · 1 av 3",
    title: "Ta med en klikkbar demo til neste kundemøte.",
    track: "Salg",
    figure: "salgdemo",
    body: "Skriv ned hva kunden sa i møtet. La AI bygge en prototype av det samme dag, og ta den med neste gang. Kunden husker det de kunne trykke på.",
    close: "Prøv i dag: ta én kundesamtale fra denne uka og lag en demo av den.",
  },
  {
    kind: "figure",
    id: "ta-med-marked",
    chapter: "Fremover",
    eyebrow: "Ta med herfra · 2 av 3",
    title: "Skriv aldri fra et blankt ark igjen.",
    track: "Marked",
    figure: "markedutkast",
    body: "Start med det dere faktisk har gjort denne uka: en kunde dere hjalp, en ny funksjon, et spørsmål som kom inn. La AI lage utkastene fra det. Dere velger og retter.",
    close: "Prøv i dag: skriv ned fem ting som skjedde denne uka, og be om fem utkast.",
  },
  {
    kind: "figure",
    id: "ta-med-utviklere",
    chapter: "Fremover",
    eyebrow: "Ta med herfra · 3 av 3",
    title: "Gjør feilrapporter om til pull requests.",
    track: "Utviklere",
    figure: "prflow",
    body: "Hos meg blir en rapport med et skjermbilde til en PR, automatisk. En bot leser saken, finner koden og foreslår rettelsen. Jeg leser diffen og trykker merge, eller sier nei.",
    close: "Det er det som har gjort meg raskest. Jeg bruker tida på å lese kode, ikke på å lete etter den.",
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
