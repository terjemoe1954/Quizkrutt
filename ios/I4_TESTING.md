# I4 – iPhone, iPad og tilgjengelighet

12. november 2026 · versjon 0.4.0 (4) · Xcode 27.2.
Status: implementert og delvis verifisert. Fysisk VoiceOver-lyttetest er fortsatt åpen.
Privat innlogging er utsatt etter brukerens ønske; ingen innlogging eller privat
nettduell er godkjent gjennom I4.

## Endringer

- Sentrert lesebredde på inntil 680 pt på iPad, uten høydebegrensning.
- Største Dynamic Type bruker vertikale svar og stablet poeng-/nivåinformasjon.
  Dekorative ikoner skjules ved tilgjengelighetsstørrelsene for å gi teksten plass.
- Svar har A–D, full alternativtekst og korrekt valgt-/fasitstatus. Ingen fasit
  finnes i alternativets tilgjengelighetsetikett før spilleren har svart.
- Feil svar gir eksplisitt riktig svar i tilbakemeldingen, også når forklaringen
  alene ikke nevner fasiten. Farger suppleres av tekst og symboler.
- VoiceOver-fokus på nye spørsmål, resultater og skjult sofaoverlevering.
- Besvarte alternativer beholder lesbar kontrast selv om de er deaktivert.
- Neste solospørsmål nullstiller rulleposisjonen, viktig ved stor tekst.
- Sofaduell presenteres med selve duellobjektet som tilstand. Retter observert
  tom førstegangsvisning på iPad når to separate tilstander ble oppdatert samtidig.
- iPad støtter alle fire orienteringer; fysisk byggs orienteringsadvarsel rettet.

## Verifisert

| Enhet | Kontroller |
| --- | --- |
| Fysisk iPhone 15 Pro, iOS 27.2.1 | Signert installasjon, oppstart, forside → spilleregler → tilbake. |
| Fysisk iPad (10. generasjon), iPadOS 27.2.1 | Signert installasjon, oppstart, forside → quizpakker. Bibliotek med tekststørrelse 3 og 11, stående og liggende. |
| iPhone 17-simulator, iOS 27.2 | Største tekst 11, lagret solo gjenopptatt, svar/fasit, tydelig deaktivert svar og neste spørsmål øverst. VoiceOver-fokusramme på nytt spørsmål, berøring velger alternativ og dobbelttrykk avgir svar. |
| iPad Pro 13 M5-simulator, iPadOS 27.2 | Normal forside, største tekst 11 i sofaduelloppsett, oppstart, spørsmål, svar/fasit. VoiceOver-fokusramme på neste spillers overlevering. Spørsmål og svar er fjernet fra overleveringens tilgjengelighetstre. |

24 Swift-tester består, 2 valgfrie integrasjonstester er hoppet over (26 totalt,
0 feil). De tre nye I4-testene dekker etiketter før/etter svar og eksplisitt fasit
i opplesingsteksten. I3s retry-test sammenligner dekodet innhold i stedet for
JSON-feltrekkefølge. Ingen nettverksadferd er endret av denne testrettelsen.
Debug for simulator og begge fysiske mål samt Release for iOS bygger uten
feil eller advarsler i sluttloggene. Ingen App Store-/TestFlight-opplasting.

Eksisterende Apple Development-signering ble brukt lokalt. Ingen nye kontoer,
sertifikater eller provisjoneringsrettigheter ble opprettet. Oppdateringer ble
installert uten avinstallasjon. Solorunden på iPhone-simulatoren ble bevart.
Ingen simulatorer ble nullstilt eller stoppet. Tekststørrelse og VoiceOver ble
satt tilbake til observerte utgangsverdier (3 / av).

## Begrensninger og manuell sluttkontroll

- På fysisk iPad ble VoiceOver slått på, men Device Hub kom ikke videre fra
  Apples førstegangsveiledning med fjerntrykk. VoiceOver ble slått av igjen.
- Faktisk lyd/uttale og sammenhengende sveipenavigasjon er ikke lyttet til.
  Fokusramme, tilgjengelighetstre og motorens opplesingstekster er verifisert;
  dette er ikke det samme som en fysisk lyttetest.
- Kjør en hel solo-, pakke- og sofaduell med VoiceOver på fysisk enhet: lytt til
  spørsmål, alle alternativer, valgt svar, fasit og resultat. Kontroller at neste
  spørsmål får fokus og at overlevering aldri leser forrige spørsmål.
- Full fysisk pakkerunde/duell, iPad multitasking, låseskjerm/appvelger og kjøring
  på minimumsversjon iOS 17 gjenstår før lansering.
- Privat innlogging/to kontoer og nettduell på to fysiske telefoner tilhører
  den utsatte I3-akseptansen. App Store Connect, personvern og TestFlight er I5.

## Skjermbilder

- [iPad-forside](preview-i4-ipad-home.png)
- [Største tekst: neste spørsmål øverst](preview-i4-iphone-large.png)
- [VoiceOver: fokus på spørsmål](preview-i4-voiceover-focus.png)
- [VoiceOver: skjult overlevering](preview-i4-ipad-voiceover.png)
