# Quizkrutt – appidé og milepæler

Dato: 12. november 2026
Status: M1–M5 implementert som separat PWA. Quizkrutt er en installérbar webapp for iPhone og Android. M6 er en privat lanseringskandidat; fysiske plattformtester gjenstår.

## Navn

Anbefalt arbeidsnavn: **Quizkrutt** – korte runder, farger og et lite pang når du mestrer noe!

Andre forslag: **Hjernefest**, **Quizkompis**, **Kunnskapssprett** og **Quizrakett**.
Navnene er idéforslag; tilgjengelighet i appbutikker, domener og varemerker er ikke kontrollert.

## Ideen

En leken quizapp på norsk der man velger kategori og vanskelighetsgrad,
spiller korte runder og åpner nye utfordringer. Man kan spille alene uten konto.
Målgruppe i første versjon er ungdom og voksne; egne barnepakker kan vurderes senere.

Forsiden har en vennlig maskot, «Fortsett»-knapp, fremdrift og store kategorikort
med illustrerte ikoner og tydelige navn:

| Kategori | Ikonidé | Farge |
| --- | --- | --- |
| Litt av alt | Konfettiboks | Lilla |
| Verden rundt | Jordklode med koffert | Turkis |
| Dyr og natur | Smilende rev og blad | Grønn |
| Film og musikk | Popcorn og hodetelefoner | Rosa |
| Sport og spill | Pokal og spillkontroll | Oransje |
| Vitenskap og teknologi | Rakett og atom | Blå |

Uttrykket skal være morsomt og ryddig: runde kort, små animasjoner og valgfri lyd
og vibrasjon. Farge og lyd skal aldri være eneste signal. Støtt redusert bevegelse,
skjermleser, stor tekst og gode kontraster.

## Spilleregler for første versjon

- En runde har 10 spørsmål med fire svaralternativer og ett riktig svar.
- Etter svaret vises riktig svar og en kort forklaring.
- Hvert riktig svar gir 100 poeng. Ingen trekk for feil.
- Ingen tidspress i vanlig solospill.
- Hver kategori har nivåene Nybegynner, Viderekommen og Ekspert.
- Nybegynner er åpent. Minst 7 av 10 riktige åpner neste nivå i samme kategori.
- Spillede nivåer kan alltid spilles igjen. Bestått runde markeres med merke.
- Spørsmål trekkes fra en større bank med prioritet til spørsmål man ikke nylig har sett.
- Fremdrift og innstillinger lagres lokalt. Sletting av appdata fjerner lokal fremdrift.

## M1 – Uttrykk og spillbar prototype

Leveranse: Forside, kategorivalg, nivåvalg, spørsmålsvisning og resultatside.
Bruk 30 kvalitetssikrede eksempelspørsmål i tre kategorier for å prøve flyten.

Ferdig når:
- Man kan fullføre en runde, se poeng og starte på nytt.
- Tilbakeknapper og svarvalg fungerer uten dobbeltregistrering av svar.
- Forsiden er lett å forstå på en liten mobilskjerm.
- Arbeidsnavn, farger og ikonretning er avklart før hele spørsmålsbanken lages.

## M2 – Første komplette soloversjon

Leveranse: Seks kategorier, tre nivåer, fremdrift, merker og lokal lagring.
Start med minst 30 spørsmål per kategori og nivå: 540 spørsmål totalt.

Ferdig når:
- Nivåopplåsing følger reglene og beholdes etter omstart.
- En runde inneholder ikke samme spørsmål flere ganger.
- Resultatsiden tilbyr «Prøv igjen», «Neste nivå» når åpnet og «Velg kategori».
- Spørsmål er kontrollert for fakta, tydelig språk, entydige svar og rettigheter.
- Solospill fungerer uten nett med de medfølgende spørsmålene.

## M3 – Nye quizpakker etter ønske

Leveranse: «Flere quizer» med pakker sortert etter tema og nivå, eksempelvis
Verdensrommet, Norske steder og Filmklassikere. Vis antall spørsmål,
vanskelighetsgrad, nedlastingsstørrelse og om pakken allerede er lastet ned.

Etter et bestått nivå foreslår appen en relevant pakke på høyere nivå.
Spilleren velger selv om den skal lastes ned. Fullføring låser opp nivået;
nedlasting krever nett. Nedlastede pakker kan spilles uten nett.

