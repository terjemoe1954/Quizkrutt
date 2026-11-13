# Quizkrutt – appidé og milepæler

Dato: 12. november 2026
Status: M1–M5 implementert som separat PWA. Quizkrutt er en installérbar webapp for iPhone og Android. M6 er en privat lanseringskandidat; fysiske plattformtester gjenstår.

## Navn

Anbefalt arbeidsnavn: **Quizkrutt** – korte runder, farger og et lite pang når du mestrer noe!

Andre forslag: **Hjernefest**, **Quizkompis**, **Kunnskapssprett** og **Quizrakett**.
Navnene er idéforslag; tilgjengelighet i appbutikker, domener og varemerker er ikke kontrollert.

## Ideen

En leken quizapp på norsk der man velger kategori og vanskelighetsgrad,
spiller korte runder og åpner nye utfordringer. Man kan spille alene uten konto.
Målgruppe i første versjon er ungdom og voksne; egne barnepakker kan vurderes senere.

Forsiden har en vennlig maskot, «Fortsett»-knapp, fremdrift og store kategorikort
med illustrerte ikoner og tydelige navn:

| Kategori | Ikonidé | Farge |
| --- | --- | --- |
| Litt av alt | Konfettiboks | Lilla |
| Verden rundt | Jordklode med koffert | Turkis |
| Dyr og natur | Smilende rev og blad | Grønn |
| Film og musikk | Popcorn og hodetelefoner | Rosa |
| Sport og spill | Pokal og spillkontroll | Oransje |
| Vitenskap og teknologi | Rakett og atom | Blå |

Uttrykket skal være morsomt og ryddig: runde kort, små animasjoner og valgfri lyd
og vibrasjon. Farge og lyd skal aldri være eneste signal. Støtt redusert bevegelse,
skjermleser, stor tekst og gode kontraster.

## Spilleregler for første versjon

- En runde har 10 spørsmål med fire svaralternativer og ett riktig svar.
- Etter svaret vises riktig svar og en kort forklaring.
- Hvert riktig svar gir 100 poeng. Ingen trekk for feil.
- Ingen tidspress i vanlig solospill.
- Hver kategori har nivåene Nybegynner, Viderekommen og Ekspert.
- Nybegynner er åpent. Minst 7 av 10 riktige åpner neste nivå i samme kategori.
- Spillede nivåer kan alltid spilles igjen. Bestått runde markeres med merke.
- Spørsmål trekkes fra en større bank med prioritet til spørsmål man ikke nylig har sett.
- Fremdrift og innstillinger lagres lokalt. Sletting av appdata fjerner lokal fremdrift.

## M1 – Uttrykk og spillbar prototype

Leveranse: Forside, kategorivalg, nivåvalg, spørsmålsvisning og resultatside.
Bruk 30 kvalitetssikrede eksempelspørsmål i tre kategorier for å prøve flyten.

Ferdig når:
- Man kan fullføre en runde, se poeng og starte på nytt.
- Tilbakeknapper og svarvalg fungerer uten dobbeltregistrering av svar.
- Forsiden er lett å forstå på en liten mobilskjerm.
- Arbeidsnavn, farger og ikonretning er avklart før hele spørsmålsbanken lages.

## M2 – Første komplette soloversjon

Leveranse: Seks kategorier, tre nivåer, fremdrift, merker og lokal lagring.
Start med minst 30 spørsmål per kategori og nivå: 540 spørsmål totalt.

Ferdig når:
- Nivåopplåsing følger reglene og beholdes etter omstart.
- En runde inneholder ikke samme spørsmål flere ganger.
- Resultatsiden tilbyr «Prøv igjen», «Neste nivå» når åpnet og «Velg kategori».
- Spørsmål er kontrollert for fakta, tydelig språk, entydige svar og rettigheter.
- Solospill fungerer uten nett med de medfølgende spørsmålene.

## M3 – Nye quizpakker etter ønske

Leveranse: «Flere quizer» med pakker sortert etter tema og nivå, eksempelvis
Verdensrommet, Norske steder og Filmklassikere. Vis antall spørsmål,
vanskelighetsgrad, nedlastingsstørrelse og om pakken allerede er lastet ned.

