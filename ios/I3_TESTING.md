# I3 – native nettduell, iOS 0.3.0 (bygg 3)

## Funksjoner

Nettduell har native SwiftUI-skjermer for oppretting, romkode, innmelding, fem
felles spørsmål, venting, fasit, resultater og bekreftet avbrudd for begge.
Eksisterende `/api/rooms`-server brukes uten database- eller serverendringer.

Serveren holder tilbake fasit og poeng til begge har svart. Native-klienten
kontrollerer responsformat, revisjon og poeng mot avsluttede turer. Klientvalgte
poeng sendes aldri. Serverens kallenavn, romkode, fem spørsmål, 24-timers
invitasjon og sju dagers kamputløp gjelder også i appen.

Tilgangsnøkler er 256 tilfeldige bit fra Security. Romadgang, uavklart oppretting,
innmelding, svar og gjennomgåtte turer lagres som én separat Keychain-post med
`WhenUnlockedThisDeviceOnly`. Ingen nøkler legges i UserDefaults, URL, kildekode,
appressurser eller vanlige fremdriftsfiler. Solo og pakker beholder sine filer.

En handling lagres før sending. Ved ukjent resultat kan samme oppretting eller
samme svar sendes igjen. Ved omstart hentes serverstatus før videre spill.
Forsinkede svar med lavere revisjon overskriver ikke nyere tilstand. Feil ved
nøkkelringlagring stopper nye handlinger; eksisterende data slettes ikke.

Synlig nettduell oppdateres hvert tiende sekund og kan oppdateres manuelt.
Bakgrunn stopper polling; retur henter status. Cookies og HTTP-forespørsler har
hver sin tidsgrense på tolv sekunder. API-responser caches ikke av klienten.

## Privat innlogging

Produksjonsadresse: https://quizkrutt.terjemoe54.chatgpt.site

Begge kontoer trenger Sites-testtilgang. Appen bruker Sites sin innloggingsrute
`/signin-with-chatgpt?return_to=%2F` som vanlig toppnivånavigasjon i WKWebView.
Ingen egen OAuth-/sessionserver eller innloggingspassord implementeres.

Etter innlogging velger brukeren «Jeg har logget inn – kontroller tilgang».
Klienten kontrollerer adgang med en forespørsel etter et ikke-eksisterende rom.
Bare en JSON-respons med forventet 404 godtas som bekreftet plattformadgang.
Ingen ekte rom avsløres av denne kontrollen.

URLSession bruker cookies fra appens WKWebsiteDataStore, begrenset til riktig
vertsnavn, sti, utløp og HTTPS. API-klienten følger ingen HTTP-omdirigeringer,
slik at romnøkkel og cookies aldri videresendes til en innloggingsleverandør.
HTML eller omdirigering behandles som krav om innlogging, ikke som gyldig API-data.
Appens nettleser har ikke en JavaScript-bro til native nøkler eller passord.
Innlogging i Safari eller Codex-nettleseren er ikke i seg selv bekreftet appadgang.
Ingen Sites-servicecredential er lagt inn i appen eller brukt for å omgå denne flyten.

## Utførte tester 12. november 2026

- 23 Swift-tester bestått: I1/I2-regresjon, native responskontrakt, tidlig fasit,
  falske poeng, feilet skriving, gjentatt oppretting, ukjent svarbekreftelse,
  gjenopptak, gamle revisjoner, gjennomgåtte turer, ugyldige navn/romkoder,
  tilfeldige nøkler, cookie-avgrensning og cookie-timeout med sen callback.
- Integrasjonstest med to separate native OnlineStore/HTTPOnlineTransport-klienter
  mot virkelig lokal SQLite-server: full kamp, tapt svarrespons, klientomstart,
  like serverresultater og avbrudd hos begge. Ingen mock for serverlogikken.
- Uinnlogget, lesende forespørsel mot den private produksjonsserveren ble avvist
  som innloggingskrav. HTML-innlogging godtas ikke som romrespons.
