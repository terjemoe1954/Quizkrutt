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
