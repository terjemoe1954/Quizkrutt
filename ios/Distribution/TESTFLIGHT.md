# Quizkrutt – TestFlight og App Store

12. november 2026 · 0.5.0 (6) · norsk offline-beta for iPhone og iPad.
Apple-validering er bestått. Intern TestFlight-opplasting er fullført med «Upload succeeded». Apples
byggliste viser nå 0.5.0 (6) med «Processing». Intern testtilgang er ikke aktiv ennå.

## Offentlige sider

Bygg 6 og Apple-metadata bruker disse verifiserte adressene:

- Support: https://terjemoe1954.github.io/app-page/quizkrutt/support/
- Personvern: https://terjemoe1954.github.io/app-page/quizkrutt/privacy/

Sammen med de øvrige appene finnes nå også:

- Appside: https://terjemoe1954.github.io/app-page/quizkrutt/
- Support: https://terjemoe1954.github.io/app-page/quizkrutt/support/
- Personvern: https://terjemoe1954.github.io/app-page/quizkrutt/privacy/
- Kilde: https://github.com/terjemoe1954/app-page/tree/main/quizkrutt

Begge sett med sider er offentlige og kontrollert uten innlogging. Den private
quizserverens tilgang er uendret. Behold Sites-lenkene aktive; appens innebygde
URL-er byttes først ved en planlagt appoppdatering.

## Hva betaen inneholder

Solo med 540 spørsmål, seks medfølgende pakker med 120 ekstra spørsmål,
sofaduell på samme enhet, lokal lagring, hjelp og personvern. Ingen konto,
annonser, kjøp, abonnement eller eksterne innholdsnedlastinger. Nettduell vises
som «kommer senere». Privat Quizkrutt-/ChatGPT-innlogging er utsatt etter avtale.

`QUIZKRUTT_ONLINE_PREVIEW` kan bare slå på utviklerflyten sammen med DEBUG.
Release forblir offline. Før en fremtidig nettduell-beta må personvernmanifest,
App Privacy, leverandører, lagring/sletting og reviewtilgang vurderes på nytt.

## Apple og lokale artefakter

- Apple-app: Quizkrutt, ID **6833974275**, bundle-ID `no.quizkrutt.ios`.
- Primærspråk norsk, SKU `QUIZKRUTT-IOS`.
- Support/personvern, betabeskrivelse, feedback-e-post og reviewkontakt er
  lagret hos Apple. Reviewtelefon ble gitt av eier; den står ikke på offentlige sider.
- Arkiv: `.local/ios-release/Quizkrutt-0.5.0-6.xcarchive` fra prosjektroten.
- Lokal kontroll: `python3 scripts/check-ios-archive.py .local/ios-release/Quizkrutt-0.5.0-6.xcarchive`.
- Apple-validering: `Validated Quizkrutt / EXPORT SUCCEEDED`.
- Distribusjonssignering/provisjoneringsoppdateringer ble eksplisitt godkjent av
  eier. Ingen App Store-innsending eller offentlig apppublisering er utført.

Arkivet er opprinnelig Apple Development-signert. Apple-flyten re-signerer det
for distribusjon. Ikke forveksle lokal signaturkontroll med Apple-validering.
Bygg 5 er historisk og skal ikke brukes til ny opplasting. Øk byggnummer etter
endringer eller når Apple krever nytt bygg.

## Intern TestFlight

Opplasting bruker `testFlightInternalTestingOnly=true`. Dette bygget kan dermed
ikke distribueres til eksterne TestFlight-testere eller App Store. En senere,
ferdig kvalitetssikret versjon må arkiveres og lastes opp uten denne begrensningen.
Ingen eksterne brukere skal få App Store Connect-roller bare for testing.

Apple-side:
https://appstoreconnect.apple.com/apps/6833974275/testflight

Gruppen «Internal» er kontrollert: 0 testere og 0 bygg. «Add Builds» viser
foreløpig «No builds available» mens Apple prosesserer. Ingen invitasjoner er sendt.

