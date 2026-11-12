# Quizkrutt – lanseringssjekkliste

Versjon: 0.6.0-rc.1 · 12. november 2026. Privat testkandidat.

## Utført

- [x] Separate innstillinger, lokal fremdrift og pakker beholdt ved oppdatering.
- [x] Introduksjon, personvern-/lagringsforklaring og enkel innholdsmelding.
- [x] Systemfonter, synlig tastaturfokus, navngitte dialoger og svar uten kun farge.
- [x] 200 % tekst på smal nettleserskjerm og redusert bevegelse.
- [x] 54 automatiske tester og Worker-bygg.
- [x] Nettleserstart og gjenopptatt solospill med lokal server avslått.

## Må avklares før bredere lansering

Registrer dato, enhet, OS/nettleserversjon og resultat for hvert punkt.

- [ ] iPhone/Safari: installer fra Del → Legg til på Hjem-skjermen. Åpne appikonet.
- [ ] Android/Chrome: installer fra nettlesermenyen og åpne appikonet.
- [ ] På begge: fullfør solo, åpne høyere nivå, lukk appen og kontroller fremdrift.
- [ ] Last ned pakke, vent på offlineklarstatus, slå på flymodus, start på nytt,
      fullfør runde og kontroller lagring. Ny nedlasting skal gi forståelig feil.
- [ ] Kontroller systemets store tekst/200 %, portrett/landskap og skjermtastatur.
- [ ] VoiceOver og TalkBack: kategorier, nivå, svar, fasit, neste, resultater,
      innstillinger og dialoglukking. Ingen fokusfeller eller fasit før svar.
- [ ] Kontroller redusert bevegelse og valgfri lyd; lyd skal være av som standard.
- [ ] Sofaduell: overlevering, appbytte/låsing og to ulike navn.
- [ ] To telefoner: begge har tillatt privat Sites-tilgang, join med romkode,
      svar, nettbrudd/gjentatt sending, omstart, avbryt og ferdig resultat.
- [ ] Oppdater installert eldre app og behold merker, pakker og aktiv solorunde.
- [ ] Uavhengig innholdskontroll: fasit, norsk språk, tvetydighet, nivåer og kilder.
- [ ] Fastsett støtte-/kontaktpunkt og hvordan kopierte spørsmålsmeldinger mottas.
- [ ] Avklar ønsket lanseringspublikum og gjennomgå personvernteksten for dette.

## Distribusjon og drift

Første distribusjon er en installérbar PWA via HTTPS. Kandidaten er eierprivat;
lenken gir ikke automatisk andre brukere tilgang. Ingen endring av publikum eller
App Store-/Google Play-innsending er utført.

Lokal fremdrift er uten konto/synkronisering og kan forsvinne ved rydding av
nettsteddata. Nettdueller krever nett og lagret spillernøkkel. Invitasjoner varer
24 timer, kamper sju dager; utløpte poster ryddes begrenset ved nye romopprettinger.
Se README for detaljer. Ikke lov automatisk umiddelbar sletting etter utløp.

Ved regresjon: publiser forrige fungerende kildeversjon gjennom Sites og test
oppdateringen. Ikke slett lokale brukerdata eller DB-tabeller som rutinegjenoppretting.

## Native iOS 0.3.0 – I3

- [x] Native nettduell, to separate simulatorinstallasjoner og full lokal kamp.
- [x] 23 Swift-tester med virkelig lokal server, private innloggingsgrenser og tidsgrenser.
- [x] Egne romnøkler i nøkkelring, usikre svar gjentas idempotent og serveren gir poeng.
- [ ] Fullført privat innlogging i appen, eierkonto og navngitt ekstra testkonto.
- [ ] To fysiske iPhone-enheter med hver sin konto, mobilnettbytte, omstart og avbrudd.
- [ ] App Store-personvern, støttepunkt, faktisk VoiceOver/stor tekst og TestFlight.

Se ios/I3_TESTING.md for oppsett og nøyaktig skille mellom lokal simulatorprøve
og gjenstående privat produksjonstest. Ingen endring av nettstedets publikum er gjort.


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
