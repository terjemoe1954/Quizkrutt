# Quizkrutt for iOS – 0.5.0 (I5-klargjøring)

Eget Xcode-prosjekt med native SwiftUI. Krever iOS 17 eller nyere. Ingen eksterne
Swift-pakker. Spørsmål følger med appen og solospill trenger aldri nett.
Nettstedet og HandyMe-prosjektet er ikke endret av iOS-arbeidet.

## Åpne og kjøre

Åpne `Quizkrutt.xcodeproj` i Xcode, velg scheme **Quizkrutt** og en iPhone-simulator,
og trykk Run. Prosjektet er bygget med Xcode 27.2. Koden bruker iOS 17 som minimum,
kjøring på iOS 17 er ennå ikke testet. I4 er bygget og åpnet på fysisk
iPhone 15 Pro og iPad (10. generasjon), begge med 27.2.1.

For fysisk iPhone: velg din Apple-utviklergruppe under Signing & Capabilities,
bekreft en tilgjengelig bundle-ID (foreløpig `no.quizkrutt.ios`), velg telefonen og
bygg med normal signering. Ingen team-ID, sertifikater eller kontoer er lagt inn.
Et simulatorbygg kan ikke installeres direkte på en fysisk telefon. I4-testbyggene
bruker eksisterende lokal Apple Development-signering; ingen team-ID er lagret
i prosjektet og ingen nye sertifikater er opprettet.

## Funksjoner i denne første versjonen

- Native forside, seks kategorier, tre nivåer og 540 spørsmål.
- Ti ulike spørsmål per runde; tidligere usette spørsmål prioriteres.
- 100 poeng per riktig svar, 700 åpner neste nivå i samme kategori.
- Fasit, forklaring, resultatskjerm, 18 mulige merker og lagret beste poengsum.
- Pause/gjenopptak; atomisk lokal JSON-lagring etter hvert svar og sideskifte.
- Uleselig fremdrift bevares og overskrives ikke. Lagringsfeil vises med nytt forsøk.
- Introduksjon, innstillinger, valgfri haptikk (av som standard), systemets Dynamic
  Type, semantiske skjermleseretiketter og fasit som både tekst og symbol.
- Første TestFlight-beta har nettduell merket «kommer senere».
  Privat innlogging er utsatt; solo, pakker og sofaduell trenger ingen konto.
- Hjelp og personvern i appen, med godkjent supportkontakt.

iOS-appen har egen fremdrift uten synkronisering/import fra nettversjonen.
Quizpakker og sofaduell er aktive. Nettduellkoden beholdes for en senere beta. I3 er prøvd mot lokal
server med to simulatorer. Privat kontoinnlogging må sluttkontrolleres; se
[I3-testnotatene](I3_TESTING.md). Ingen App Store- eller TestFlight-opplasting er gjort.

## I2: pakker og sofaduell

Biblioteket har seks pakker med 120 nye spørsmål. Filter for kategori, nivå og
«Bare lagt til» gjør det enkelt å finne innhold. Trykk «Legg til» og deretter
«Spill». Alle pakkenivåer er tilgjengelige uten å låse opp grunnspillets nivåer.

Disse seks pakkene følger med appbygget. Å legge til er en kontrollert lokal
installasjon, ikke nedlasting fra Internett. Nye pakker krever foreløpig en
appoppdatering. Dette fungerer uten nett og uten den private nettsidens innlogging.
Henting av en oppdatert nettkatalog og eksterne pakkenedlastinger inngår ikke i I2.

Byteantall, SHA-256, identitet, versjon, skjema og spørsmål valideres før pakken
lagres atomisk i `Quizkrutt/packs-v1.json`. I1-filen `progress-v1.json` er uendret.
Pakkeresultater, spørsmålsrotasjon og aktiv runde har egen lagring. En aktiv runde
beholder en validert innholdskopi, slik at fjerning/oppdatering av pakken ikke
ødelegger runden. Fjerning beholder historikken, og gjeninnlegging beholder beste
resultat. Feil ved installasjon/fjerning publiserer ingen halvferdig endring.
Lagringsfeil under spill viser nytt forsøk mens runden beholdes i minnet.
Uleselige data overskrives ikke.

Sofaduell har to ulike kallenavn (1–20 tegn), seks kategorier, tre nivåer og
5/10 spørsmål hver. Begge får samme kvote fra hver faktagruppe, uten felles
spørsmål. Startspiller trekkes tilfeldig, og spillerne svarer annenhver gang.
Overleveringsskjermen oppretter ingen spørsmåls-/svarvisning. Appbytte eller en
inaktiv scene skjuler spørsmålet til spilleren viser sin tur igjen. Avslutning
krever bekreftelse; omkamp bruker samme navn og innstillinger med nye kort.
Dueller er kun i minnet og endrer ingen solo- eller pakkefremdrift.

## I2-kontroll

12. november 2026, iPhone 17 / iOS 27.2-simulator, Xcode 27.2:

- Debug-bygg 0.2.0 (2) uten feil eller advarsler i byggloggen.
- 13 Swift-tester består: fire I1-tester og ni nye I2-tester. Alle 18 kategori-/
  nivåvalg, begge duellengder og begge startspillere er dekket.