Etter prosessering: velg intern testgruppe, knytt til riktig bygg og kontroller
at eier er tilgjengelig som intern tester. Last ned gjennom TestFlight på enheten.
Første TestFlight-installasjon kan erstatte en lokal utviklerversjon; ta vare på
fremdrift og test oppdatering uten rutinemessig avinstallasjon.

## Kontroll og neste offentlige milepæl

Se [VALIDATION.md](VALIDATION.md) for fysisk iPhone-gjenopptak, full fysisk
pakkerunde (900/1000), iPad-historikk etter omstart og fysisk sofaduelloverlevering.
24 Swift-tester består; 2 valgfrie integrasjonstester hoppes over uten serveroppsett.

Før App Store eller ekstern beta: fysisk auditiv VoiceOver, minimum iOS 17,
iPad multitasking, full fysisk sofaduell til resultat, redaksjonell innholdskontroll,
ferdige butikkbilder og alders-/rettighets-/personvernopplysninger. Ikke erklær
full VoiceOver-støtte hos Apple før evalueringen er ferdig.

[Butikktekst og testplan](APP_STORE_METADATA.nb.md) ·
[Personvern-/supportgrunnlag](PRIVACY_AND_SUPPORT.nb.md)

## Apple-kilder

Kontrollert 12. november 2026:

- https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds
- https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/
- https://developer.apple.com/app-store/review/guidelines/
- https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy
- https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance/
- https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/


### TestFlight-kontroll 12. november 2026

Apple viser bygg 0.5.0 (6) som «Complete» og «Ready to Test».
Bygget er lagt til den eksisterende interne gruppen «Internal»; gruppen er
markert valgt på bygget. Ingen nye testere er invitert i denne kontrollen.
Dokumentasjon: `ios/Distribution/preview-testflight-build6-ready.png` (fra prosjektroten).


### GitHub-lenker, 12. november 2026

App Store Connects supportfelt, App Privacy-policyfelt og TestFlight-policyfelt
er oppdatert til GitHub Pages. Native AppReleaseInfo bruker samme adresser i
neste bygg. Allerede opplastet bygg 6 beholder Sites-lenkene; de må stå aktive.
GitHub-policyens vertstjeneste er rettet til GitHub Pages (commit 20ce4f8).


## 0.6.0 (7), 13. november 2026

Bygg 7 er arkivert og Apple-validert; opplasting er bekreftet med
«Upload succeeded / EXPORT SUCCEEDED» kl. 08:05 Europe/Oslo.
Bruk `.local/ios-release/Quizkrutt-0.6.0-7.xcarchive`. Lokal kontroll:
`python3 scripts/check-ios-archive.py .local/ios-release/Quizkrutt-0.6.0-7.xcarchive --build 7 --version 0.6.0`.

Betaopplysninger og review notes er oppdatert til å beskrive nullstilling,
felles offentlig pakkekatalog og valgfri nedlasting uten konto.
Nettduell er fortsatt deaktivert; ingen App Store-innsending.
Apple har fullført behandlingen. Bygg 7 er lagt til eksisterende gruppe Internal
og viser «Testing». Eksisterende eiertester har tilgang; ingen nye invitasjoner.

Privat webversjon er publisert fra Sites-kildecommit
`a10e8f20aba79bed1bfb27ebd4b7a6b652dfcdaa`, deployment
`appgdep_6af6b6406838819198bd47a1cfd93d1b` (succeeded).
Tilgangen er uendret. Ingen databaseendringer eller sletting av brukerfremdrift.


## 0.7.0 (8) - nettduell uten konto

