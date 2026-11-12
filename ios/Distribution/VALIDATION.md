# I5 – kontroll av 0.5.0 (6)

12. november 2026 · Xcode 27.2.

## Bygg og Apple-validering

- Release-arkiv 0.5.0 (6), arm64 for iPhone/iPad, med offentlige lenker i appen.
- Lokal arkivkontroll PASS: signatur, versjon, ikon, dSYM, manifest, transport,
  orienteringer, 540 grunnspørsmål og SHA-256/byteantall for 120 pakkespørsmål.
- Ikon: 1024 × 1024 uten alfa. Release-porten holder nettduell av selv ved
  preview-betingelse. 24 Swift-tester består, 2 valgfrie integrasjonstester hoppet over.
- Apple-app-ID `no.quizkrutt.ios` registrert uten ekstra capabilities. Apples
  obligatoriske standardmarkering for In-App Purchase gir ikke kjøp i appen.
- App Store Connect-oppføring opprettet: Quizkrutt, norsk, SKU QUIZKRUTT-IOS,
  Apple-ID 6833974275. Ingen andre apper ble endret.
- Etter eksplisitt brukergodkjenning av distribusjonssignering ble
  `xcodebuild -exportArchive` med `method=validation` og provisioning-oppdatering
  fullført med exit 0: **Validated Quizkrutt / EXPORT SUCCEEDED**.
- Tidligere forsøk uten App Store-profil feilet. Den tidligere automatiske
  avvisningen av gammelt bygg 5 ble ikke omgått; nytt, testet bygg 6 ble validert.

## Fysiske enheter – samme Release-arkiv

Begge enheter kjører 27.2.1. Oppdatert uten avinstallasjon eller datanullstilling.

### iPhone 15 Pro

- Versjon 0.5.0 (6) synlig under Innstillinger.
- Hjelp/personvern åpner i appen; offentlig personvernlenke åpner riktig side i Safari.
- Sport og spill / Nybegynner: svar, fasit, 100 poeng, neste spørsmål og pause.
- Bare Quizkrutt ble startet på nytt med `--terminate-existing`. Runden og
  spørsmål 2 / 100 poeng var bevart og kunne gjenopptas.

### iPad (10. generasjon)

- Bibliotek, lokal installasjon av Norge: en liten byrunde og full ti-spørsmålsrunde.
- 900/1000 med ett bevisst feil svar: ingen feilpoeng, eksplisitt fasit og resultat.
- Historikk viste 900/1000 og én runde også etter appomstart. Grunnspillets
  merker forble 0 av 18; pakker endrer ikke solomerker.
- Sofaduell: to ulike testnavn, første overlevering, spørsmål, svar/fasit og
  skjult overlevering til den andre spilleren. Midlertidig duell avsluttet.
- Device Hub krevde midlertidig Keyboard Capture for tekstfelt; dette ble slått av igjen.

Ingen ny full fysisk sofaduell er spilt til resultat i denne runden. Full
sofaduell/omkamp er tidligere prøvd i simulator og motor. Fysisk auditiv VoiceOver,
minimumsversjon iOS 17 og iPad multitasking gjenstår før offentlig butikkinnsending.
Full VoiceOver-støtte er ikke erklært til Apple.

## Offentlige sider og metadata

- Eget offentlig Sites-nettsted, separat fra privat quizserver; support og
  personvern svarer HTTP 200 uten cookies og åpnes i nettleser og fra fysisk app.
- Etter brukerens tilleggsønske: `quizkrutt/` i GitHub `terjemoe1954/app-page`,
  commit `4305700`, med appside, support, personvern og CSS. Hovedoversikt oppdatert.
  Alle tre GitHub Pages-sider svarer HTTP 200. Ingen andre appmapper er endret.
- Appen og Apple bruker fortsatt de verifiserte Sites-lenkene i bygg 6. GitHub
  Pages-kopien krever ikke et nytt appbygg. Begge sett med lenker beholdes aktive.
- Support-/personvernlenker lagret i App Store Connect. Betabeskrivelse,
  feedback-e-post, reviewkontakt og review notes lagret med Apples status **Saved**.
  Reviewtelefon ble gitt av brukeren og sendt kun til Apple, ikke offentlige sider.
- Ingen innlogging kreves; `Sign-in required` er av. Privat quizinnlogging er utsatt.

## Distribusjon

Intern TestFlight-opplasting av validert bygg 6 er fullført 12. november 2026
kl. 15:45 (Europe/Oslo): «Uploaded Quizkrutt / EXPORT SUCCEEDED». `testFlightInternalTestingOnly=true` hindrer at dette
bygget brukes til eksterne TestFlight-testere eller App Store. App Store Connect bekrefter 0.5.0 (6) med status «Processing».
Gruppen «Internal» har 0 testere og 0 bygg; byggvelgeren viser «No builds available».
Apple må fullføre behandlingen før bygget kan knyttes til gruppen.
Se `preview-testflight-build6.png`. Intern testtilgang er ikke aktivert ennå.

Ingen App Store-innsending, offentlig apppublisering eller eksterne invitasjoner.


### TestFlight-kontroll 12. november 2026

Apple viser bygg 0.5.0 (6) som «Complete» og «Ready to Test».
Bygget er lagt til den eksisterende interne gruppen «Internal»; gruppen er
markert valgt på bygget. Ingen nye testere er invitert i denne kontrollen.
Dokumentasjon: `ios/Distribution/preview-testflight-build6-ready.png` (fra prosjektroten).
