# Quizkrutt M2 – kontroll 12. november 2026

## Bestått

- 12 automatiske tester (`node --test tests/game.test.mjs`).
- 540 unike spørsmål og ID-er; 30 per kategori/nivå; fire ulike svar og gyldig fasit.
- 6/10 åpner ikke nivå; 7/10 åpner neste nivå i riktig kategori.
- Alle 18 nivåer kan åpnes, bestås og spilles igjen; beste resultat går ikke ned.
- Dobbelt svar og gjentatt fullføring gir ikke doble poeng eller runder.
- Tre komplette runder bruker alle 30 spørsmål før gjentakelse.
- Serialisering og gjeninnlasting bevarer poeng, svarrekkefølge, besvarte spørsmål,
  nivåer og fremdrift. Feil ved lesing, full lagring og konkurrerende faner er testet.
- Lokal nettleser: to komplette 10/10-runder fra Nybegynner via Viderekommen til Ekspert.
- Lokal nettleser: omlasting etter svar og etter fullført runde beholder poeng/merker.
- Lokal nettleser: «Fortsett runden» gjenåpner samme spørsmål, svar og fasit.
- Lokal nettleser: forsøk på å starte annen kategori gir valg om å gjenoppta/erstatte;
  gjenopptakelse bevarer den opprinnelige kategoriens påbegynte runde.
- Responsiv kontroll ved 320, 390 og 1200 px. Ingen vannrett overløp på forsiden
  ved 320/1200 px eller ekspertrunden ved 320 px. Visuell kontroll ved 390/1200 px.
- Offlinekontroll: lokal HTTP-server stoppet etter ferdig offlinekopi. Siden startet
  fra service worker, beholdt to merker, gjenopptok ekspertrunden og registrerte svar.
- Hjelp forklarer nivåregler, lokal lagring, delt nettleserprofil og installasjon.

## Gjenstår / begrensninger

- Fysisk iPhone-/Android-installasjon og flymodus etter full omstart av enheten.
- Private Sites sin innlogging og offlineoppførsel etter langvarig frakobling på telefon.
- Full skjermleser- og 200 % teksttest; mobilbredde alene dekker ikke disse.
- Uavhengig redaksjonell gjennomgang og kalibrering av vanskelighetsgrader.
  Kildestikkprøver og innholdsavgrensninger finnes i CONTENT_REVIEW.md.
- Fremdrift er lokal og kan forsvinne ved sletting av nettsteddata eller lagringsrydding.
  Ingen kontobasert synkronisering eller sikkerhetskopi ennå.
- Offlinepakker er medfølgende innhold; ekstra nedlastbare pakker hører til M3.

Lokale testmerker er kun i testnettleseren på localhost og følger ikke publiseringen.

## M3 – kontroll 12. november 2026

- 26 automatiske tester består (de 12 M2-testene og 14 pakketester).
- Seks pakker / 120 nye spørsmål, med byteantall og SHA-256 som samsvarer med filene.
- Faktisk nedlasting starter bare etter valg; ufullstendige/feil pakker avvises.
- Avbrudd, nettfeil, HTTP-feil, omdirigering til innlogging og lagringskvotefeil
  beholder tidligere lagret innhold.
- Oppdatering til versjon 2 beholder resultater og en aktiv runde fra versjon 1.
  En gammel katalog kan ikke nedgradere en nyere installert pakke.
- Sletting beholder resultater og en gjenopptakbar spørsmålsrunde.
- Konkurrerende faner overskriver ikke en pakke endret under nedlasting.
- M2-lagringen leses med uendret nøkkel; tidligere to testmerker besto i nettleseren.
- Nettleser: lastet ned Norge-pakken, fullførte 10/10, så forslag til høyere nivå.
- Nettleser: fjernet og lastet ned pakken igjen; 10/10-resultatet ble beholdt.
- Nettleser: avbrøt en faktisk, langsom overføring av Universets hemmeligheter;
  pakken forble ikke nedlastet. Nytt forsøk fullførte og viste klar for offlinebruk.
- Nettleser: tema- og nivåfilter viser forventede pakker.
- Biblioteket prøvd ved 320 og 390 px; ingen vannrett overløp ved 320 px.
- Lokal server stoppet etter klargjort M3-offlinekopi. Appen startet fra cache,
  åpnet lagret pakke, registrerte riktig svar og beholdt 100 poeng etter omlasting.
- Lokale testmerker og pakkenedlastinger følger ikke publiseringen.

Fortsatt gjenstående: fysisk iPhone-/Android-installasjon, langvarig flymodus,
lagringsrydding på telefon, full skjermlesertest og uavhengig innholdsredaksjon.
- Nettleser: forsøk på ny nedlasting med serveren stoppet viste tydelig feil og
  «Prøv nedlasting igjen», mens nedlastede pakker fortsatt kunne spilles.
- Biblioteket kontrollert ved 1200 px uten vannrett overløp; alle seks pakker vises.

## M4 – kontroll 12. november 2026

- 34 automatiske tester består: de 26 eksisterende og åtte duelltester.
- Alle 18 kategori-/nivåvalg prøvd med 5/10 spørsmål og begge startspillere.
  Begge får like mange spørsmål fra hver faktagruppe, uten felles spørsmål.
- Vinner, uavgjort, annenhver tur, doble svar og skjuling ved appbytte er testet.
- Ugyldige/lignende kallenavn, nivåer og svar avvises.
- Duellmotoren leser spørsmål, men endrer ingen solo- eller pakkeposter.
- Nettleser: full duell endte 500–500, omkamp endte 500–0 med riktig vinner.
- Nettleser: overlevering hadde null spørsmåls-/svarelementer i DOM-en.
- Nettleser: like navn avvist; valg av ekspert/10 spørsmål og lange navn fungerte.
- Nettleser: Avslutt/Fortsett og hjemlenkens avslutningsbekreftelse fungerte.
- Etter avsluttet duell var to solomerker, to pakker, pakkehistorikk og påbegynt
  pakkerunde med 100 poeng beholdt. Omlasting beholdt solofremdriften.
- Mobilbredde 320/390 px: oppsett, overlevering, spørsmål og resultater prøvd.
  Ingen vannrett overløp på overlevering med lange navn eller på resultat ved 320 px.
- Server stoppet etter klar M4-offlinekopi: appen startet og en hel duell ble
  fullført med riktig vinner (500–0), uten server.
- Fysisk iPhone/Android og reelt appbytte/låseskjerm gjenstår. Appbytte er dekket
  av motortest; den faktiske visibilitychange-flyten er ikke manuelt prøvd på telefon.
- Dueller og kallenavn lagres ikke ved lukking/omlasting. Ingen nettduell i M4.
