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

Offentlige GitHub-sider oppdatert i app-page commit `75eef1b` for 1.0, inkludert fjerning av gamle motstridende «nettduell kommer senere»-tekster. GitHub Pages-jobb 43390279809 fullført med success; appside, support og personvern verifisert HTTP 200 med 1.0-tekst etter publisering. Hovedprosjektets øvrige kildekode er ikke committet eller pushet i denne klargjøringen.


## Fysisk sluttest 13. november 2026 – 1.0 (9)

Bestått på fysisk iPhone 15 Pro og iPad 10, begge OS 27.2.1, fra TestFlight. Terje bekreftet forståelig VoiceOver-opplesning i testflytene på begge. iPad side om side med Innstillinger og videre quiz i smalt vindu fungerte; appbytte beholdt fremdrift på begge. Full femspørsmåls nettduell uten konto ga identiske serverbekreftede sluttresultater: 500/500 til begge. VoiceOver av og opprinnelig iPad-fullskjermmodus gjenopprettet. Ingen appdata nullstilt.

Se FINAL_TEST_BUILD9.md for detaljert bevis og avgrensning. Tidligere oppført fysisk sluttest/lyttetest/multitasking er nå gjennomført; minimum iOS 17 og full VoiceOver-dekning av alle flyter er fortsatt ikke testet. Ingen nye feil ble påvist, og kandidaten anbefales for eiers godkjenning av innsending. Appen er ikke sendt til App Review.


## Sendt til App Review – 13. november 2026

Etter eiers uttrykkelige godkjenning ble 1.0 (9) sendt til App Review ca. 09:30 Europe/Oslo. Apple bekreftet «1 Item Submitted». Innsending: 5b52fe19-e27f-4b33-aa56-1ae522a9f66c. Manually release this version ble bekreftet valgt før innsending; appen er ikke offentlig lansert. Bevis: AppStore/quizkrutt-build9-submitted.png.