Ferdig når:
- Nedlasting, avbrudd, nytt forsøk og sletting av en pakke fungerer.
- Ugyldige eller ufullstendige pakker avvises uten å ødelegge lagret innhold.
- Oppdateringer har versjonsnummer og overskriver ikke fremdrift utilsiktet.
- Manglende nett gir en tydelig forklaring og tilgang til allerede lagrede quizer.

Første løsning er ferdigskrevne, kvalitetssikrede pakker fra en innholdstjeneste.
Automatisk KI-generering på bestilling er en mulig senere utvidelse og krever
egen løsning for faktakontroll, kostnader og innholdsmoderering.

## M4 – To spillere på samme telefon

Leveranse: «Duell på sofaen» uten konto eller server. Spillerne skriver kallenavn
og bytter på telefonen. Begge får samme antall spørsmål fra samme kategori og nivå,
men forskjellige, forhåndsbalanserte spørsmålssett for å unngå at spiller to ser fasiten først.

Ferdig når:
- En tydelig overleveringsskjerm skjuler spørsmål og svar mellom turene.
- Begge får like mange turer, og resultatet viser vinner eller uavgjort.
- Avbrutt duell kan avsluttes uten å påvirke solofremdriften.

Dette er et valgfritt tillegg etter at solospillet er godt.

## M5 – Nettduell med en venn (valgfri)

Leveranse: Opprett duell, del romkode og spill samme runde på hver sin telefon.
Begynn med turbasert spill, så begge slipper å være på nett samtidig.

Krever backend for spilleridentitet, invitasjoner, runder og resultater.
Serveren validerer svar og poeng, og fasit sendes først etter levert svar.
Ingen åpen chat eller offentlig spillerkatalog i første utgave.

Ferdig når:
- To enheter kan opprette, bli med i og fullføre en duell.
- Begge får samme spørsmål og regler, med fasit etter at begge har svart eller runden er avsluttet.
- Gjentatt sending gir ikke doble poeng.
- Ventetid, frakobling, utløpt invitasjon og avbrutt kamp håndteres tydelig.
- Hver spiller får bare tilgang til sine egne dueller og tillatte kampdata.

## M6 – Test og første lansering

Status: 0.6.0-rc.1 implementert og testet lokalt. Se LAUNCH_CHECKLIST.md for
gjenstående godkjenning på fysiske enheter før bredere lansering.

Leveranse: Gjennomarbeidet første versjon med appikon, enkel introduksjon,
innstillinger, innholdskreditering og forklaring av lagring/personvern.

Ferdig når:
- Hele soloflyten er prøvd på de valgte målplattformene.
- Stor tekst, skjermleser, redusert bevegelse og lyd av er kontrollert.
- Offlinebruk, omstart og feil ved pakkenedlasting er prøvd.
- Ingen kjente feil mister fremdrift eller blokkerer en vanlig runde.
- Distribusjonsform og eventuelle butikkrav er avklart.

## Plattform og avgrensning

Valgt plattform: installérbar webapp (PWA) for iPhone og Android. Quizkrutt har
eget prosjekt og egen lokal lagring, separat fra HandyMe.

Anbefalt første omfang: M1 og M2. Deretter M3 og lanseringskontrollene i M6.
M4 kan legges til når solospillet fungerer godt; M5 kan vente til interessen er prøvd.
Annonser, betaling, offentlig toppliste og konto/synkronisering inngår ikke i første versjon.

## Neste konkrete steg

1. Prøv M5 med to fysiske telefoner, inkludert innlogging, nettbrudd og retur til duellen.
2. Samle tilbakemeldinger om ordlyd og vanskelighetsgrad.
3. Fullfør M6-kontroller før bredere lansering.

## M1 – gjennomført 12. november 2026

- Eget prosjekt med tre kategorier og 30 eksempelspørsmål.
- Forside, nivåvalg, spillrunde, forklaringer, poeng og resultatside.
- Appmanifest, appikoner, service worker og installasjonsveiledning.
- Nettleserkontroll: full ti-spørsmålsrunde, kategori-/nivåvalg og avbryt/fortsett.
- Mobilvisning kontrollert i nettleser; fysisk iPhone/Android-installasjon og offlineoppstart gjenstår.

## M2 – implementert og kontrollert 12. november 2026

