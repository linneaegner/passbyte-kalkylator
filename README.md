# Passbyte

**Är passbytet värt det?** En kalkylator som hjälper dig jämföra lön när du byter pass med en kollega — baserad på Handels avtal för butik, lager och e-handel.

> Verktyget är **inte** officiellt kopplat till Handels. Kontrollera alltid din lönespecifikation och lokala avtal. Vi reserverar oss för eventuella fel.

## Varför?

När någon frågar *"kan du ta mitt söndagspass mot mitt torsdagspass?"* är svaret sällan uppenbart. Ett pass kan vara kortare men sakna OB, ett annat kan vara längre men ge mer i kvälls- och helgtillägg. Passbyte räknar ut skillnaden i brutto och netto så att du kan fatta ett informerat beslut — innan du säger ja eller nej.

## Funktioner

- **Jämför två pass** — det du lämnar och det du tar — med tydlig nettoskillnad
- **OB enligt avtalet** — kväll, natt, lördag, söndag, helgdagar och aftnar (påsk-, midsommar-, julafton, nyårsafton)
- **Stöd för butik, lager och e-handel** med avtalets respektive OB-regler
- **Pass över midnatt** och rast med starttid räknas korrekt
- **Minimilöner** från avtalet (april 2026) eller egen timlön
- **Skattesats** du anger själv — se både brutto och netto
- **Svenska och engelska** i gränssnittet
- **Mobilanpassat** med fast sammanfattning längst ner på skärmen

## Så funkar det

1. Välj var du jobbar (butik, lager eller e-handel) och din timlön.
2. Fyll i passet du **lämnar** — datum, tider och rast.
3. Fyll i passet du **tar**.
4. Se direkt om bytet ger dig mer eller mindre i plånboken, plus en uppdelning av grundlön och OB.

Beräkningen bygger på Handels avtal butik, lager och e-handel (gäller från 1 april 2025, med lönehöjning 1 april 2026). Helgdagsdata finns för **2026**.

## Kom igång (utveckling)

### Krav

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (rekommenderas)

### Installation

```bash
git clone https://github.com/<ditt-användarnamn>/handels-calculator.git
cd handels-calculator
pnpm install
pnpm dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

### Övriga kommandon

```bash
pnpm build   # Produktionsbygge
pnpm start   # Kör produktionsbygge lokalt
pnpm test    # Kör tester (Vitest)
pnpm lint    # ESLint
```

## Teknik

| | |
|---|---|
| **Ramverk** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Språk** | TypeScript |
| **UI** | React 19, [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Tester** | [Vitest](https://vitest.dev/) |

Beräkningslogiken ligger i `lib/handels/` — ren TypeScript utan beroenden av UI, med tester för OB över midnatt, helgdagar och raster.

## Projektstruktur

```
app/                  # Next.js-sidor
components/           # UI-komponenter
lib/handels/          # Löne- och OB-beräkningar
  ob/                 # OB-segment per arbetsområde
  holidays/           # Helgdagar och aftnar
hooks/                # Inställningar (localStorage)
```

## Bidra

Pull requests och issue-rapporter är välkomna — särskilt om du hittar avvikelser mot avtalet eller saknade helgdagsår.

## Licens

Ingen licens angiven ännu. Kontakta repo-ägaren om du vill återanvända koden.

---

*Byggt som ett sidoprojekt för att göra passbyten lite enklare att bedöma. Dela gärna om du tror någon i branschen kan ha nytta av det.*
