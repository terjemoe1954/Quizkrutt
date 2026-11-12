# Butikk- og TestFlight-tekst – 0.5.0 (6)

Utkast klart til gjennomgang. Ingen tekst eller kontaktinformasjon er sendt til Apple.
Nettduell er ikke aktiv i dette bygget og annonseres ikke som en tilgjengelig funksjon.

## App Store

- Navn: Quizkrutt
- Undertittel: Små spørsmål. Store aha!
- Primærspråk: Norsk bokmål
- Hovedkategori: Spill / Quiz (velg tilgjengelig tilsvarende kategori i App Store Connect)
- Sekundær spillkategori: Familie, kun hvis sluttkontroll og aldersvurdering støtter det
- Nøkkelord: quiz,kunnskap,spørsmål,norsk,sofaduell,hjernetrim,offline,allmennkunnskap
- Supportkontakt: terjemoe54@hotmail.com
- Personvernkontakt: terjemoe54@hotmail.com
- Support-URL: https://terjemoe1954.github.io/app-page/quizkrutt/support/
- Personvern-URL: https://terjemoe1954.github.io/app-page/quizkrutt/privacy/
- Copyright: 2026 Terje Moe (bekreft rettighetshaver før innsending)
- Tilgjengelighet: Ikke erklær full VoiceOver-støtte før I4s fysiske lyttetest er ferdig.

### Beskrivelse

Gi hjernen din litt konfetti!

Quizkrutt er en norsk quizapp for små pauser og store aha-opplevelser.
Velg mellom seks kategorier og tre nivåer. Spill ti spørsmål uten tidspress,
les forklaringene og samle merker mens du lærer noe nytt.

• 540 spørsmål i grunnspillet og 120 ekstra spørsmål i seks medfølgende quizpakker.
• Seks temaer: Litt av alt, Verden rundt, Dyr og natur, Film og musikk,
  Sport og spill samt Vitenskap og teknologi.
• Tre nivåer. Sju riktige av ti åpner neste nivå i samme kategori.
• Pause og fortsett senere – fremdriften lagres på enheten.
• Sofaduell: to spillere bytter på samme telefon eller iPad.
• Spill uten nett og uten konto. Ingen annonser eller kjøp i appen.

Quizpakkene følger med appen og kan legges til i biblioteket uten nedlasting.
Nye medfølgende pakker leveres gjennom appoppdateringer.
Spørsmålene er egenformulert med KI-støtte og er under redaksjonell kvalitetssikring.

### Nytt i denne versjonen

Første iOS-beta: norsk quiz med tre nivåer, lokale quizpakker og sofaduell.
Tilpasset stor tekst og iPad. Nettduell kommer senere.

## TestFlight

### Betabeskrivelse

Første offline-beta av Quizkrutt for iPhone og iPad. Solo, seks medfølgende
quizpakker og sofaduell på samme enhet kan testes uten konto.
Nettduell er ikke aktiv. Fremdrift lagres lokalt; sletting av appen kan fjerne den.

### Hva skal testes?

1. Spill solo i flere kategorier. Kontroller fasit, forklaringer og nivååpning ved 700 poeng.
2. Pause, lukk og åpne appen. Kontroller at fremdrift og besvarte spørsmål beholdes.
3. Legg til en quizpakke, spill og prøv fjerning/gjeninnlegging med historikken bevart.
4. Spill sofaduell med to ulike navn. Kontroller at forrige spørsmål skjules ved overlevering.
5. Prøv største tekst, VoiceOver og stående/liggende visning på iPhone/iPad.
6. Meld inn feil i spørsmål og layout via TestFlight. Oppgi versjon og enhetsmodell.
   Ikke send passord eller innloggingskoder.

### Review notes (English)

Quizkrutt 0.5.0 (6) is an offline Norwegian quiz app. No account or sign-in is
required. Solo quiz, bundled quiz packs and pass-and-play sofa duels are available.
Online duel is explicitly marked as coming later and cannot be opened in this build.
There are no ads, purchases, subscriptions or external downloads.

To test: choose a category, select Nybegynner, answer the questions. Quizpakker
opens the bundled library. Sofaduell takes two distinct nicknames and starts a
pass-and-play game. Settings contains help and privacy information.

Do not submit these notes for a future build that enables online play without
updating privacy information, providing reviewer access and completing private login tests.

## Må fylles ut i App Store Connect

- Utviklerprogrammedlemskap/rolle, appoppføring og eierskap til no.quizkrutt.ios.
- Reviewkontakt: Terje Moe og oppgitt e-post; telefonnummer må fylles inn av eier.
- Offentlig personvern- og support-URL (må kunne åpnes uten privat Sites-innlogging).
- Aldersspørreskjema basert på gjennomgått faktisk innhold, ikke automatisk 4+.
- Pris, land/regioner, rettigheter og eventuell næringsdrivendestatus i EU.
- App Privacy: offline-beta har ingen datainnsamling fra appen. Apple/TestFlight
  behandler egen beta-/diagnostikkinformasjon. Gjennomgå på nytt ved nye SDK-er/nettduell.
- Eksport: bare Apples OS-funksjoner for HTTPS/Keychain/hash, ingen egen kryptering.
  Info.plist har ITSAppUsesNonExemptEncryption=false; bekreft mot endelig bygg og Apples spørsmål.
