# Quizkrutt 0.6.0 (7) - felles bibliotek og nullstilling

## Bruk

Innstillinger: nullstill solofremdrift eller pakkehistorikk. Bekreftelsen sletter
poeng, historikk over sette spørsmål og påbegynt runde i valgt del. Installerte
pakker, katalog og innstillinger beholdes. På web nullstilles solo og pakker samlet.
Ingen synkronisering eller nullstilling på andre enheter.

Quizpakker: trykk «Hent nye quizpakker», velg tema og last ned pakken.
Ingen innlogging, ingen automatisk nedlasting, ingen spillresultater sendes.
GitHub Pages mottar vanlige forbindelsesopplysninger. Lagrede pakker virker uten nett.
De seks første pakkene ligger fortsatt i appen.

## Felles innhold

Katalog: https://terjemoe1954.github.io/app-page/quizkrutt/library/catalog.json

Åtte pakker med 140 spørsmål, i tillegg til grunnspillets 540.
To nye temaer: Historie og Mat og drikke, ti spørsmål per ny pakke.
Nye temaer ligger i pakkebiblioteket; grunnspillets nivåmerker er uendret.

Bygg innhold med `node scripts/build-library.mjs`. Baseline fra `web/catalog.js`,
nye pakker fra `content/library-packs.json`. Kopier `web/library/` til
`quizkrutt/library/` i app-page-repoet og publiser via GitHub Pages.
Øk pakkeversjon ved innholdsendringer; ikke erstatt en publisert versjon.

Klientene kontrollerer metadata, relative filbaner, størrelse, format og SHA-256.
Katalog og pakker lagres før UI oppdateres. Nettfeil erstatter ikke gamle pakker.
Kataloghenting beholder tidligere høyere pakkeversjoner og tilgjengelig innhold.
Nedlasting skjer bare fra den faste HTTPS-adressen uten innloggingsopplysninger.

## Verifisering

58 webtester består. 28 Swift-tester: 26 bestått, to valgfrie nettduelltester hoppet over.
Xcode Debug-bygg bestått. iPhone 17 og iPad Pro 13 M5 simulatorer viser app og henter
katalogen fra publisert GitHub Pages. På iPhone er historiepakken lastet ned og spilt
(+100); nullstilling fjernet historikk og aktiv runde, mens pakkefilen ble bevart.
Web har bekreftet nedlasting, spørsmål fra ny kategori, nullstilling, bevart pakke og omlasting.
Eksisterende vanlige appinstallasjoner og nettleserfremdrift ble ikke slettet.
Testappens midlertidige bundle-ID er `no.quizkrutt.librarytest`; kilden bruker fortsatt `no.quizkrutt.ios`.

GitHub bibliotek/support/personvern er publisert (app-page commit e0eef90).
Privat Sites-webversjon er publisert 13. november 2026, versjon 7.
Sites-kildecommit: a10e8f20aba79bed1bfb27ebd4b7a6b652dfcdaa.
Deploy: appgdep_6af6b6406838819198bd47a1cfd93d1b, succeeded.
Tilgangen er fortsatt privat. Ingen databaseendringer.
Apple-validering av 0.6.0 (7) er bestått; intern TestFlight-opplasting er bekreftet kl. 08:05 Europe/Oslo.
Apple har fullført behandlingen. Bygg 7 er knyttet til gruppen Internal og viser Testing.
Eksisterende intern tester har tilgang; ingen nye testere eller roller er opprettet.
Arkivet ligger i `.local/ios-release/Quizkrutt-0.6.0-7.xcarchive`.