Den nye separate duellserveren er offentlig etter brukerens uttrykkelige
godkjenning. Ingen ChatGPT-innlogging kreves for iOS-nettduell.
Produksjonstest med to native klienter består: full kamp, like poeng,
fasit etter begge svar, tapt svarbekreftelse, omstart og avbrudd.
Personvernmanifest, offentlige sider og beta/review-notater er oppdatert.
Apple-validering bestått; opplasting bekreftet kl. 08:29 Europe/Oslo.
Arkiv: .local/ios-release/Quizkrutt-0.7.0-8.xcarchive.
Kontroll: python3 scripts/check-ios-archive.py .local/ios-release/Quizkrutt-0.7.0-8.xcarchive --build 8 --version 0.7.0 --online
Bygg 8 er ferdig behandlet og knyttet til eksisterende Internal-gruppe; status Testing.
Eiertesteren kan oppdatere gjennom TestFlight på begge enheter. Ingen offentlig App Store-innsending.


## Lanseringskandidat 1.0 (9) – 13. november 2026

- Release-arkiv og lokal arkivkontroll bestått (`--build 9 --version 1.0 --online`).
- Apple-validering: Validated Quizkrutt / EXPORT SUCCEEDED.
- App Store-opplasting 08:50 UTC+1: Uploaded Quizkrutt / EXPORT SUCCEEDED. Ikke internal-only.
- Apple behandler bygget ferdig: Binary State Validated. Bygg 9 valgt og lagret for versjon 1.0.
- Eksisterende Internal-gruppe med én tester lagt til; oversikten viser Ready to Submit, Internal og én invitasjon. Ingen ekstern beta-review sendt.
- Fem skjermbilder for iPhone 1206×2622 og fem for iPad 2064×2752 lastet opp og behandlet av Apple. Fem av ti synlige i begge grupper etter navigering tilbake.
- Butikktekst, support, copyright, reviewnotater, sign-in av, Games/Trivia og aldersskjema lagret.
- Personvern: Name/User ID/Gameplay Content, kun App Functionality, linked, ingen tracking. Publisert etter uttrykkelig godkjenning av Apples bekreftelse.
- Gratispris og alle 175 land valgt. Apple kan begrense faktisk tilgjengelighet etter lokale regler.
- Manuell publisering valgt. Ikke sendt til App Review og ikke lansert.

### Testing og grenser

Separat simulator-ID `no.quizkrutt.storepreview` ble brukt; eksisterende Quizkrutt-data ble ikke nullstilt. iPhone 17 og iPad Pro 13 M5 på iOS/iPadOS 27.2: appstart, native solo, nettduellskjerm, bibliotek med åtte pakker, sofaduellskjerm og reversibel navigering kontrollert. Korrekt svar ga +100 og forklaring på begge. Største Dynamic Type kontrollerte lesbarhet og rulling til fasit/neste knapp. iPad viste neste spørsmål med bevarte 100 poeng i liggende visning. Tekststørrelse gjenopprettet og statuslinjeoverstyring fjernet.

Tidligere produksjonstest av uendret nettduellkode: to native klienter, alle fem spørsmål, gjenforsøk/omstart/avbrudd uten ChatGPT-konto. Tidligere 58 webtester og 27 beståtte Swift-tester (én foreldet privat innloggingstest hoppet over) er grunnlaget; denne kandidaten endrer versjonsnummer og distribusjonsmateriell.

Før endelig butikkinnsending: fysisk installasjon/oppdatering av bygg 9 på begge enheter og en runde nettduell; lyttetest med VoiceOver; iPad multitasking og minimum iOS 17 hvis en passende testenhet finnes. Full VoiceOver-støtte er ikke erklært. Simulatorgjennomgang erstatter ikke disse manuelle kontrollene.


### Sluttest av faktiske TestFlight-installasjoner – 13. november 2026

Begge fysiske enheter bekreftet 1.0 (9), startet fra TestFlight. VoiceOver-lyttetest bestått med Terjes bekreftelse; iPad-vindusdeling og lokal lagring ved appbytte bestått. Fem nettduellspørsmål gjennomført mellom iPhone og iPad uten konto; begge fikk 500/500 på begge enheter. Se FINAL_TEST_BUILD9.md. Ingen ny opplasting var nødvendig.
