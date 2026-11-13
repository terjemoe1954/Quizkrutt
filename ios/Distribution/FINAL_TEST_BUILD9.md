# Sluttest – Quizkrutt 1.0 (9)

Utført 13. november 2026 ca. 09:09–09:26 Europe/Oslo. Ingen kildekodeendring eller nytt bygg var nødvendig. Kandidaten er klar for eiers godkjenning av App Review-innsending, med testdekningen nedenfor. Ingen innsending eller lansering er utført.

## Faktiske enheter og distribusjon

- Fysisk iPhone 15 Pro, iOS 27.2.1.
- Fysisk iPad (10. generasjon), iPadOS 27.2.1.
- Begge åpnet Quizkrutt fra TestFlight. TestFlight og appens første testdialog viste 1.0 (9). Avsluttende `devicectl --include-default-apps` bekreftet 1.0 / 9 på begge, se `AppStore/FinalTest9/installed-version.json`.
- En innledende direkte installasjon av det utviklersignerte arkivet ble avvist på begge på grunn av ulik application-identifier-prefix mot tidligere lokalt utviklingsbygg. Ingen app ble slettet. TestFlight oppdaterte deretter begge til den faktiske butikkdistribuerte kandidaten; all testen nedenfor gjaldt den kandidaten. Det avviste installasjonsforsøket er ikke behandlet som bestått distribusjonstest.
- Ingen fremdrift ble nullstilt og ingen gamle nettdueller ble slettet. iPad viste også en eksisterende duell i oversikten etter oppdateringen. Vi dokumenterte ikke full før/etter-sammenligning av all gammel lokal fremdrift.

## Gjennomførte kontroller

| Kontroll | Resultat og konkret observasjon |
|---|---|
| Oppstart fra TestFlight | Bestått på begge; riktig 1.0 (9), hjelp og hovedside åpnet. |
| VoiceOver på iPad | Slått på via Device Hub, synlig fokusramme. Valg og dobbelttrykk åpnet Quizpakker, la til Norge-pakken og startet spørsmål. Fokus flyttet til spørsmålet. Riktig svar Stavanger ga 100 poeng, fasit og forklaring. |
| Lyttetest på iPad | Terje svarte uttrykkelig «Ja, alt ble lest forståelig» om knappene, spørsmålet og riktig svar/+100. Agenten hadde ikke tilgang til lyd; bekreftelsen kommer fra Terje. |
| VoiceOver på iPhone | Slått på med synlig fokus. Hjelp → forside → sveip til kategori Litt av alt → Nybegynner → spørsmål. Svaret Stoppeklokke ga 100 poeng, fasit og forklaring. VoiceOver-sveip flyttet fokus og rullet kategorien inn i visningen. |
| Lyttetest på iPhone | Terje svarte uttrykkelig «Ja, alt ble lest forståelig» om kategori, nivå, spørsmål, svaralternativ og riktig svar/+100. |
| Lokal quizpakke på iPad | Medfølgende Norge-pakke kunne legges til og spilles uten konto. Pause beholdt spørsmål 2 av 10 og 100 poeng. Nettet ble ikke koblet fra i denne testen. |
| Appbytte på iPad | Quiz → Innstillinger → Quiz beholdt spørsmål, besvart alternativ, fasit og 100 poeng. |
| iPad-multitasking | Opprinnelig «Apper i helskjerm». Midlertidig valgt «Apper i vinduer». Quizkrutt og Innstillinger ble satt side om side. Spørsmål, fire alternativer, fasit og neste-knapp var lesbare. Neste spørsmål åpnet i smalt vindu, med 100 poeng bevart. Tilbake til fullskjerm beholdt spørsmål 2. |
| Appbytte på iPhone | Quiz → Innstillinger → Quiz beholdt første spørsmål, riktig alternativ, fasit og 100 poeng. Pause/tilbake viste Fortsett runden. |
| Nettduell mellom fysiske enheter | Ada opprettet rom på iPhone, Bo ble med på iPad via åtte tegns romkode. Ingen konto eller ChatGPT-innlogging. Faktisk offentlig produksjonsserver brukt. |
| Hemmelighold av fasit | iPad svarte først på spørsmål 1: «Svaret er lagret» og «Fasiten vises når begge har svart», uten fasit. iPhone viste at vennen hadde svart. Fasit ble vist etter iPhones svar. |
| Full nettduell | Alle fem felles spørsmål ble gjennomført på begge. Begge svarte riktig. Begge resultatskjermer viste Uavgjort, Ada 500/500 og Bo 500/500, «Serveren har bekreftet begge resultatene». |
| Innstillinger etter test | VoiceOver bekreftet av på begge, som før testen. iPads opprinnelige fullskjermmodus gjenopprettet. Ingen endring i tekststørrelse eller utseende i denne runden. |

## Bevis

Bilder ligger i `AppStore/FinalTest9/`: VoiceOver på begge, delt iPad-visning før/etter neste spørsmål, iPhone etter appbytte, nettduellens ventetilstand og begge sluttresultatene. Ingen bilde med uvedkommende varslingsinnhold er tatt med i dokumentasjonen.

## Dekning og begrensninger

Ingen feil ble påvist i de gjennomførte flytene. Full VoiceOver-støtte for samtlige skjermer er fortsatt ikke erklært til Apple: lyttetesten dekket solo, hjelp, kategorier og quizpakke, ikke alle innstillinger og alle nettduell-/sofaduellskjermer med VoiceOver.

Minimum iOS 17 er ikke kjørt på fysisk enhet eller tilgjengelig simulator i denne testen. Eldre OS-versjoner og andre størrelser er fortsatt en testdekningsrisiko. Tidligere motor-/webtester, stor tekst på iPhone/iPad-simulator og liggende iPad-kontroll er dokumentert i VALIDATION.md. Det ble ikke gjennomført en ny full fysisk sofaduell, frakoblet nett-test eller destruktiv nullstilling i denne runden; disse har tidligere motor-/simulatorverifisering.

App Store-kandidaten og metadata er uendret fra den Apple-validerte versjonen. Eierens godkjenning av selve App Review-innsendingen gjenstår; manuell publisering er valgt hos Apple.
