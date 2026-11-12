# Quizkrutt – M2

Separat, byggfri PWA for iPhone, Android og nettleser. Ingen npm-avhengigheter.
Privat testversjon: https://quizkrutt.terjemoe54.chatgpt.site

## Kjør lokalt

Kjør `python3 -m http.server 4174 --directory dist` fra denne mappen og åpne
http://localhost:4174. Service worker krever localhost eller HTTPS.
Publisering bruker hele dist-mappen og .openai/hosting.json.

## Innhold og spill

- Seks kategorier, tre nivåer og 540 spørsmål (30 per kategori/nivå).
- Ti spørsmål per runde, 100 poeng per riktig svar, ingen tidsgrense.
- Minst 700 poeng gir merke og åpner neste nivå i samme kategori.
- Åpne nivåer kan spilles igjen. Beste resultat beholdes ved dårligere forsøk.
- Ikke nylig spilte spørsmål prioriteres. Ingen duplikater innen samme runde.
- Forklaringer etter svar og snarveier til neste nivå/nytt forsøk/kategorier.
- Appmanifest, ikoner, installasjonsveiledning og offlinekopi av alt spillinnhold.

## Fremdrift

Versjonert localStorage (`quizkrutt.progress.v2`) lagrer beste resultat, antall
fullførte runder, sett-historikk og én påbegynt runde. Hvert svar, svarrekkefølge
og neste spørsmål lagres. Etter omstart viser forsiden «Fortsett runden».
En ny runde ber om bekreftelse før en eksisterende runde erstattes. Fullført
runde telles én gang, og merker beregnes fra beste resultat.

Lagringsfeil vises med «Lagre på nytt»; spillet kan fortsette i minnet. Uleselig
lagring og endringer i andre faner overskrives ikke automatisk. Lokal lagring
hører til nettleserprofilen og nettstedsadressen, ikke en konto. Den deles ikke
mellom enheter. Privat modus, sletting av nettsteddata eller lagringsrydding kan
fjerne fremdrift. M1 hadde ingen lagret fremdrift å migrere.

## Kontroller

`node --test tests/game.test.mjs` kjører domenetester, også lagringsfeil og
omstart. Se QUALITY_CHECKLIST.md for faktisk nettlesertest og begrensninger,
CONTENT_REVIEW.md for redaksjonell gjennomgang og kildestikkprøver,
og MILESTONES.md for neste arbeid.

Nedlastbare pakker og duell kommer senere. Valgfrie Google Fonts faller tilbake
til systemfonter uten nett; emoji varierer mellom plattformer.
