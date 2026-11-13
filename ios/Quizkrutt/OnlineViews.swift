import SwiftUI

@MainActor enum OnlineConfiguration {
    static let localTest: Bool = {
        #if DEBUG && targetEnvironment(simulator)
        return ProcessInfo.processInfo.environment["QUIZKRUTT_LOCAL_SERVER"] == "1"
        #else
        return false
        #endif
    }()
    static var origin: URL {URL(string:localTest ? "http://127.0.0.1:4174":"https://quizkrutt-online.terjemoe54.chatgpt.site")!}
    static func transport() -> HTTPOnlineTransport {HTTPOnlineTransport(origin:origin)}
    static func store() -> OnlineStore {
        OnlineStore(transport:transport(),vault:KeychainOnlineVault(service:localTest ? "no.quizkrutt.online.local-v1":"no.quizkrutt.online.anonymous-v1"))
    }
}

struct OnlineHubView: View {
    @EnvironmentObject var online: OnlineStore
    @EnvironmentObject var store: GameStore
    @Environment(\.scenePhase) private var scenePhase
    @State private var name = ""
    @State private var code = ""
    @State private var category = "mix"
    @State private var level = 0
    @State private var confirmCancel = false
    var body: some View {
        ScrollView {
            VStack(alignment:.leading,spacing:22) {
                if OnlineConfiguration.localTest {Label("Lokal servertest · ikke produksjon",systemImage:"hammer.fill").font(.footnote.bold())}
                if online.selected == nil {hub} else {roomContent}
                if online.busy {ProgressView("Kontakter serveren …").frame(maxWidth:.infinity)}
                if let error = online.error {Text(error).foregroundStyle(.red).accessibilityLabel("Status: "+error)}
                Text("Nett kreves. Invitasjon: 24 timer. Duell: sju dager. Kallenavn og svar lagres på serveren. Spilleradgang huskes i denne appens nøkkelring. Grunnspill og pakker påvirkes ikke.").font(.footnote).foregroundStyle(Color.muted)
            }.padding(22).frame(maxWidth:680,alignment:.leading).frame(maxWidth:.infinity)
        }.background(Color.paper).foregroundStyle(Color.ink).navigationTitle("Nettduell").navigationBarTitleDisplayMode(.inline)
            .confirmationDialog("Avslutte duellen for begge?",isPresented:$confirmCancel,titleVisibility:.visible) {
                Button("Avslutt duellen for begge",role:.destructive) {Task {await online.cancel()}}
                Button("Fortsett",role:.cancel) {}
            } message: {Text("Ingen vinner kåres. Den andre spilleren får beskjed når status oppdateres.")}
            .task(id:"\(scenePhase == .active)-\(online.selected?.uuidString ?? "hub")") {
                guard scenePhase == .active else {return}
                while !Task.isCancelled, online.selected != nil {
                    if online.entry?.roomID != nil, online.room?.terminal != true {await online.refresh()}
                    do {try await Task.sleep(for:.seconds(10))} catch {return}
                }
            }
    }
    var hub: some View {
        VStack(alignment:.leading,spacing:22) {
            Text("Hver deres telefon. Samme quizkrutt.").font(.system(.largeTitle,design:.rounded,weight:.heavy))
            Text("Opprett et rom og del romkoden. Spill fem felles spørsmål når det passer dere. Fasit kommer først når begge har svart.").foregroundStyle(Color.muted)
            Text("Ingen konto kreves. Bruk et kallenavn, ikke fullt navn. Del romkoden bare med den du vil spille med.").font(.footnote)
            VStack(alignment:.leading,spacing:16) {
                Text("Ditt kallenavn").font(.headline)
                TextField("Kallenavn for nettduell",text:$name).textFieldStyle(.roundedBorder).accessibilityLabel("Kallenavn for nettduell")
                Picker("Kategori",selection:$category) {if let b = store.bank {ForEach(b.categories) {Text($0.name).tag($0.id)}}}
                Picker("Nivå",selection:$level) {if let b = store.bank {ForEach(0..<3,id:\.self) {Text(b.levelNames[$0]).tag($0)}}}
                Button("Opprett nettduell",systemImage:"plus.circle.fill") {Task {await online.begin(name:name,category:category,level:level)}}.buttonStyle(KruttButton()).disabled(online.busy || online.storageBlocked)
                Divider()
                Text("Har du en romkode?").font(.headline)
                TextField("Romkode med åtte tegn",text:$code).textFieldStyle(.roundedBorder).textInputAutocapitalization(.characters).autocorrectionDisabled().accessibilityLabel("Romkode med åtte tegn")
                Button("Bli med i nettduellen",systemImage:"person.badge.plus") {Task {await online.begin(name:name,code:code)}}.buttonStyle(KruttButton(prominent:false)).disabled(online.busy || online.storageBlocked)
            }.padding(20).background(.white,in:RoundedRectangle(cornerRadius:22))
            if !online.ledger.entries.isEmpty {
                Text("Dueller på denne enheten").font(.title2.bold())
                ForEach(online.ledger.entries) {e in
                    Button {Task {await online.resume(e.id)}} label: {
                        VStack(alignment:.leading,spacing:6) {
                            Text(e.name).font(.headline)
                            Text(e.code.map {"Rom \($0)"} ?? "Oppretting ikke bekreftet")
                            Text(e.createdAt,format:.dateTime.day().month().hour().minute()).font(.caption)
                        }.frame(maxWidth:.infinity,alignment:.leading)
                    }.buttonStyle(KruttButton(prominent:false)).disabled(online.busy)
                }
            }
        }
    }
    @ViewBuilder var roomContent: some View {
        Button("Tilbake til nettdueller",systemImage:"arrow.left") {online.leave()}.frame(minHeight:44).disabled(online.busy)
        if let room = online.room, let e = online.entry {
            Text("ROM \(room.code) · \(store.bank?.levelNames[room.level] ?? "")").font(.caption.bold())
            Text("\(room.names[0] ?? "Vert") ↔ \(room.names[1] ?? "Venter på en venn")").font(.headline)
            Text("Du spiller som \(room.names[room.player] ?? e.name)").font(.subheadline)
            if ["cancelled","expired","invite-expired"].contains(room.status) {
                Text(room.status == "cancelled" ? "Duellen er avsluttet":"Duellen har utløpt").font(.largeTitle.bold())
                Text("Opprett en ny nettduell for å spille igjen. Ingen vinner kåres ved avbrudd eller utløp.")
            } else if room.status == "waiting" {
                Text("Gi vennen romkoden.").font(.largeTitle.bold())
                Text(room.code).font(.system(.largeTitle,design:.monospaced,weight:.heavy)).textSelection(.enabled).accessibilityLabel("Romkode "+room.code.map(String.init).joined(separator:" "))
                ShareLink(item:room.code) {Label("Del romkoden",systemImage:"square.and.arrow.up")}.buttonStyle(KruttButton())
                Text("Vennen åpner Nettduell i sin app og skriver koden og et annet kallenavn.")
            } else if e.reviewed < room.reviews.count {
                let review = room.reviews[e.reviewed]
                Text("Begge har svart · spørsmål \(review.index+1) av 5").font(.caption.bold())
                Text(review.answers[room.player] == review.correct ? "Helt riktig!":"Et lite aha rikere.").font(.largeTitle.bold())
                Text(review.question).font(.title2.bold())
                Text("Riktig svar: \(review.options[review.correct])").font(.headline)
                Text(review.explanation)
                ForEach(0..<2,id:\.self) {p in Text("\(room.names[p] ?? "Spiller"): \(review.answers[p] == review.correct ? 100:0) poeng")}
                Button(review.index == 4 ? "Se nettduellresultatet":"Neste nettspørsmål") {online.acknowledge()}.buttonStyle(KruttButton()).disabled(online.busy)
            } else if room.status == "finished" {
                let winner = room.scores[0] == room.scores[1] ? nil:room.scores[0] > room.scores[1] ? 0:1
                Text(winner.map {"\(room.names[$0] ?? "Spilleren") vant!"} ?? "Uavgjort!").font(.largeTitle.bold())
                ForEach(0..<2,id:\.self) {p in
                    VStack(alignment:.leading,spacing:10) {Text(room.names[p] ?? "Spiller").font(.title2.bold()); Text("\(room.scores[p]) / 500 poeng").font(.title.bold())}.padding(20).frame(maxWidth:.infinity,alignment:.leading).background(p == 0 ? Color.lime.opacity(0.5):Color(hex:"#ede6f3"),in:RoundedRectangle(cornerRadius:20))
                }
                Text("Serveren har bekreftet begge resultatene.")
            } else if let q = room.question {
                if let answer = room.ownAnswer ?? e.pendingAnswer?.choice {
                    Text(room.ownAnswer != nil ? "Svaret er lagret.":"Svaret er ikke bekreftet.").font(.largeTitle.bold())
                    Text(q.question).font(.title2.bold())
                    Text("Ditt valg: \(q.options[answer])").font(.headline)
                    Text("Fasiten vises når begge har svart.")
                    if e.pendingAnswer != nil {Button("Send samme svar igjen") {Task {await online.retryAnswer()}}.buttonStyle(KruttButton()).disabled(online.busy)}
                } else {
                    Text("Spørsmål \(q.index+1) av 5").font(.caption.bold())
                    Text(q.question).font(.system(.title,design:.rounded,weight:.bold)).accessibilityAddTraits(.isHeader)
                    ForEach(0..<4,id:\.self) {index in
                        Button(q.options[index]) {Task {await online.answer(index)}}.buttonStyle(KruttButton(prominent:false)).disabled(online.busy)
                    }
                    Text(room.opponentAnswered ? "Vennen din har svart. Nå er det din tur.":"Dere kan svare når det passer. Ingen tidspress.").font(.footnote)
                }
            }
            if !room.terminal {Button("Avslutt nettduellen for begge",role:.destructive) {confirmCancel = true}.frame(minHeight:44).disabled(online.busy)}
            Text("Duellen utløper \(Date(timeIntervalSince1970:room.expiresAt/1000).formatted(date:.abbreviated,time:.shortened)).").font(.footnote)
        } else if online.entry?.roomID == nil {
            Text("Ikke bekreftet ennå").font(.largeTitle.bold())
            Text("Spillernøkkelen er beholdt. Prøv samme oppretting eller innmelding igjen.")
            Button("Prøv samme forespørsel igjen") {Task {await online.retryPending()}}.buttonStyle(KruttButton()).disabled(online.busy)
        } else {Text("Henter duellen …").font(.title.bold())}
        if online.entry?.roomID != nil {Button("Oppdater nettduellstatus",systemImage:"arrow.clockwise") {Task {await online.refresh()}}.buttonStyle(KruttButton(prominent:false)).disabled(online.busy)}
    }
}
