import SwiftUI

struct PrivacyView: View {
    var body: some View {
        List {
            Section("Spill på enheten") {
                Text("Solo, quizpakker og innstillinger lagres lokalt. Appen har ingen annonser, sporing eller tredjeparts analyseverktøy. Ingen konto kreves for disse spillene.")
                Text("De seks første quizpakkene følger med appen. Nye pakker kan hentes fra GitHub Pages uten konto. GitHub mottar vanlige forbindelsesopplysninger, som IP-adresse og forespurt fil; ingen spillresultater sendes. Sofaduellens kallenavn og svar beholdes bare mens duellen pågår.")
                Text("Enhetens sikkerhetskopiering kan omfatte lokale appdata. Sletting av appen kan fjerne fremdriften. Ingen synkronisering med nettversjonen tilbys.")
            }
            if AppReleaseInfo.onlineEnabled {
            Section("Nettduell uten konto") {
                Text("Hvis du bruker nettduell, sendes kallenavn og svar til Quizkrutt-serveren. Romkode, spillstatus og tilfeldige spiller-ID-er brukes for å gjennomføre kampen. Romadgang lagres beskyttet i enhetens nøkkelring.")
                Text("Nettduell bruker en separat server hos Sites/Cloudflare. Ingen ChatGPT-konto eller passord kreves. Serverdriften behandler vanlige forbindelsesopplysninger, og korte begrensninger av forespørsler brukes mot misbruk. Bruk et kallenavn, ikke fullt navn.")
                Text("Rom utløper etter sju dager. Utløp betyr ikke at alle serverdata er slettet umiddelbart. Kontakt oss ved spørsmål om lagring eller sletting.")
            }
            }
            Section("Full personvernerklæring") {
                Link("Les personvernerklæringen på nett",destination:AppReleaseInfo.privacyURL)
            }
            Section("Kontakt") {
                Link(AppReleaseInfo.contact,destination:AppReleaseInfo.contactURL)
                Text("Behandlingsansvarlig: Terje Moe. Oppdatert 13. november 2026.")
            }
        }.navigationTitle("Personvern")
    }
}

struct SupportView: View {
    var body: some View {
        List {
            Section("Kom i gang") {
                Text("Velg kategori og Nybegynner. Du får 100 poeng per riktig svar. 700 poeng åpner neste nivå. Pause lagrer runden automatisk.")
                Text("Medfølgende quizpakker legges til uten nett. Hent nye quizpakker fra biblioteket når du er på nett; nedlastede pakker virker deretter uten nett. Sofaduell spilles på samme enhet. Gi telefonen videre først når skjermen ber om det.")
            }
            Section("Tilbakemelding i TestFlight") {
                Text("Åpne TestFlight, velg Quizkrutt og bruk Send betatilbakemelding. Ta gjerne med versjon, enhetsmodell, kategori og spørsmålet som trenger retting. Ikke send passord, innloggingskoder eller romnøkler.")
            }
            Section("Hvis noe stopper") {
                Text("Gå tilbake og prøv igjen. Ved lagringsfeil: ikke slett appen, siden lokal fremdrift kan gå tapt. Uleselige lagringsfiler bevares av appen.")
                Text("Nettduell: velg kallenavn og opprett et rom eller skriv inn vennens romkode. Begge må ha nett. Solo, pakker og sofaduell fungerer fortsatt uten konto.")
            }
            Section("Kontakt support") {
                Link("Åpne supportsiden",destination:AppReleaseInfo.supportURL)
                Link(AppReleaseInfo.contact,destination:AppReleaseInfo.contactURL)
            }
        }.navigationTitle("Hjelp")
    }
}
