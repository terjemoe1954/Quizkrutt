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

## M5 – kontroll 12. november 2026

- 45 automatiske tester består, inkludert migrert M1–M4-regresjon, SQLite/D1-SQL,
  API-kontrakt, nøkkeladgang, radversjon og bygget Worker med innbakte webressurser.
- Oppretting/join kan gjentas med samme nøkkel uten nye rom eller dobbelt opptak.
- Begge får samme spørsmål og rekkefølge. Fasit og poeng holdes tilbake før begge svar.
- Samtidige svar, gjentatt sending, motstridende valg og fremtidig tur er kontrollert.
- Uautoriserte nøkler og nøkler fra andre rom kan ikke lese, svare eller avbryte.
- Invitasjonsutløp, sju dagers kamputløp, fullt rom, ugyldige navn og rategrense prøvd.
- Avbrutt kamp avvises for senere svar og vises som avsluttet hos begge.
- Bygget Worker avviser kildekode-/serverfiladresser. API-responser er no-store.
- To lokale nettleserøkter opprettet/joinet samme kamp og fullførte med 500–0.
- Verten lastet siden på nytt og fortsatte med serverbekreftet svar, uten tidlig fasit.
- Serveren ble stoppet mens et svar ble sendt. «Ikke bekreftet» ble vist med valgt
  svar bevart. Etter omstart bekreftet «Send samme svar igjen» ett lagret svar.
- Gjest avbrøt en annen kamp; vert fikk samme sluttstatus etter oppdatering.
- Mobilbredde 320 px: hub og lagret resultat uten vannrett overløp. Resultat også sett ved 390 px.
- Eksisterende to solomerker, to pakker og påbegynt solopakkerunde besto etter oppdateringen.

Gjenstår: to fysiske telefoner, Sites-innlogging på begge, langvarig frakobling,
full skjermlesertest og bredere redaksjonell kontroll. Lokal API-test bruker ekte
SQLite med D1-grensesnitt, ikke Cloudflare-infrastruktur. Produksjonskontroll
rapporteres separat etter publisering.

## M6 – kontroll 12. november 2026

- 54 automatiske tester: eksisterende spill-/pakke-/duell-/API-regresjon og nye
  tester for innstillinger, lyd av, feil ved lagring og service worker-livsløp.
- Offlineinstallasjon avviser omdirigert innloggingsside, feil MIME og ufullstendig
  cache. Klarmerke skrives sist; forrige gyldige appcache beholdes ved oppdatering.
- Nettleser: 200 % tekst ved 320 px, justert overskrift uten vannrett overløp.
- Innstillinger beholdt etter omlasting; Escape lukket dialog og returnerte fokus.
- Introduksjon med tastatur, videreknapp flyttet fokus til kategorioverskriften.
- Gjenopptatt pakkerunde beholdt 100 poeng og eksisterende merker/nedlastinger.
- Server stoppet: oppstart fra cache, gjenopptak, neste spørsmål og tastatursvar
  fungerte; riktig svar ble annonsert i stabilt aria-live-felt.
- Spørsmålsmelding viste forventet spørsmål/fasit/ID uten spilleradgang eller navn.
- Tilgjengelighetskontrollen gjelder semantikk, fokus og tastatur i testnettleseren,
  ikke faktisk VoiceOver/TalkBack-opplesing eller full WCAG-sertifisering.

Fysisk iPhone/Android, installasjon, ekte skjermleser, lyd på telefon og bredere
redaksjonell gjennomgang gjenstår i LAUNCH_CHECKLIST.md.


## Native iOS I2 – 12. november 2026

