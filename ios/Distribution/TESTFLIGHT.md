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
