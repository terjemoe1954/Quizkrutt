# Nettduell uten konto - 0.7.0 (8)

## Endring

Native iOS bruker en separat romkodebasert server. Ingen ChatGPT-innlogging,
passord eller felles apphemmelighet. Begge spillerne oppgir ulike kallenavn,
den ene deler en tilfeldig romkode. Fem felles spørsmål; fasit og poeng vises
først når begge har svart. Solo, pakker og sofaduell berøres ikke.

Server: https://quizkrutt-online.terjemoe54.chatgpt.site
Sites-ID: appgprj_6af6b876b1608191bdd4e00d3978c262
Kilde: Desktop/My Apps/Quizkrutt-online (egen kilde og database).
Den eksisterende private Quizkrutt-nettsiden og databasen beholdes uendret.

## Adgang og data

Romkode er en invitasjon, ikke en offentlig romliste. Hver spiller får en
tilfeldig 256-bits romnøkkel; bare hash lagres som serverens adgangsnøkkel.
Native nøkkel lagres i egen Keychain-service med WhenUnlockedThisDeviceOnly.
Ingen servicecredential eller Sites-omgåelsestoken ligger i appen.

Serveren lagrer kallenavn, fem spørsmål, svar, poeng/revisjon, romkode og
spiller-ID-er for å gjennomføre kampen. Bruk kallenavn, ikke fullt navn.
Invitasjoner utløper etter 24 timer; rom etter sju dager. Bounded opprydding
ved nye romopprettinger fjerner utløpte rom, ikke garantert umiddelbart ved utløp.
Driftsleverandøren kan føre tekniske forbindelseslogger. Kortvarige hashbaserte
begrensninger av forespørsler mot misbruk ryddes via samme begrensede mekanisme.

## Publisering

Serveren er offentlig fra 13. november 2026 etter brukerens uttrykkelige godkjenning.
Tilgangsrevisjon 2, separat database DB. Den gamle private testen er uendret.
Ikke last opp appen som fungerende nettduell før offentlig adgang og en hel kamp
med to native klienter mot produksjonsserveren er bekreftet.

## Personvern

Native manifest oppgir kallenavn, spiller-ID og spillinnhold knyttet til spilleren,
kun for appfunksjonalitet og uten sporing. Apples skjema og de offentlige sidene
må følge faktisk tilgjengelig beta. Manifestverdier er kontrollert mot:
https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacycollecteddatatypes/nsprivacycollecteddatatype

## Lokal test

QUIZKRUTT_INTEGRATION_ORIGIN=http://127.0.0.1:4174 swift test --package-path ios

Bruk separat simulator-app-ID ved tester som oppretter prøverom.
Lokalt debugflagg QUIZKRUTT_LOCAL_SERVER=1 velger testserveren, aldri Release.


## Verifisert klargjøring

Debug simulatorbygg bestått (egen app-ID no.quizkrutt.onlinetest).
28 Swift-tester: 27 består, én gammel valgfri privat-innloggingskontroll hoppes over.
Den ekte lokale SQLite-serveren ble brukt til fem felles spørsmål, identiske sluttpoeng,
tapt svarbekreftelse, klientomstart og avbrudd. Ingen produksjonsbrukerdata er endret.
Device Hub iPhone 17 viser native kallenavn/romkode og ingen innloggingsknapp.
Serverens private deploy succeeded: appgdep_6af6b8d1412481918ba7366a5c501524.
D1-binding DB har network_rooms og network_limits. Offentlig adgang er nå bekreftet (tilgangsrevisjon 2).


## Produksjonstest 13. november

28 Swift-tester: 27 består, én gammel privat-innloggingskontroll hoppet over.
To native HTTPOnlineTransport/OnlineStore-klienter uten cookies eller innlogging
fullførte fem spørsmål mot den offentlige HTTPS-serveren. Samme sluttpoeng hos
begge, fasit skjult før begge svar, tapt svarbekreftelse og klientomstart testet.
En egen kamp ble avbrutt og begge klienter fikk cancelled.
Offentlig support/personvern er oppdatert i app-page commit bf010c0.
Apple TestFlight-description og review notes er oppdatert for 0.7.0 (8).
Release-arkivet er ferdig signert etter lokal nøkkelringgodkjenning.
Lokal arkivkontroll for 0.7.0 (8), inkludert online-personvernmanifest, er PASS.
Apple-validering er bestått. TestFlight-opplasting er bekreftet med
Upload succeeded / EXPORT SUCCEEDED kl. 08:29 Europe/Oslo 13. november 2026.
Apple har fullført behandlingen. Bygg 8 er lagt til eksisterende Internal-gruppe
og viser Testing. Eksisterende intern tester har tilgang. Ingen nye testere eller roller.


## Test på to enheter

1. Oppdater begge enheter til 0.7.0 (8) når bygget blir tilgjengelig i TestFlight.
2. Åpne Nettduell og velg ulike kallenavn, uten innlogging.
3. Enhet A oppretter rom; enhet B skriver inn romkoden.
4. Svar først på A: bekreft at fasiten holdes tilbake. Svar så på B.
5. Fullfør fem spørsmål; kontroller like sluttpoeng hos begge.
6. Prøv appbytte/gjenåpning og manuell Oppdater nettduellstatus.
7. Prøv en ny duell som avbrytes; begge skal få avsluttet status.

Begge enheter bruker den nye separate serveren. Eldre private testrom flyttes ikke.