Etter et bestått nivå foreslår appen en relevant pakke på høyere nivå.
Spilleren velger selv om den skal lastes ned. Fullføring låser opp nivået;
nedlasting krever nett. Nedlastede pakker kan spilles uten nett.

Ferdig når:
- Nedlasting, avbrudd, nytt forsøk og sletting av en pakke fungerer.
- Ugyldige eller ufullstendige pakker avvises uten å ødelegge lagret innhold.
- Oppdateringer har versjonsnummer og overskriver ikke fremdrift utilsiktet.
- Manglende nett gir en tydelig forklaring og tilgang til allerede lagrede quizer.

Første løsning er ferdigskrevne, kvalitetssikrede pakker fra en innholdstjeneste.
Automatisk KI-generering på bestilling er en mulig senere utvidelse og krever
egen løsning for faktakontroll, kostnader og innholdsmoderering.

## M4 – To spillere på samme telefon

Leveranse: «Duell på sofaen» uten konto eller server. Spillerne skriver kallenavn
og bytter på telefonen. Begge får samme antall spørsmål fra samme kategori og nivå,
men forskjellige, forhåndsbalanserte spørsmålssett for å unngå at spiller to ser fasiten først.

Ferdig når:
- En tydelig overleveringsskjerm skjuler spørsmål og svar mellom turene.
- Begge får like mange turer, og resultatet viser vinner eller uavgjort.
- Avbrutt duell kan avsluttes uten å påvirke solofremdriften.

Dette er et valgfritt tillegg etter at solospillet er godt.

## M5 – Nettduell med en venn (valgfri)

Leveranse: Opprett duell, del romkode og spill samme runde på hver sin telefon.
Begynn med turbasert spill, så begge slipper å være på nett samtidig.

Krever backend for spilleridentitet, invitasjoner, runder og resultater.
Serveren validerer svar og poeng, og fasit sendes først etter levert svar.
Ingen åpen chat eller offentlig spillerkatalog i første utgave.

Ferdig når:
- To enheter kan opprette, bli med i og fullføre en duell.
- Begge får samme spørsmål og regler, med fasit etter at begge har svart eller runden er avsluttet.
- Gjentatt sending gir ikke doble poeng.
- Ventetid, frakobling, utløpt invitasjon og avbrutt kamp håndteres tydelig.
- Hver spiller får bare tilgang til sine egne dueller og tillatte kampdata.

## M6 – Test og første lansering

Status: 0.6.0-rc.1 implementert og testet lokalt. Se LAUNCH_CHECKLIST.md for
gjenstående godkjenning på fysiske enheter før bredere lansering.

Leveranse: Gjennomarbeidet første versjon med appikon, enkel introduksjon,
innstillinger, innholdskreditering og forklaring av lagring/personvern.

Ferdig når:
- Hele soloflyten er prøvd på de valgte målplattformene.
- Stor tekst, skjermleser, redusert bevegelse og lyd av er kontrollert.
- Offlinebruk, omstart og feil ved pakkenedlasting er prøvd.
- Ingen kjente feil mister fremdrift eller blokkerer en vanlig runde.
- Distribusjonsform og eventuelle butikkrav er avklart.

## Plattform og avgrensning

Valgt plattform: installérbar webapp (PWA) for iPhone og Android. Quizkrutt har
eget prosjekt og egen lokal lagring, separat fra HandyMe.

Anbefalt første omfang: M1 og M2. Deretter M3 og lanseringskontrollene i M6.
M4 kan legges til når solospillet fungerer godt; M5 kan vente til interessen er prøvd.
Annonser, betaling, offentlig toppliste og konto/synkronisering inngår ikke i første versjon.

## Neste konkrete steg

1. Prøv M5 med to fysiske telefoner, inkludert innlogging, nettbrudd og retur til duellen.
2. Samle tilbakemeldinger om ordlyd og vanskelighetsgrad.
3. Fullfør M6-kontroller før bredere lansering.

## M1 – gjennomført 12. november 2026