- Seks kategorier med egne illustrerte SVG-ikoner.
- Nybegynner, Viderekommen og Ekspert med 30 spørsmål hver: 540 totalt.
- Ti tilfeldig valgte spørsmål per runde, med prioritet til ikke nylig spilte spørsmål.
- 7/10 gir merke og åpner neste nivå; beste resultat og antall runder vises.
- Lokal lagring etter hvert svar og steg, inkludert én påbegynt runde.
- Forsiden viser merker og «Fortsett runden»; ny runde erstatter ikke en gammel uten valg.
- Resultatsiden har «Prøv igjen», «Neste nivå» når åpent og «Velg kategori».
- Lagringsfeil vises, og nyere fremdrift i en annen fane overskrives ikke.
- 12 automatiske tester og nettleserflyt gjennom tre nivåer er kontrollert.
- Oppstart og svar fra offlinekopi er prøvd med lokal server stoppet.
- Se QUALITY_CHECKLIST.md for presist testomfang og gjenstående telefonkontroll.

## M3 – implementert og kontrollert 12. november 2026

- «Flere quizer» med tema-/nivåfilter og visning av bare nedlastede.
- Seks pakker med 20 spørsmål hver: 120 ekstra spørsmål ved siden av de 540 medfølgende.
- Navn, tema, nivå, versjon, nedlastingsstørrelse og lagringsstatus vises.
- Nedlasting etter eget valg, avbryt, tidsavbrudd, nytt forsøk og bekreftet sletting.
- Identitet, versjon, innholdsformat, antall, byteantall og SHA-256 kontrolleres før lagring.
- Gamle pakker beholdes ved feil. Oppdateringer får egen versjonshistorikk.
- M2-resultater bevares. Pakker har egne resultater, og alle pakkenivåer kan spilles direkte.
- Bestått runde gir forslag til relevant høyere utfordring uten automatisk nedlasting.
- Sletting beholder resultater og en aktiv rundes spørsmålsøyeblikksbilder.
- Katalogen følger apputgivelser; JSON-innhold hentes fra samme private Site etter valg.
- Ingen KI-generering, kontosynkronisering eller fjernredigeringssystem inngår.
- Se QUALITY_CHECKLIST.md for faktisk verifikasjon og telefonkontroller som gjenstår.

## M4 – implementert og kontrollert 12. november 2026

- «Duell på sofaen» tilgjengelig direkte fra forsiden.
- To ulike kallenavn, seks kategorier, tre nivåer og 5 eller 10 spørsmål hver.
- Tilfeldig startspiller og annenhver tur på samme telefon.
- To adskilte spørsmålssett med samme fordeling mellom faktagrupper på valgt nivå.
- Overleveringsskjerm uten spørsmål/svar mellom hver tur, også ved appbytte.
- Egne poeng underveis, deretter vinner/uavgjort, begge resultater og omkamp.
- Bekreftet avslutning via knapp eller hjemlenke; solofremdrift beholdes.
- Duellen er lokal og lagres ikke ved lukking eller omlasting.
- 34 automatiske tester består, inkludert alle kategori-/nivåvalg og begge lengder.
- Se QUALITY_CHECKLIST.md for nettlesertester og gjenstående fysisk telefontest.

## M5 – nettduell implementert 12. november 2026

- Sites Worker og D1, samme private nettadresse og uendret tilgang.
- Opprett rom, åttetegns romkode og gjesteplass på telefon nummer to.
- Fem identiske spørsmål og svaralternativer, turbasert, med serverstyrt poeng.
- Separat bank med 90 spørsmål der fasit ikke inngår i nettleserressursene.
- Fasit/forklaring først når begge har svart; ingen mulighet til å hoppe over turer.
- Tilfeldige spilleradganger, nøkkelhash på serveren, kontroll per handling.
- Gjenopptakelse, ubekreftet svar, nytt forsøk og vern mot doble poeng.
- Radversjon hindrer samtidige svar i å overskrive hverandre.
- Invitasjonsutløp etter 24 timer, kamp etter sju dager og avbrutt kamp hos begge.
- Ingen chat, offentlig romliste, ekstra varsling eller endring av solofremdrift.
- 45 automatiske tester; to nettleserøkter har fullført samme kamp og prøvd nettbrudd.
- Se QUALITY_CHECKLIST.md for verifikasjonsomfang og gjenstående fysisk telefontest.
