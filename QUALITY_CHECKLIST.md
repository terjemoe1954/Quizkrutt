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