- Eget prosjekt med tre kategorier og 30 eksempelspørsmål.
- Forside, nivåvalg, spillrunde, forklaringer, poeng og resultatside.
- Appmanifest, appikoner, service worker og installasjonsveiledning.
- Nettleserkontroll: full ti-spørsmålsrunde, kategori-/nivåvalg og avbryt/fortsett.
- Mobilvisning kontrollert i nettleser; fysisk iPhone/Android-installasjon og offlineoppstart gjenstår.

## M2 – implementert og kontrollert 12. november 2026

- Seks kategorier med egne illustrerte SVG-ikoner.
- Nybegynner, Viderekommen og Ekspert med 30 spørsmål hver: 540 totalt.
- Ti tilfeldig valgte spørsmål per runde, med prioritet til ikke nylig spilte spørsmål.
- 7/10 gir merke og åpner neste nivå; beste resultat og antall runder vises.
- Lokal lagring etter hvert svar og steg, inkludert én påbegynt runde.
- Forsiden viser merker og «Fortsett runden»; ny runde erstatter ikke en gammel uten valg.
- Resultatsiden har «Prøv igjen», «Neste nivå» når åpent og «Velg kategori».
- Lagringsfeil vises, og nyere fremdrift i en annen fane overskrives ikke.
- 12 automatiske tester og nettleserflyt gjennom tre nivåer er kontrollert.
- Oppstart og svar fra offlinekopi er prøvd med lokal server stoppet.
- Se QUALITY_CHECKLIST.md for presist testomfang og gjenstående telefonkontroll.

## M3 – implementert og kontrollert 12. november 2026

- «Flere quizer» med tema-/nivåfilter og visning av bare nedlastede.
- Seks pakker med 20 spørsmål hver: 120 ekstra spørsmål ved siden av de 540 medfølgende.
- Navn, tema, nivå, versjon, nedlastingsstørrelse og lagringsstatus vises.
- Nedlasting etter eget valg, avbryt, tidsavbrudd, nytt forsøk og bekreftet sletting.
- Identitet, versjon, innholdsformat, antall, byteantall og SHA-256 kontrolleres før lagring.
- Gamle pakker beholdes ved feil. Oppdateringer får egen versjonshistorikk.
- M2-resultater bevares. Pakker har egne resultater, og alle pakkenivåer kan spilles direkte.
- Bestått runde gir forslag til relevant høyere utfordring uten automatisk nedlasting.
- Sletting beholder resultater og en aktiv rundes spørsmålsøyeblikksbilder.
- Katalogen følger apputgivelser; JSON-innhold hentes fra samme private Site etter valg.
- Ingen KI-generering, kontosynkronisering eller fjernredigeringssystem inngår.
- Se QUALITY_CHECKLIST.md for faktisk verifikasjon og telefonkontroller som gjenstår.

## M4 – implementert og kontrollert 12. november 2026

- «Duell på sofaen» tilgjengelig direkte fra forsiden.
- To ulike kallenavn, seks kategorier, tre nivåer og 5 eller 10 spørsmål hver.
- Tilfeldig startspiller og annenhver tur på samme telefon.
- To adskilte spørsmålssett med samme fordeling mellom faktagrupper på valgt nivå.
- Overleveringsskjerm uten spørsmål/svar mellom hver tur, også ved appbytte.
- Egne poeng underveis, deretter vinner/uavgjort, begge resultater og omkamp.
- Bekreftet avslutning via knapp eller hjemlenke; solofremdrift beholdes.
- Duellen er lokal og lagres ikke ved lukking eller omlasting.
- 34 automatiske tester består, inkludert alle kategori-/nivåvalg og begge lengder.
- Se QUALITY_CHECKLIST.md for nettlesertester og gjenstående fysisk telefontest.

## M5 – nettduell implementert 12. november 2026