- Device Hub: iPhone 17 og iPhone 18 Pro, begge iOS 27.2. Separate appinstallasjoner,
  egne nøkkelringer og samme lokale server. Opprettet og sluttet til samme rom.
- Hele femspørsmålskampen endte 100–100 på begge native skjermer. Første spiller
  ventet uten fasit; fasit ble først vist etter begge svar. Oppdatering og
  gjenopptak beholdt romadgang. Ingen avinstallasjon eller datanullstilling.
- Gammel solorunde på spørsmål 2 var fortsatt tilgjengelig.
- Privat innloggingsvisning åpnet Sites sin inngangsside og deretter ChatGPTs
  passordsteg gjennom den dokumenterte direkte ruten. Ingen passord/koder ble
  håndtert av agenten. Brukeren valgte å fullføre dette senere; vellykket innlogging,
  cookie-basert privat API-tilgang og to separate kontoer er ikke sluttgodkjent.
- Både Debug og Release kompilerte uten feil/advarsler i byggloggene. Release-
  kompileringen var en kontroll for simulator, ikke et distribusjonsarkiv.

## Lokal reproduksjon

Fra Quizkrutt-roten:

```sh
npm run build
npm run dev
```

I en annen terminal:

```sh
QUIZKRUTT_INTEGRATION_ORIGIN=http://127.0.0.1:4174 \
QUIZKRUTT_PRIVATE_GATE_CHECK=1 \
swift test --package-path ios --scratch-path /private/tmp/quizkrutt-swift-tests
```

De to integrasjonstestene krever de angitte miljøvariablene; ellers hoppes de over.
Den private sjekken er kun lesende og bruker ingen innloggingscredential.

Simulator: bygg først som beskrevet i ios-device-hub. For fungerende Keychain må
bygget ha Xcodes simulerte app-identitet og normal signering. På denne Macen ble
et allerede installert Apple Development-sertifikat brukt via byggargumenter;
ingen kontoer eller sertifikater ble opprettet, og ingen team-ID er lagt i prosjektet.
`CODE_SIGNING_ALLOWED=NO` er egnet for kompilering, men gir ikke alene en
fungerende nøkkelringkonfigurasjon i dette prosjektet. Xcode genererer
simulatorens app-entitlements ved ordinær signering.

Velg egen utviklergruppe under Signing & Capabilities, eller bruk team-IDen til
et eksisterende sertifikat som `DEVELOPMENT_TEAM` og `CODE_SIGN_IDENTITY='Apple Development'`.
Dette er ikke en distribusjons-/TestFlight-signering.

Kun i Debug på simulator kan `QUIZKRUTT_LOCAL_SERVER=1` velge localhost:4174.
Ved `simctl launch` settes dette som `SIMCTL_CHILD_QUIZKRUTT_LOCAL_SERVER=1`.
UI merkes «Lokal servertest · ikke produksjon», og nøkkelringnamespace er separat.
Release og fysisk iPhone kan ikke aktiveres mot localhost med dette flagget.
Standard uten flagget bruker alltid den private HTTPS-adressen.

## Gjenstående akseptanse

- [ ] Fullfør innlogging inne i appen med eierkonto og bekreft JSON-tilgang.
- [ ] Gi den andre navngitte testkontoen visningstilgang (e-postadresse mangler).
- [ ] Fullfør kamp mot privat server med hver sin konto i appen.
- [ ] Fysisk iPhone/iPad, mobilnettbytte, låsing, VoiceOver og stor tekst (I4).
- [ ] TestFlight-signering, personvern-/støttelenker og distribusjon (I5).

Personvernmanifestet er oppdatert for navn/kallenavn, spillinnhold og spiller-ID
for appfunksjonalitet, knyttet til spilleren og uten sporing. Sites sin
innloggingsleverandør, serverdrift og endelige App Store-opplysninger må gjennomgås
som del av I5. Utløpte rom avvises etter sju dager og ryddes begrenset ved nye
opprettinger; ingen automatisk umiddelbar sletting ved utløp loves.