- 13 Swift-tester bestått; 0.2.0 (2) bygget med Xcode 27.2 til iPhone 17 / iOS 27.2.
- Seks pakker / 120 nye spørsmål med SHA-256-/byte-/skjemakontroll.
- Full native pakkerunde: 400/1000, historikk beholdt etter fjerning/gjeninnlegging.
- Native pakke på viderekommen: aktiv runde/svar/100 poeng beholdt etter appoppdatering.
- I1-fremdrift uendret, separat pakkefil, feilfiler beskyttet mot overskriving.
- Full native sofaduell: 100–0 med riktig vinner og ti kontrollerte overleveringer.
- Spørsmål/fasit fraværende fra overleveringens tilgjengelighetstre.
- Like navn avvist, omkamp, appbytte til Hjem og tilbake, samt avslutning prøvd.
- Pakker installeres fra medfølgende appressurser; ingen nettforespørsel kreves.
- Se ios/README.md for tester og grenser. Fysiske enheter og ekte VoiceOver gjenstår.

## Native iOS I3 – 12. november 2026

- 23 Swift-tester består, inkludert faktisk serverintegrasjon med to native klienter.
- Korrekt signert Xcode-simulatorbygg 0.3.0 (3). Eksisterende sertifikat brukt lokalt.
- To separate native iPhone-installasjoner mot lokal server: full kamp endte 100–100.
- Samme rom/nøkkel overlevde appoppdatering og gjenopptak fra begge nøkkelringer.
- Fasit var skjult mens bare én spiller hadde svart; begge fikk samme sluttresultat.
- Ukjent svarrespons/omstart, gjentatt sending, avbrudd og gamle revisjoner er testet.
- Cookie-avgrensning, avvist HTML-innlogging og tidsgrense med sen callback er testet.
- Uinnlogget lesing mot privat produksjon ble avvist. Ingen innloggingshemmeligheter
  eller Sites-servicecredential ble lagt i appen. Tilgangspolicyen er uendret.
- Privat innloggingsvisning er implementert; vellykket privat kontoflyt og faktisk
  kamp på to fysiske telefoner er ikke sluttgodkjent. Se ios/I3_TESTING.md.


## Native iOS 0.4.0 – I4

- [x] Signert installasjon og enkel navigasjon på fysisk iPhone 15 Pro og iPad 10.
- [x] Stor tekst, iPad-lesebredde og simulatorens VoiceOver-fokus/aktivering testet.
- [x] Rettinger for svarkontrast, neste spørsmåls rulleposisjon og duelloppstart.
- [x] 24 Swift-tester bestått, 2 valgfrie integrasjonstester hoppet over.
- [x] Debug og Release bygger; eksisterende data bevart under oppdatering.
- [ ] Fysisk VoiceOver-lytting og full fysisk spillrunde.
- [ ] Privat innlogging/nettduell på to fysiske telefoner (utsatt av brukeren).
- [ ] iOS 17, iPad multitasking og TestFlight/I5 før lansering.

Detaljert bevis og begrensninger: `ios/I4_TESTING.md`.


## Native iOS I5 – 0.5.0 (5)

- [x] Etter avtale: første beta er offline, nettduell kommer senere.
- [x] Hjelp/personvern og godkjent supportkontakt i appen.
- [x] Release-arkiv med eksisterende utviklersignering, dSYM og lokal arkivkontroll.
- [x] 24 Swift-tester bestått, 2 valgfrie integrasjonstester hoppet over.
- [x] Ikon 1024 × 1024 uten alfa; 660 spørsmål og pakkekontroll verifisert i arkivet.
- [x] Norske butikk-/betatekster, review notes og publiseringsutkast for support/personvern.
- [x] Offentlige URL-er, personvernlenke, appoppføring og Apple-validering.
- [x] Distribusjonssignering og TestFlight-opplasting av 0.5.0 (6).
- [ ] Apple-prosessering, intern testtilgang og installasjon gjennom TestFlight.
- [ ] I4s fysiske sluttkontroller, redaksjon og komplett butikkbildesett.

Se `ios/Distribution/TESTFLIGHT.md`. Bygg 6 er Apple-validert og lastet opp
for intern testing. App Store Connect viser «Processing». Ingen App Store-innsending.
