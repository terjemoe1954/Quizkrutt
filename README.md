# Quizkrutt – M4

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

`node --test tests/*.test.mjs` kjører domenetester, også lagringsfeil og
omstart. Se QUALITY_CHECKLIST.md for faktisk nettlesertest og begrensninger,
CONTENT_REVIEW.md for redaksjonell gjennomgang og kildestikkprøver,
og MILESTONES.md for neste arbeid.

Nedlastbare pakker er levert i M3. Duell på samme telefon er levert i M4. Nettduell kommer eventuelt senere. Valgfrie Google Fonts faller tilbake
til systemfonter uten nett; emoji varierer mellom plattformer.

## M3 – nedlastbare quizpakker

«Flere quizer» har seks pakker med 20 spørsmål hver: Norge: en liten byrunde,
Norske naturperler, Filmkveld med favoritter, Bak filmklassikerne, På romferd
og Universets hemmeligheter. Biblioteket kan filtreres på tema, nivå og bare
nedlastede. Visningen er sortert på tema og nivå. Størrelse viser UTF-8-filens
faktiske antall byte i kB. Pakker lastes bare ned etter valg fra spilleren.

Alle pakkenivåer kan velges direkte. Grunnspillets 7/10-regel for opplåsing
beholdes. Pakker har egne resultater og «bestått» ved 7/10; de gir ikke et av
grunnspillets 18 merker. Etter bestått runde foreslås relevante pakker på et
høyere nivå når det finnes, ellers en annen ekspertutfordring.

Pakkene er statiske JSON-filer fra samme private Site. Ingen ny backend eller
innholdsleverandør er nødvendig. For å legge til eller oppdatere innhold:

1. Rediger `content/packs.mjs`. Øk pakkens heltall `version` ved endringer.
2. Kjør `node scripts/build-packs.mjs`. Behold tidligere publiserte versjonsfiler.
3. Kjør `node --test tests/*.test.mjs`.
4. Gi appressursene en ny versjon i importene, index.html og sw.js, og publiser.

Genereringen lager `dist/catalog.js` med metadata, byteantall og SHA-256 samt
JSON-filene i `dist/packs/`. Ingen quizpakkefiler er i service workerens
forhåndslasting. Pakken lagres først når hele filen er mottatt og identitet,
versjon, antall, format og SHA-256 er kontrollert. SHA-256 sammenligner med den
medfølgende katalogen; den er en integritetskontroll, ikke en digital signatur.

Pakker lagres atomisk hver for seg i localStorage (`quizkrutt.pack.<id>`).
Ufullstendig nedlasting eller lagringsfeil lar gammel versjon være urørt.
«Avbryt nedlasting», tidsavbrudd og nytt forsøk støttes. En eldre appkatalog
kan ikke nedgradere en nyere installert pakke. Oppdateringer blir tilgjengelige
når appen oppdateres; biblioteket er ikke et separat fjernredigeringssystem.

M2-fremdriften bevares i samme hovedpost og utvides med `packProgress`.
Pakkeresultater og sett-historikk avgrenses med pakke-ID og versjon. En aktiv
pakkerunde beholder egne spørsmålsøyeblikksbilder, slik at den kan fullføres selv
etter sletting eller oppdatering av pakken. Sletting krever bekreftelse og
fjerner innholdet, men ikke resultater. Nye runder krever ny nedlasting.

## M4 – Duell på sofaen

På forsiden velger to spillere «Spill mot en venn». Bruk ulike kallenavn på
1–20 tegn, velg en av de seks grunnkategoriene, et nivå og 5 eller 10 spørsmål
per spiller. Alle duellnivåer er åpne. Appen trekker startspiller, og spillerne
bytter på telefonen etter hvert spørsmål. Ingen konto, server eller nett trengs
under spill når offlinekopien er klar.

Spørsmålene fordeles i to adskilte sett med samme antall fra hver faktagruppe
på valgt nivå. Begge får eksempelvis 2/2/1 spørsmål fra de tre temagruppene i en
kort duell, eller 4/3/3 i en lang. Ingen spørsmål deles mellom spillerne i samme
kamp. Dette balanserer tema og nivå, men er ikke empirisk kalibrert lik vanskelighet.
Dueller bruker grunnspillets spørsmål; nedlastbare pakker inngår ikke i M4.

Hver tur starter på en skjerm uten spørsmål eller fasit. Spilleren velger
«Jeg er … – vis min tur». Etter svaret vises forklaring og «Skjul og gi videre».
Ved appbytte skjules også en åpen tur bak overleveringsskjermen. Hver spiller
ser egne poeng underveis; begge resultatene vises når alle turene er fullført.
Riktig svar gir 100 poeng uten tidsbonus. Høyeste sum vinner; lik sum gir uavgjort.
Omkamp beholder navn og valg og trekker nye sett, uten garanti om at spørsmål
fra forrige kamp ikke gjentas.

Duellen holdes kun i minnet. Lukking eller omlasting avslutter den. Kallenavn
og kampresultater lagres ikke eller sendes til en server. «Avslutt duellen» og
hjemlenken krever bekreftelse under kamp. Verken fullført eller avbrutt duell
endrer soloresultater, merker, sett-historikk, pakkehistorikk eller påbegynt solorunde.
