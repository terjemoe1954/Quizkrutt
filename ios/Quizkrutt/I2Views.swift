import SwiftUI
import UIKit

@MainActor final class PackStore: ObservableObject {
    @Published var catalog: [PackEntry] = []
    @Published var library = PackLibrary()
    @Published var error: String?
    @Published var blocked = false
    private let disk = PackDisk(file:URL.applicationSupportDirectory.appending(path:"Quizkrutt/packs-v1.json"))
    init() {
        do {
            guard let url = Bundle.main.url(forResource:"pack-catalog",withExtension:"json") else {throw QuizError.invalidData}
            catalog = try JSONDecoder().decode([PackEntry].self,from:Data(contentsOf:url))
            guard Set(catalog.map(\.id)).count == catalog.count else {throw QuizError.invalidData}
            library = try disk.load()
        } catch {blocked = true; self.error = "Pakkebiblioteket kunne ikke leses. Eksisterende data er bevart og blir ikke overskrevet. Solospillet kan fortsatt brukes."}
    }
    // Installation/removal is committed to disk before publishing the new library.
    private func commit(_ next: PackLibrary) {
        guard !blocked else {return}
        do {try disk.save(next); library = next; error = nil}
        catch {self.error = "Endringen kunne ikke lagres. Biblioteket er uendret. Frigjør plass og prøv igjen."}
    }
    func install(_ entry: PackEntry) {
        guard !blocked else {return}
        do {
            let filename = "\(entry.id).v\(entry.version)"
            guard let url = Bundle.main.url(forResource:filename,withExtension:"json") else {throw QuizError.invalidData}
            var next = library; try next.install(Data(contentsOf:url),entry:entry); commit(next)
        } catch {self.error = "Pakken kunne ikke kontrolleres. Tidligere innhold og resultater er beholdt."}
    }
    func remove(_ id: String) {var next = library; next.remove(id); commit(next)}
    func start(_ id: String) {
        guard !blocked else {return}
        do {var next = library; try next.start(id); commit(next)}
        catch {self.error = "Fortsett den påbegynte pakkerunden først."}
    }
    func retrySave() {
        guard !blocked else {return}
        do {try disk.save(library); error = nil}
        catch {self.error = "Pakkerunden er i minnet, men kunne ikke lagres. Prøv lagring igjen før du lukker appen."}
    }
    func answer(_ choice: Int) {guard !blocked else {return}; if library.answer(choice) {retrySave()}}
    func advance() -> Int? {guard !blocked else {return nil}; let score = library.advance(); retrySave(); return score}
}

/// Shared native question renderer. Handover screens never construct this view.
struct NativeQuestionPanel: View {
    let question: Question
    let order: [Int]
    let choice: Int?
    let answer: (Int) -> Void
    @AppStorage("quizkrutt.haptics") private var haptics = false
    @Environment(\.dynamicTypeSize) private var textSize
    @AccessibilityFocusState(for:.voiceOver) private var questionFocused: Bool
    private var correct: Int {order.firstIndex(of:question.correct)!}
    init(card: SnapshotCard, choice: Int?, answer: @escaping (Int) -> Void) {
        self.init(question:card.question,order:card.order,choice:choice,answer:answer)
    }
    init(question: Question, order: [Int], choice: Int?, answer: @escaping (Int) -> Void) {
        self.question = question; self.order = order; self.choice = choice; self.answer = answer
    }
    var body: some View {
        VStack(alignment:.leading,spacing:16) {
            Text(question.question).font(.system(.title,design:.rounded,weight:.bold)).fixedSize(horizontal:false,vertical:true)
                .accessibilityAddTraits(.isHeader).accessibilityFocused($questionFocused)
            ForEach(0..<4,id:\.self) {index in
                let right = index == correct
                Button {
                    answer(index)
                    if haptics {UINotificationFeedbackGenerator().notificationOccurred(right ? .success:.warning)}
                    UIAccessibility.post(notification:.announcement,argument:QuizAccessibility.feedback(right:right,correctAnswer:question.options[question.correct],explanation:question.explanation))
                } label: {
                    let layout = textSize.isAccessibilitySize ? AnyLayout(VStackLayout(alignment:.leading,spacing:12)):AnyLayout(HStackLayout(alignment:.top,spacing:12))
                    layout {
                        Text(String(UnicodeScalar(65+index)!)).font(.caption.bold()).padding(8).background(Color.paper,in:RoundedRectangle(cornerRadius:8))
                        Text(question.options[order[index]]).fixedSize(horizontal:false,vertical:true).frame(maxWidth:.infinity,alignment:.leading)
                        if choice != nil && (right || choice == index) {Image(systemName:right ? "checkmark.circle.fill":"xmark.circle.fill")}
                    }.padding(16).frame(maxWidth:.infinity,minHeight:64,alignment:.leading)
                        .background(choice != nil && right ? Color.lime : Color.white,in:RoundedRectangle(cornerRadius:16))
                        .overlay(RoundedRectangle(cornerRadius:16).stroke(Color.ink.opacity(0.4)))
                }.buttonStyle(QuizAnswerStyle()).disabled(choice != nil)
                    .accessibilityLabel(QuizAccessibility.answerLabel(option:question.options[order[index]],index:index,choice:choice,correct:correct))
            }
            if let choice {
                VStack(alignment:.leading,spacing:10) {
                    Text(choice == correct ? "✦ Helt riktig! +100 poeng":"Et lite aha på veien.").font(.headline)
                    Text("Riktig svar: \(question.options[question.correct])").font(.headline)
                    Text(question.explanation).foregroundStyle(Color.muted)
                }.accessibilityElement(children:.combine)
            }
        }.onAppear {questionFocused = true}
    }
}

