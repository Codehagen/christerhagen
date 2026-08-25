# Visuelt språk — "varm vektor" (research → regler)

Vibe, i Christers egne ord: *"early computer graphics, wireframes, glowing lines?
But warmer, more handmade."*

## Hvilken prosess laget dette utseendet

**Tråd 1 — vektorskjermen (1962–1985).** Ikke raster. Elektronstrålen styres
direkte langs hver linje (*random scan* / *calligraphic display*: Asteroids,
Battlezone, Tempest, Vectrex, Star Wars arcade). Konsekvenser som *er* stilen:

- Ingen fyll. Strålen kan bare tegne streker. Alt er kontur.
- Ingen skjulte linjer. Hidden-line removal (Roberts, 1963) var for dyrt, så
  wireframes er gjennomsiktige — du ser baksiden av objektet.
- **Vertex bloom**: strålen dveler i hjørner og endepunkter, så knekkpunkter
  lyser sterkere enn strekene mellom dem.
- **Halation**: lyset sprer seg i glasset → myk, bred glorie rundt streken.
- **Fosfor-etterglød**: P1 grønn, P7 blå→gul, **P3 rav/oransje** — den varme.
- **Endelig oppfrisking**: flere linjer = lavere refresh = dimmere, flimrende
  bilde. Kompleksitet koster lysstyrke.
- Farge var monokrom. Vectrex la et *plastark i farger* teipet over skjermen —
  bokstavelig talt en håndlaget varmehack.

**Tråd 2 — pennplotteren og trykket.** HP 7475A / Calcomp med en ekte
Rotring-penn på papir; risotrykk. Konsekvenser:

- **Blekkpøl ved pennedrag og retningsskift** — mørke klatter i hjørnene.
  Legg merke til rimet: *plotteren blir mørkere nøyaktig der katoderøret blir
  lysere.* Begge markerer knekkpunktet. Det er broen mellom de to trådene.
- **Skravur som fyll** — en penn kan ikke fylle flater, den kryssskraverer.
- **Feilregistrering**: hvert fargelag tegnes i en egen omgang, papiret sklir
  brøkdeler av en mm → lagene ligger aldri helt oppå hverandre. Der to
  gjennomskinnelige blekk krysser, multipliseres de og blir mørkere.
- **Slark og papirdrag**: ingen lang strek er helt rett, ingen sirkel helt rund.
- Få farger — én penn av gangen, 2–4 fra karusellen. Riso: fluor-oransje,
  federal blue, sort. Varme av nødvendighet.
- Referanser: Vera Molnár (*"1 % de désordre"*), Manfred Mohr, Roman Verostko,
  Frieder Nake, Sol LeWitt.

**Hvorfor det ikke blir synthwave.** Standardfellen for "80-talls wireframe" er
sort bakgrunn + cyan/magenta + neon. Varmen kommer av å bytte sort mot papir
eller mot et *varmt* nærsvart, rav mot cyan, og glorie-som-blekksøl mot neon.

## Reglene (hardkodet — dette *er* ideen)

1. **Bare streker.** Aldri fyll. Tetthet lages med skravur og overtegning.
2. **Ingenting skjules.** Wireframes viser baksiden sin. Overlapp er informasjon.
3. **Knekkpunktene er lysest.** Hvert hjørne blomstrer — stråledvele og
   blekkpøl er samme artefakt. Denne ene regelen bærer hele uttrykket.
4. **Maks 3 blekk + underlag.** Varmt rav/rust, ett varmt mørkt, ett kaldt
   motvekt-blekk. Ingen cyan/magenta.
5. **Lagene ligger feil.** Hvert blekklag er forskjøvet 0,5–2 px fra de andre,
   og krysninger multipliseres mørkere.
6. **Ingen strek er rett.** Alle punkter bærer seeded slark (Molnárs 1 % uorden)
   pluss overskyting i retningsskiftene.
7. **Glød er halation, ikke neon.** Bred, svak, varm glorie — lys som sprer seg
   i glass, blekk som trekker inn i papirfiber. Aldri en hard lysende kant.
8. **Rutenett kommer fra perspektiv**, ikke fra CSS: en projisert bakkeflate med
   horisont, eller plotterens eget koordinatpapir.
9. **Typografien blir i dekket.** Grafikken lager ikke lesbar tekst.
10. **Oppfriskingen er endelig.** Flere linjer → dimmere bilde. Tetthet må
    betales med lysstyrke.

## Moduser (navngitte motiver fra tradisjonen)

- **Terreng** — stablet linjeplott / wireframe-fjell (jf. *Unknown Pleasures*)
- **Rutenett** — projisert bakkeplan med horisont (Battlezone / Tron)
- **Legeme** — roterende wireframe uten hidden-line removal: kube, torus,
  ikosaeder, tesserakt (den klassiske 4D-demoen)
- **Lissajous** — oscilloskopets XY-figur
- **Attraktor** — Lorenz-banen, plotterkunstens arbeidshest

## Knapper (alt som er en smaksavgjørelse)

underlag · figur · tetthet · linjevekt · slark · overskyting · knekkglød ·
halation · feilregistrering · overtegning · perspektiv · rotasjon · skravur ·
skravurvinkel · fiber · andreblekk · seed

## Verktøy

`/no/lab/vektor` — klikk lerretet for ny variant, knapper til høyre, "Lagre"
skriver hele configen til `data/deck-visual.json` (i dev) og til utklippstavlen.
Motor: `lib/deck-visual.ts`. Render: `components/deck-visual.tsx`.
