import SwiftUI

struct PrivacyView: View {
    var body: some View {
        List {
            Section("Spill på enheten") {
                Text("Solo, quizpakker og innstillinger lagres lokalt. Appen har ingen annonser, sporing eller tredjeparts analyseverktøy. Ingen konto kreves for disse spillene.")
                Text("De seks quizpakkene følger med appen. Å legge dem til sender ingen data. Sofaduellens kallenavn og svar beholdes bare mens duellen pågår.")
                Text("Enhetens sikkerhetskopiering kan omfatte lokale appdata. Sletting av appen kan fjerne fremdriften. Ingen synkronisering med nettversjonen tilbys.")
            }
            if AppReleaseInfo.onlineEnabled {
            Section("Nettduell – privat test") {
                Text("Hvis du bruker nettduell, sendes kallenavn og svar til Quizkrutt-serveren. Romkode, spillstatus og tilfeldige spiller-ID-er brukes for å gjennomføre kampen. Romadgang lagres beskyttet i enhetens nøkkelring.")
                Text("Privat tilgang bruker ChatGPT/Sites-innlogging i en nettleservisning. Leverandøren behandler innloggingsopplysninger etter sine egne vilkår. Quizkrutt har ingen egen passordregistrering.")
                Text("Rom utløper etter sju dager. Utløp betyr ikke at alle serverdata er slettet umiddelbart. Kontakt oss ved spørsmål om lagring eller sletting.")
            }
            }
            Section("Full personvernerklæring") {
                Link("Les personvernerklæringen på nett",destination:AppReleaseInfo.privacyURL)
            }
            Section("Kontakt") {
                Link(AppReleaseInfo.contact,destination:AppReleaseInfo.contactURL)
                Text("Behandlingsansvarlig: Terje Moe. Oppdatert 12. november 2026.")
            }
        }.navigationTitle("Personvern")
    }
}

struct SupportView: View {
    var body: some View {
        List {
            Section("Kom i gang") {
                Text("Velg kategori og Nybegynner. Du får 100 poeng per riktig svar. 700 poeng åpner neste nivå. Pause lagrer runden automatisk.")
                Text("Quizpakker legges til fra biblioteket uten nett. Sofaduell spilles på samme enhet. Gi telefonen videre først når skjermen ber om det.")
            }
            Section("Tilbakemelding i TestFlight") {
                Text("Åpne TestFlight, velg Quizkrutt og bruk Send betatilbakemelding. Ta gjerne med versjon, enhetsmodell, kategori og spørsmålet som trenger retting. Ikke send passord, innloggingskoder eller romnøkler.")
            }
            Section("Hvis noe stopper") {
                Text("Gå tilbake og prøv igjen. Ved lagringsfeil: ikke slett appen, siden lokal fremdrift kan gå tapt. Uleselige lagringsfiler bevares av appen.")
                Text("Nettduell kommer senere. Solo, pakker og sofaduell trenger ingen innlogging.")
            }
            Section("Kontakt support") {
                Link("Åpne supportsiden",destination:AppReleaseInfo.supportURL)
                Link(AppReleaseInfo.contact,destination:AppReleaseInfo.contactURL)
            }
        }.navigationTitle("Hjelp")
    }
}