- Sites Worker og D1, samme private nettadresse og uendret tilgang.
- Opprett rom, åttetegns romkode og gjesteplass på telefon nummer to.
- Fem identiske spørsmål og svaralternativer, turbasert, med serverstyrt poeng.
- Separat bank med 90 spørsmål der fasit ikke inngår i nettleserressursene.
- Fasit/forklaring først når begge har svart; ingen mulighet til å hoppe over turer.
- Tilfeldige spilleradganger, nøkkelhash på serveren, kontroll per handling.
- Gjenopptakelse, ubekreftet svar, nytt forsøk og vern mot doble poeng.
- Radversjon hindrer samtidige svar i å overskrive hverandre.
- Invitasjonsutløp etter 24 timer, kamp etter sju dager og avbrutt kamp hos begge.
- Ingen chat, offentlig romliste, ekstra varsling eller endring av solofremdrift.
- 45 automatiske tester; to nettleserøkter har fullført samme kamp og prøvd nettbrudd.
- Se QUALITY_CHECKLIST.md for verifikasjonsomfang og gjenstående fysisk telefontest.

## Ny retning – native iOS (12. november 2026)

Egen SwiftUI-app i `ios/Quizkrutt.xcodeproj`. Første lokale iOS-milepæl I1 er bygget
og prøvd i iPhone 17-simulatoren: 540 spørsmål, tre nivåer, merker, offline solo,
automatisk lagring, gjenopptak og native innstillinger. Fire Swift-tester består.
Se `ios/README.md` for I2–I5. PWA-M1–M6 er ikke automatisk portert i sin helhet;
I2-pakker og sofaduell og I3s native nettduell er nå implementert (se under).
Privat kontoflyt venter på akseptanse. I4 bruker eksisterende lokal
utviklersignering på fysisk iPhone/iPad. Ingen butikkinnsending er gjort.


## I2 – Native quizpakker og sofaduell

Status: implementert 12. november 2026 i iOS 0.2.0 (bygg 2).

- [x] Seks medfølgende pakker / 120 spørsmål, eget bibliotek med tema-/nivåfilter.
- [x] Eksplisitt «Legg til», integritetskontroll og atomisk, separat pakkelagring.
- [x] Pakkerunder med historikk og gjenopptak; fjerning bevarer resultat og aktiv runde.
- [x] Sofaduell med to navn, kategori/nivå og 5/10 spørsmål hver.
- [x] Balanserte, ikke-overlappende spørsmål, overlevering og skjuling ved appbytte.
- [x] Resultat, omkamp og bekreftet avslutning uten å endre solo-/pakkefremdrift.
- [x] 13 Swift-tester, Xcode-bygg, full pakkerunde og full duell i iPhone-simulator.

Pakkene i I2 installeres fra appens medfølgende ressurser. Nettbasert henting av
nye pakker krever en senere katalog-/adgangsløsning; nye medfølgende pakker kan
leveres med appoppdateringer. Ingen Sites-tilgang eller serverendringer trengtes.
Fysisk enhets-/tilgjengelighetstesting og TestFlight gjenstår i I4/I5.


## I3 – Native nettduell

Status: 0.3.0 (bygg 3) implementert og testet mot lokal server med to separate
native iPhone-installasjoner. Privat innlogging/to kontoer venter på sluttkontroll.

- [x] Native oppretting, innmelding, romkode, venting, svar, fasit og resultater.
- [x] Eksisterende server-API, fem felles spørsmål og serverberegnede poeng.
- [x] Egne 256-bits romnøkler, separat Keychain-lagring og gjenopptak.
- [x] Gjentatt sending ved ukjent svar, revisjonskontroll og bekreftet avbrudd.
- [x] Polling ved synlig app, manuell oppdatering og tidsgrenser.
- [x] Privat innloggingsvisning; ingen servicecredential eller nøkler i appressurser.
- [x] 23 Swift-tester, Debug/Release-bygg og full native kamp i to simulatorer: 100–100.
- [ ] Sluttgodkjent innlogging og kamp mot privat server med hver sin testkonto.

Se `ios/I3_TESTING.md`. Ingen endring av Sites-publikum, database eller serverkode.
Fysisk enhetstest er omtalt i I4 nedenfor; TestFlight gjenstår i I5.

Privat innlogging ble åpnet frem til ChatGPTs passordsteg. Brukeren valgte å
fullføre innloggingen senere; dette akseptansepunktet er derfor fortsatt åpent.


## I4 – iPhone, iPad, stor tekst og VoiceOver