struct PackLibraryView: View {
    @EnvironmentObject var packs: PackStore
    @EnvironmentObject var store: GameStore
    @State private var playing = false
    @State private var removeEntry: PackEntry?
    @State private var category = "all"
    @State private var level = -1
    @State private var installedOnly = false
    var filtered: [PackEntry] {packs.catalog.filter {(category == "all" || $0.category == category) && (level == -1 || $0.level == level) && (!installedOnly || packs.library.installed[$0.id] != nil)}}
    var body: some View {
        ScrollView {
            VStack(alignment:.leading,spacing:22) {
                Text("Finn ditt neste aha.").font(.system(.largeTitle,design:.rounded,weight:.heavy)).accessibilityAddTraits(.isHeader)
                Text("Seks pakker. 120 nye spørsmål. Legg til favorittene og spill dem her i appen.").foregroundStyle(Color.muted)
                Label("Pakkene følger med appen. Å legge dem til krever ikke nett.",systemImage:"wifi.slash").font(.footnote).padding().background(Color.lime.opacity(0.3),in:RoundedRectangle(cornerRadius:15))
                if let active = packs.library.active {
                    VStack(alignment:.leading,spacing:12) {
                        Text("Påbegynt: \(active.entry.title)").font(.headline)
                        Text("Spørsmål \(active.index+1) av 10 · \(active.score) poeng")
                        Button("Fortsett pakkerunden") {playing = true}.buttonStyle(KruttButton())
                    }.padding(18).background(.white,in:RoundedRectangle(cornerRadius:20))
                }
                VStack(alignment:.leading,spacing:14) {
                    Picker("Tema",selection:$category) {
                        Text("Alle temaer").tag("all")
                        if let bank = store.bank {ForEach(bank.categories) {Text($0.name).tag($0.id)}}
                    }
                    Picker("Nivå",selection:$level) {
                        Text("Alle nivåer").tag(-1)
                        ForEach(0..<3,id:\.self) {Text(store.bank?.levelNames[$0] ?? "Nivå \($0+1)").tag($0)}
                    }
                    Toggle("Bare lagt til",isOn:$installedOnly)
                }.padding().background(.white.opacity(0.7),in:RoundedRectangle(cornerRadius:18))
                if let error = packs.error {
                    Text(error).foregroundStyle(.red)
                    if !packs.blocked {Button("Prøv lagring igjen") {packs.retrySave()}}
                }
                ForEach(filtered) {entry in
                    packCard(entry)
                }
                if filtered.isEmpty {Text("Ingen pakker passer filteret. Prøv et annet tema eller nivå.")}
                Text("Alle pakkenivåer er tilgjengelige. Resultatene teller separat fra grunnspillets merker. Du kan fjerne en pakke og legge den til igjen uten å miste resultatene.").font(.footnote).foregroundStyle(Color.muted)
            }.padding(22).quizReadingWidth()
        }.background(Color.paper).foregroundStyle(Color.ink).navigationTitle("Quizpakker").navigationBarTitleDisplayMode(.inline)
            .fullScreenCover(isPresented:$playing) {PackRoundView()}
            .confirmationDialog("Fjern pakken fra biblioteket?",isPresented:Binding(get:{removeEntry != nil},set:{if !$0 {removeEntry = nil}}),titleVisibility:.visible) {
                if let entry = removeEntry {Button("Fjern \(entry.title)",role:.destructive) {packs.remove(entry.id); removeEntry = nil}}
                Button("Avbryt",role:.cancel) {removeEntry = nil}
            } message: {Text("Resultater og en påbegynt pakkerunde beholdes. Du kan legge til pakken igjen senere.")}
    }
    func packCard(_ entry: PackEntry) -> some View {
        let installed = packs.library.installed[entry.id] != nil
        let history = packs.library.history[entry.key]
        let cat = store.bank?.categories.first {$0.id == entry.category}
        return VStack(alignment:.leading,spacing:14) {
            HStack {Text(cat?.icon ?? "✳︎").font(.largeTitle).accessibilityHidden(true); Spacer(); Text("20 spørsmål · v\(entry.version)").font(.caption)}
            Text(entry.title).font(.title2.bold())
            Text(entry.description).foregroundStyle(Color.muted)
            Text("\(cat?.name ?? entry.category) · \(store.bank?.levelNames[entry.level] ?? "")").font(.subheadline.bold())
            if let history {Text("Beste: \(history.best)/1000 · \(history.rounds) \(history.rounds == 1 ? "runde":"runder")").font(.subheadline)}
            if installed {
                Label("Lagt til · klar uten nett",systemImage:"checkmark.circle.fill").font(.footnote).foregroundStyle(Color.muted)
                Button("Spill \(entry.title)") {packs.start(entry.id); playing = packs.library.active != nil}.buttonStyle(KruttButton()).disabled(packs.blocked || packs.library.active != nil)
                Button("Fjern pakke",role:.destructive) {removeEntry = entry}.frame(minHeight:44).disabled(packs.blocked)
            } else {
                Button("Legg til \(entry.title)",systemImage:"plus.circle") {packs.install(entry)}.buttonStyle(KruttButton()).disabled(packs.blocked)
            }
        }.padding(22).frame(maxWidth:.infinity,alignment:.leading).background(.white,in:RoundedRectangle(cornerRadius:23))
    }
}
struct PackRoundView: View {
    @EnvironmentObject var packs: PackStore
    @Environment(\.dismiss) private var dismiss
    @State private var finalScore: Int?
    @AccessibilityFocusState(for:.voiceOver) private var resultFocused: Bool
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment:.leading,spacing:22) {
                    if let points = finalScore {
                        Text(points >= 700 ? "En pakke med aha!":"Litt klokere allerede.").font(.largeTitle.bold()).accessibilityAddTraits(.isHeader).accessibilityFocused($resultFocused)
                        Text("\(points) / 1000 poeng").font(.title.bold())
                        Text("Resultatet er lagt til i pakkehistorikken. Grunnspillets merker er uendret.")
                        Button("Tilbake til pakkene") {dismiss()}.buttonStyle(KruttButton())
                    } else if let a = packs.library.active {
                        Text(a.entry.title).font(.headline)
                        QuizRoundMetadata(left:"Spørsmål \(a.index+1) av 10",right:"\(a.score) poeng")
                        ProgressView(value:Double(a.index),total:10).tint(Color.muted).accessibilityLabel("Fremdrift").accessibilityValue("\(a.index) av 10 spørsmål fullført")
                        NativeQuestionPanel(card:a.cards[a.index],choice:a.answers.count > a.index ? a.answers[a.index]:nil,answer:packs.answer).id(a.index)
                        if a.answers.count > a.index {
                            Button(a.index == 9 ? "Se pakkeresultatet":"Neste pakkespørsmål") {finalScore = packs.advance(); resultFocused = finalScore != nil}.buttonStyle(KruttButton())
                        }
                    }
                    if let error = packs.error {Text(error).foregroundStyle(.red); Button("Prøv lagring igjen") {packs.retrySave()}}
                }.padding(24).quizReadingWidth()
            }.id(packs.library.active?.index).background(Color.paper).foregroundStyle(Color.ink)
                .navigationTitle("Quizpakke").navigationBarTitleDisplayMode(.inline)
                .toolbar {ToolbarItem(placement:.topBarLeading) {Button(finalScore == nil ? "Pause pakkerunden":"Lukk") {dismiss()}}}
        }.interactiveDismissDisabled()
    }
}