- Testet alle seks pakkers byteantall/hash og 120 unike spørsmål, ødelagt innhold,
  feil skjema/identitet, blokkert skriving, eldre pakkeversjon og separate filer.
- Testet pakkeresultat, doble svar/fullføringer, JSON-gjenopptak, innholdsrotasjon,
  fjerning under aktiv runde og oppdatering med gammel aktiv innholdskopi.
- Device Hub: lagt til Norge-pakken, fullført 10 spørsmål, fått 400/1000 og sett
  historikken. Fjernet og lagt den til igjen med samme resultat beholdt.
- Lagt til Norske naturperler (viderekommen), svart riktig og oppdatert/startet
  appen på nytt uten avinstallasjon. Samme spørsmål/svar og 100 poeng var beholdt.
  Neste spørsmål og pause fungerte også i sluttbygget.
- I1-solorunden var fortsatt på spørsmål 2 etter pakker og duell. Ingen merker
  ble endret av I2-spill.
- Like kallenavn ble avvist i UI. Full sofaduell endte 100–0 med korrekt vinner,
  turrekkefølge og ti skjulte overleveringer. Omkamp og avslutning ble prøvd.
- Hjemknapp/appbytte midt i duell returnerte til skjult overlevering for samme
  spiller. Ingen spørsmål eller fasit var i overleveringsskjermens AX-tre.

Dette var I2-kontrollen. Se [I4-testnotatene](I4_TESTING.md) for nyere
fysisk enhetstest, stor tekst og VoiceOver, samt gjenstående manuelle kontroller.

## Kontrollert

12. november 2026, iPhone 17 / iOS 27.2-simulator:

- Debug-bygg uten feil, installasjon og oppstart.
- Device Hub: forside → kategori → nivå → spørsmål → svar/fasit → neste → pause.
- Appen startet på nytt og ble oppdatert uten avinstallasjon. Spørsmål 2 og 100
  poeng ble beholdt. Eksisterende simulatorer ble ikke stoppet eller nullstilt.
- Fire Swift-motortester består: alle 18 nivåer, 6/10 kontra 7/10, gjentatte svar,
  gjentatt fullføring, JSON-gjenopptak, 30-spørsmålsrotasjon og ugyldig fremdrift.

Kjør fra prosjektroten:

```sh
node scripts/export-ios-questions.mjs
node scripts/export-ios-packs.mjs
swift test --package-path ios --scratch-path /private/tmp/quizkrutt-swift-tests
```

Spørsmål eksporteres fra `web/questions.js`. Serverbanken med nettduellfasit
inkluderes ikke. Ingen nett-/kontohemmeligheter er lagt i appen.

## Neste milepæler

- [x] I1: native solospill og lokal simulatorversjon.
- [x] I2: pakker og sofaduell i native grensesnitt, bygd og simulatorprøvd.
- [ ] I3: native nettduell implementert og lokalt testet; privat kontoflyt venter på akseptanse.
- [ ] I4: implementert og delvis verifisert; fysisk lyttetest med VoiceOver gjenstår.
  Se [I4_TESTING.md](I4_TESTING.md).
- [ ] I5: lokal 0.5.0-beta, signert utviklerarkiv og butikk-/personvernutkast klare.
  App Store Connect og offentlige URL-er er klare; Apple-validering er bestått.
  Intern TestFlight-opplasting er fullført; Apples prosessering følges opp.
  Se [distribusjonspakken](Distribution/TESTFLIGHT.md).

PrivacyInfo.xcprivacy deklarerer appspesifikk UserDefaults-bruk (CA92.1), ingen
sporing og ingen innsamlede data i offline-betaen. Ved aktivering av nettduell må
manifest og App Privacy oppdateres for navn, spillinnhold, spiller-ID og leverandører.
Solospillet samler ikke inn data. Server/innlogging og endelige App Store-opplysninger
gjennomgås før distribusjon. Se I3_TESTING.md for sikkerhet og validering.

TestFlight-veiledning: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/


## I5: Apple-validert beta

Første beta 0.5.0 (5) er etter avtale uten aktiv nettduell. Lokal Release-arkivering
og signaturkontroll er utført med eksisterende Apple Development-signering. Dette
er ikke Apple Distribution-signering eller en Apple-validert opplasting.
Siste arkiv ligger i `.local/ios-release/Quizkrutt-0.5.0-6.xcarchive` fra prosjektroten.
Apple-valideringen er bestått, appoppføring 6833974275 er opprettet, og intern
TestFlight-opplasting er fullført. Apple-prosessering følges opp. Offentlige lenker er publisert og lagt i bygg 6.
Se [TestFlight-pakken](Distribution/TESTFLIGHT.md), [butikktekstene](Distribution/APP_STORE_METADATA.nb.md)
og [personvern-/supportutkastet](Distribution/PRIVACY_AND_SUPPORT.nb.md).

For utviklertesting av I3 må bare Debug få `QUIZKRUTT_ONLINE_PREVIEW` i
Active Compilation Conditions. Release kan ikke slå på nettduell med dette flagget.
Privat innlogging skal fortsatt tas senere.