Status: 0.4.0 (4) implementert og delvis verifisert 12. november 2026.

- [x] Fysisk signert installasjon og navigasjon på iPhone 15 Pro og iPad 10.
- [x] Største tekst, stablede svar, lesebredde på iPad og orienteringer.
- [x] Skjermleseretiketter uten forhåndsavsløring, eksplisitt fasit og fokusflytting.
- [x] VoiceOver aktiv i simulator: spørsmål, berøringsvalg/dobbelttrykk og overlevering.
- [x] Rettet grå besvarte alternativer, rulleposisjon og tom førstegangs-sofaduell.
- [x] 24 tester bestått, 2 valgfrie integrasjonstester hoppet over; Debug/Release bygger.
- [ ] Fysisk VoiceOver-lyttetest og full fysisk spillrunde/sluttkontroll.

Se `ios/I4_TESTING.md` for enheter, funn, skjermbilder og gjenværende punkter.
Privat innlogging tas senere som avtalt. I4 er ikke full lanseringsgodkjenning.


## I5 – TestFlight og App Store-klargjøring

Status: lokal klargjøring ferdig i 0.5.0 (5); Apple-distribusjon gjenstår.
Brukeren godkjente første beta uten aktiv nettduell og terjemoe54@hotmail.com
som offentlig support-/personvernkontakt. Privat innlogging er utsatt.

- [x] Release-beta med solo, pakker og sofaduell; nettduell er «kommer senere».
- [x] Hjelp/personvern i appen og versjonsnummer fra byggets metadata.
- [x] Offline-personvernmanifest, eksportfelt, ikon og komplett enhetsarkiv.
- [x] Lokalt Apple Development-signert Release-arkiv med dSYM og arkivkontroll.
- [x] Norske butikk-/TestFlight-tekster, review notes, support-/personvernutkast.
- [ ] Offentlige support-/personvern-URL-er og lenke i appen.
- [ ] App Store Connect, distribusjonssignering/validering og TestFlight-opplasting.
- [ ] Fysisk slutt-QA, ferdige butikkbilder og eierens App Store-opplysninger.

Se `ios/Distribution/TESTFLIGHT.md`. Ingen Apple-opplasting, invitasjon eller
offentlig publisering er gjort gjennom I5-klargjøringen.


### I5-oppfølging – offentlige URL-er / bygg 6

- [x] Eget offentlig support-/personvernnettsted publisert og kontrollert uten innlogging.
- [x] Offentlige lenker i iOS-appen, byggnummer økt til 6; Debug kompilerer.
- [ ] Release-arkiv 6: venter på brukerens nøkkelringgodkjenning for signering.
- [ ] App Store Connect-innlogging/oppføring og Apple-validering.
- [ ] Siste fysisk QA og TestFlight-opplasting. Opplasting er autorisert når klart.

Support: https://quizkrutt-support.terjemoe54.chatgpt.site/support/
Personvern: https://quizkrutt-support.terjemoe54.chatgpt.site/personvern/
Privat quizinnlogging forblir utsatt. Se `ios/Distribution/TESTFLIGHT.md`.


### I5-oppfølging – Apple-validert bygg 6

- [x] Bygg 6 ferdig signert og lokalt arkivkontrollert.
- [x] App-ID og Quizkrutt-oppføring opprettet i Apple (6833974275), norsk hovedspråk.
- [x] Offentlig personvernlenke åpnet fra fysisk iPhone, lagret gjenopptak testet.
- [x] Full pakkerunde på fysisk iPad: 900/1000; historikk bevart etter omstart.
- [x] Fysisk sofaduell: oppstart, spørsmål, fasit og skjult overlevering.
- [x] Offentlig quizkrutt-mappe i GitHub app-page, med tre publiserte sider.
- [x] Apple-validering bestått etter brukerens godkjenning av distribusjonssignering.
- [x] Betaopplysninger og reviewkontakt lagret hos Apple.
- [x] Opplasting bekreftet i App Store Connect: 0.5.0 (6), «Processing».
- [ ] Ferdig Apple-prosessering og tilknytning til intern testgruppe.

Ingen offentlig App Store-innsending. Privat innlogging er fortsatt utsatt.