private struct SofaPresentation: Identifiable {
    let id = UUID()
    let duel: SofaDuel
}

struct SofaSetupView: View {
    @EnvironmentObject var store: GameStore
    @State private var nameA = ""
    @State private var nameB = ""
    @State private var category = "mix"
    @State private var level = 0
    @State private var count = 5
    @State private var error: String?
    @State private var presentation: SofaPresentation?
    var body: some View {
        ScrollView {
            VStack(alignment:.leading,spacing:22) {
                Text("To hoder. Én telefon.").font(.system(.largeTitle,design:.rounded,weight:.heavy)).accessibilityAddTraits(.isHeader)
                Text("Hvem har mest quizkrutt? Bytt på telefonen og finn det ut.").foregroundStyle(Color.muted)
                VStack(alignment:.leading,spacing:16) {
                    Text("Spiller 1").font(.headline)
                    TextField("Kallenavn til spiller 1",text:$nameA).textContentType(.nickname).textFieldStyle(.roundedBorder).accessibilityLabel("Kallenavn til spiller 1")
                    Text("Spiller 2").font(.headline)
                    TextField("Kallenavn til spiller 2",text:$nameB).textContentType(.nickname).textFieldStyle(.roundedBorder).accessibilityLabel("Kallenavn til spiller 2")
                    Picker("Kategori",selection:$category) {if let b = store.bank {ForEach(b.categories) {Text($0.name).tag($0.id)}}}
                    Picker("Nivå",selection:$level) {if let b = store.bank {ForEach(0..<3,id:\.self) {Text(b.levelNames[$0]).tag($0)}}}
                    Picker("Spørsmål per spiller",selection:$count) {Text("5 hver").tag(5); Text("10 hver").tag(10)}
                }.padding(18).background(.white,in:RoundedRectangle(cornerRadius:20))
                if let error {Text(error).foregroundStyle(.red).accessibilityAddTraits(.isStaticText)}
                Button("Start sofaduell",systemImage:"person.2.fill") {
                    guard let bank = store.bank else {return}
                    do {
                        let duel = try SofaDuel(names:[nameA,nameB],category:category,level:level,count:count,bank:bank)
                        error = nil
                        presentation = SofaPresentation(duel:duel)
                    }
                    catch {self.error = "Bruk to ulike kallenavn på 1–20 tegn, uten kontrolltegn."}
                }.buttonStyle(KruttButton()).disabled(store.bank == nil)
                VStack(alignment:.leading,spacing:12) {
                    Text("Slik duellerer dere").font(.headline)
                    Text("• Tilfeldig startspiller. Dere svarer annenhver gang.\n• Like mange spørsmål fra hvert tema, uten felles spørsmål.\n• Skjermen skjules før telefonen bytter hender.\n• Duellen fungerer uten nett og endrer ingen solomerker.")
                    Text("Duellen og kallenavnene lagres ikke. Hvis appen lukkes eller startes på nytt, må dere begynne en ny duell.").font(.footnote).foregroundStyle(Color.muted)
                }.padding(18).background(Color(hex:"#ede6f3"),in:RoundedRectangle(cornerRadius:20))
            }.padding(22).quizReadingWidth()
        }.background(Color.paper).foregroundStyle(Color.ink).navigationTitle("Sofaduell").navigationBarTitleDisplayMode(.inline)
            .fullScreenCover(item:$presentation) {SofaGameView(duel:$0.duel)}
    }
}
struct SofaGameView: View {
    @State var duel: SofaDuel
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @State private var confirmQuit = false
    @AccessibilityFocusState(for:.voiceOver) private var handoverFocused: Bool
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment:.leading,spacing:24) {
                    if duel.phase == .finished {
                        Text(duel.winner.map {"\(duel.names[$0]) vant!"} ?? "Helt likt. Dobbelt quizkrutt!").font(.system(.largeTitle,design:.rounded,weight:.heavy)).accessibilityAddTraits(.isHeader).accessibilityFocused($handoverFocused)
                        ForEach(0..<2,id:\.self) {p in
                            VStack(alignment:.leading,spacing:12) {
                                Text(duel.names[p]).font(.title2.bold())
                                Text("\(duel.scores[p]) / \(duel.count*100) poeng").font(.title.bold())
                            }.padding(20).frame(maxWidth:.infinity,alignment:.leading).background(p == 0 ? Color.lime.opacity(0.5):Color(hex:"#ede6f3"),in:RoundedRectangle(cornerRadius:20))
                        }
                        Button("Spill omkamp") {rematch()}.buttonStyle(KruttButton())
                        Button("Tilbake til duelloppsettet") {dismiss()}.buttonStyle(KruttButton(prominent:false))
                    } else if duel.phase == .handover || scenePhase != .active {
                        // No card, question, choices, explanation or score in this branch's tree.
                        Image(systemName:"hand.raised.fill").font(.system(size:64)).foregroundStyle(Color.muted).accessibilityHidden(true)
                        Text("Gi telefonen til \(duel.names[duel.player]).").font(.system(.largeTitle,design:.rounded,weight:.heavy)).accessibilityAddTraits(.isHeader).accessibilityFocused($handoverFocused)
                        Text("Bare \(duel.names[duel.player]) skal se neste skjerm. Forrige spørsmål er skjult.").foregroundStyle(Color.muted)
                        Text("Runde \(duel.index+1) av \(duel.count)").font(.headline)
                        Button("Jeg er \(duel.names[duel.player]) – vis min tur") {duel.reveal()}.buttonStyle(KruttButton()).disabled(scenePhase != .active)
                    } else if let card = duel.visibleCard {
                        Text("\(duel.names[duel.player]) sin tur").font(.title2.bold())
                        Text("Spørsmål \(duel.index+1) av \(duel.count)").font(.subheadline)
                        NativeQuestionPanel(card:card,choice:duel.answers[duel.player].count > duel.index ? duel.answers[duel.player][duel.index]:nil,answer:{_ = duel.answer($0)}).id(duel.turn)
                        if duel.phase == .feedback {
                            Button(duel.turn == duel.count*2-1 ? "Se duellresultatet":"Skjul og gi videre") {duel.next(); handoverFocused = true}.buttonStyle(KruttButton())
                        }
                    }
                }.padding(24).frame(maxWidth:680,alignment:.leading).frame(maxWidth:.infinity)
            }.id(duel.turn).background(Color.paper).foregroundStyle(Color.ink).navigationTitle("Sofaduell").navigationBarTitleDisplayMode(.inline)
                .toolbar {ToolbarItem(placement:.topBarLeading) {Button("Avslutt duellen") {duel.hide(); confirmQuit = true}}}
                .confirmationDialog("Avslutte duellen?",isPresented:$confirmQuit,titleVisibility:.visible) {
                    Button("Avslutt uten resultat",role:.destructive) {dismiss()}
                    Button("Fortsett duellen",role:.cancel) {}
                } message: {Text("Denne duellen lagres ikke. Solospill og pakker påvirkes ikke.")}
                .onChange(of:scenePhase) {_,phase in if phase != .active {duel.hide()}}
                .onAppear {handoverFocused = true}
        }.interactiveDismissDisabled()
    }
    private func rematch() {
        // Sets are re-dealt; names/settings retained. All solo/pack stores stay untouched.
        guard let bankURL = Bundle.main.url(forResource:"questions",withExtension:"json"),
              let data = try? Data(contentsOf:bankURL), let bank = try? JSONDecoder().decode(QuestionBank.self,from:data),
              let next = try? SofaDuel(names:duel.names,category:duel.category,level:duel.level,count:duel.count,bank:bank) else {return}
        duel = next; handoverFocused = true
    }
}