### TestFlight-kontroll 12. november 2026

Apple viser bygg 0.5.0 (6) som «Complete» og «Ready to Test».
Bygget er lagt til den eksisterende interne gruppen «Internal»; gruppen er
markert valgt på bygget. Ingen nye testere er invitert i denne kontrollen.
Dokumentasjon: `ios/Distribution/preview-testflight-build6-ready.png` (fra prosjektroten).


## I6 / M7 - nullstilling og felles quizbibliotek (13. november 2026)

- [x] iOS 0.6.0 (7): nullstill solo eller pakkehistorikk etter bekreftelse.
- [x] Web: nullstill lokal solo- og pakkefremdrift etter bekreftelse.
- [x] Pakker og innstillinger beholdes; andre enheter påvirkes ikke.
- [x] Offentlig GitHub Pages-katalog deles mellom web og iOS uten konto.
- [x] Åtte pakker / 140 pakkespørsmål, inkludert Historie og Mat og drikke.
- [x] Medfølgende seks pakker fungerer fortsatt uten nett; hentede pakker lagres lokalt.
- [x] Filstørrelse, format og SHA-256 kontrolleres før pakker installeres.
- [x] Webtester og Swift-motortester; simulatorhenting på iPhone 17 og iPad Pro 13 M5.
- [x] iPhone: lastet ned historiepakken, svart riktig (+100), pauset og nullstilt pakkehistorikk; installert pakke bevart på disk.
- [x] Web: kataloghenting, ny kategori, nedlasting, spill og nullstilling med bevart pakke også etter omlasting.
- [x] 0.6.0 (7) Apple-validert og lastet opp til intern TestFlight.
- [x] Bygg 7 viser Testing og er knyttet til eksisterende Internal-gruppe.
- [x] Privat Sites-webversjon 7 publisert, bekreftet live med nye bibliotekstemaer.

Ingen nye innloggingskrav. Nettduell er fortsatt deaktivert i iOS-betaen.
Eksisterende brukerfremdrift ble ikke nullstilt under utviklingen: egne simulator-app-IDer og egen webopprinnelse ble brukt.


## I7 - nettduell uten ChatGPT-konto

- [x] Bruker valgte kallenavn og romkode uten konto.
- [x] Separat Sites-server og database opprettet og publisert privat.
- [x] iOS 0.7.0 (8) klargjort med native nettduell, ny Keychain-service og personvernmanifest.
- [x] Bygg og 27 Swift-tester består; native grensesnitt kontrollert i simulator.
- [x] Ny nettduellserver offentlig etter brukerens uttrykkelige godkjenning.
- [x] Full produksjonskamp med to native klienter uten konto, omstart, gjenforsøk og avbrudd.
- [x] Personvern/support og Apple-betaopplysninger publisert for 0.7.0.
- [x] 0.7.0 (8) Apple-validert, lastet opp og aktiv i eksisterende Internal-gruppe (Testing).


## I8 – App Store-klargjøring 1.0 (9)

- [x] Lanseringsnummer, arkiv, lokal kontroll og Apple-validering.
- [x] Bygg 9 lastet opp, valgt for butikkversjonen og knyttet til Internal.
- [x] Ti ekte butikkbilder for iPhone og iPad lastet opp og behandlet.
- [x] Norsk butikktekst, Games/Trivia, beregnet aldersvurdering og manuell publisering.
- [x] Gratispris og alle land valgt etter eierens ønske; lokale Apple-begrensninger gjelder.
- [x] App Privacy publisert etter eierens bekreftelse.
- [x] Stor tekst på begge simulatorer og liggende iPad kontrollert.
- [x] Fysisk TestFlight-sluttest av bygg 9, lyttetest med VoiceOver bekreftet av Terje på begge, iPad multitasking og full nettduell med identiske resultater.
- [x] Eier godkjente innsending; Apple bekreftet 1 Item Submitted for 1.0 (9), 13. november 2026. Manuell publisering beholdt.

Se ios/Distribution/VALIDATION.md og APP_STORE_METADATA.nb.md. Ingen App Store-innsending eller offentlig lansering er utført.
