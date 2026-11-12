import SwiftUI
import UIKit

@main struct QuizkruttApp: App {
    @StateObject private var store = GameStore()
    @StateObject private var packs = PackStore()
    @StateObject private var online = OnlineConfiguration.store()
    var body: some Scene { WindowGroup { HomeView().environmentObject(store).environmentObject(packs).environmentObject(online).environment(\.locale,Locale(identifier:"nb_NO")).preferredColorScheme(.light) } }
}

@MainActor final class GameStore: ObservableObject {
    @Published var bank: QuestionBank?
    @Published var progress = QuizProgress()
    @Published var error: String?
    @Published var storageBlocked = false
    private let file: URL
    init() {
        file = URL.applicationSupportDirectory.appending(path:"Quizkrutt/progress-v1.json")
        do {
            guard let url = Bundle.main.url(forResource:"questions",withExtension:"json") else {throw QuizError.invalidData}
            let bank = try JSONDecoder().decode(QuestionBank.self,from:Data(contentsOf:url)); try bank.validate(); self.bank = bank
            if FileManager.default.fileExists(atPath:file.path) {
                do {let loaded = try JSONDecoder().decode(QuizProgress.self,from:Data(contentsOf:file)); try loaded.validate(bank:bank); progress = loaded}
                catch {storageBlocked = true; self.error = "Lagret fremdrift kunne ikke leses. Originalfilen er bevart. Appen overskriver den ikke."}
            }
        } catch { self.error = "Spørsmålene kunne ikke åpnes. Prøv å starte appen på nytt." }
    }
    func save() {
        guard !storageBlocked else {return}
        do {
            try FileManager.default.createDirectory(at:file.deletingLastPathComponent(),withIntermediateDirectories:true)
            try JSONEncoder().encode(progress).write(to:file,options:.atomic)
            error = nil
        } catch { self.error = "Fremdriften er i minnet, men kunne ikke lagres. Frigjør plass og trykk Prøv lagring igjen før du lukker appen." }
    }
    func start(_ category: String, _ level: Int) {
        guard let bank, !storageBlocked else {return}
        do {try progress.start(category:category,level:level,bank:bank); save()}
        catch {self.error = "Fortsett den påbegynte runden før du starter en ny."}
    }
    func answer(_ choice: Int) {if progress.answer(choice) {save()}}
    func advance() -> Int? {guard let bank else {return nil}; let result = progress.advance(bank:bank); save(); return result}
}

extension Color {
    static let paper = Color(red:0.965,green:0.953,blue:0.922)
    static let ink = Color(red:0.14,green:0.16,blue:0.12)
    static let lime = Color(red:0.84,green:0.93,blue:0.52)
    static let muted = Color(red:0.35,green:0.39,blue:0.30)
    init(hex:String) {let n = UInt64(hex.dropFirst(),radix:16) ?? 0;self.init(red:Double((n>>16)&255)/255,green:Double((n>>8)&255)/255,blue:Double(n&255)/255)}
}
struct KruttButton: ButtonStyle {
    var prominent = true
    func makeBody(configuration:Configuration) -> some View {
        configuration.label.labelStyle(QuizLabelStyle()).font(.headline).fixedSize(horizontal:false,vertical:true).frame(maxWidth:.infinity,minHeight:30).padding(14)
            .background(prominent ? Color.lime : Color.white.opacity(0.65),in:RoundedRectangle(cornerRadius:17))
            .overlay(RoundedRectangle(cornerRadius:17).stroke(Color.ink.opacity(0.35)))
            .foregroundStyle(Color.ink).opacity(configuration.isPressed ? 0.7:1)
    }
}
struct HomeView: View {
    @EnvironmentObject var store: GameStore
    @State private var playing = false
    @State private var settings = false
    @State private var intro = false
    @Environment(\.dynamicTypeSize) private var textSize
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment:.leading,spacing:24) {
                    HStack(alignment:.top) {
                        VStack(alignment:.leading,spacing:12) {
                            Text("EN LITEN PAUSE. LITT MER PEILING.").font(.caption.bold()).foregroundStyle(Color.muted)
                            Text("Gi hjernen din\nlitt konfetti.").font(.system(.largeTitle,design:.rounded,weight:.heavy)).accessibilityAddTraits(.isHeader).fixedSize(horizontal:false,vertical:true)
                            Text("Velg et tema og finn ditt neste aha. Ti spørsmål, helt uten tidspress.").foregroundStyle(Color.muted)
                        }
                        if !textSize.isAccessibilitySize {Text("✳︎").font(.system(size:52)).padding(12).background(Color.lime,in:RoundedRectangle(cornerRadius:25)).rotationEffect(.degrees(-10)).accessibilityHidden(true)}
                    }
                    Button("Ny her? Slik spiller du",systemImage:"sparkles") {intro = true}.buttonStyle(KruttButton(prominent:false))
                    if let error = store.error {
                        VStack(alignment:.leading,spacing:12) {
                            Text(error).foregroundStyle(.red)
                            if !store.storageBlocked {Button("Prøv lagring igjen") {store.save()}}
                        }.padding().background(.white,in:RoundedRectangle(cornerRadius:18))
                    }
                    if let bank = store.bank {
                        let badges = store.progress.results.values.filter {$0.best >= 700}.count
                        VStack(alignment:.leading,spacing:10) {
                            Label("DIN QUIZREISE",systemImage:"star.circle.fill").font(.caption.bold())
                            Text("\(badges) av 18 merker").font(.title2.bold())
                            Text("540 spørsmål · seks temaer · tre nivåer").foregroundStyle(Color.muted)
                            if let round = store.progress.active {
                                Text("\(bank.categories.first(where:{$0.id == round.category})?.name ?? "Quiz") · spørsmål \(round.index+1) av 10").font(.subheadline)
                                Button("Fortsett runden",systemImage:"arrow.right") {playing = true}.buttonStyle(KruttButton())
                            }
                        }.padding(20).frame(maxWidth:.infinity,alignment:.leading).background(Color.lime.opacity(0.35),in:RoundedRectangle(cornerRadius:23))
                        NavigationLink {PackLibraryView()} label: {
                            Label("Quizpakker · finn ditt neste aha",systemImage:"square.stack.3d.up.fill").frame(maxWidth:.infinity,alignment:.leading)
                        }.buttonStyle(KruttButton())
                        NavigationLink {SofaSetupView()} label: {
                            Label("Sofaduell · spill mot en venn",systemImage:"person.2.fill").frame(maxWidth:.infinity,alignment:.leading)
                        }.buttonStyle(KruttButton(prominent:false))
                    if AppReleaseInfo.onlineEnabled {
                    NavigationLink {OnlineHubView()} label: {
                        VStack(alignment:.leading,spacing:10) {
                            Label("Nettduell med en venn",systemImage:"person.2.fill").font(.title3.bold())
                            Text("Del en romkode og spill direkte i appen på hver deres telefon.").foregroundStyle(Color.muted)
                            Text("Se hvordan →").font(.headline)
                        }.padding(20).frame(maxWidth:.infinity,alignment:.leading).background(Color(hex:"#e4edf0"),in:RoundedRectangle(cornerRadius:23))
                    }.buttonStyle(.plain)
                    } else {
                        VStack(alignment:.leading,spacing:8) {
                            Label("Nettduell kommer senere",systemImage:"person.2.fill").font(.headline)
                            Text("Spill alene eller prøv sofaduell på samme enhet i denne betaversjonen.").foregroundStyle(Color.muted)
                        }.padding(20).frame(maxWidth:.infinity,alignment:.leading).background(Color(hex:"#e4edf0"),in:RoundedRectangle(cornerRadius:23))
                    }
                        Text("Hva er du nysgjerrig på?").font(.title2.bold()).accessibilityAddTraits(.isHeader)
                        ForEach(bank.categories) {category in
                            NavigationLink {LevelView(category:category,playing:$playing)} label: {
                                HStack(spacing:16) {
                                    if !textSize.isAccessibilitySize {Text(category.icon).font(.largeTitle).frame(width:64,height:64).background(Color(hex:category.color),in:RoundedRectangle(cornerRadius:18)).accessibilityHidden(true)}
                                    VStack(alignment:.leading,spacing:5) {
                                        Text(category.name).font(.title3.bold())
                                        Text(category.description).font(.subheadline).foregroundStyle(Color.muted)
                                    }
                                    Spacer(minLength:0)
                                    if !textSize.isAccessibilitySize {Image(systemName:"arrow.up.right").accessibilityHidden(true)}
                                }.padding(18).background(.white.opacity(0.8),in:RoundedRectangle(cornerRadius:23))
                            }.buttonStyle(.plain).disabled(store.storageBlocked)
                        }
                    }
                    Label("Solospillet virker uten nett fra første start.",systemImage:"wifi.slash").font(.footnote).foregroundStyle(Color.muted)
                    Text("Fremdriften lagres i denne appen. Nettversjonen har egen lagring.").font(.footnote).foregroundStyle(Color.muted)
                }.padding(20).quizReadingWidth()
            }.background(Color.paper).foregroundStyle(Color.ink)
                .navigationTitle("✳︎ quizkrutt.").navigationBarTitleDisplayMode(.inline)
                .toolbar {ToolbarItem(placement:.topBarTrailing) {Button("Innstillinger",systemImage:"gearshape") {settings = true}}}
                .sheet(isPresented:$settings) {SettingsView()}
                .sheet(isPresented:$intro) {IntroView()}
                .fullScreenCover(isPresented:$playing) {RoundView()}
        }.tint(Color.ink)
    }
}
struct LevelView: View {
    let category: QuizCategory
    @Binding var playing: Bool
    @EnvironmentObject var store: GameStore
    var body: some View {
        ScrollView {
            VStack(alignment:.leading,spacing:20) {
                Text(category.icon).font(.system(size:65)).accessibilityHidden(true)
                Text(category.name).font(.largeTitle.bold()).accessibilityAddTraits(.isHeader)
                Text("Ti spørsmål per runde. Få minst 700 poeng for å åpne neste nivå.").foregroundStyle(Color.muted)
                if store.progress.active != nil {
                    Text("Du har en runde på gang. Fortsett den først.")
                    Button("Fortsett runden") {playing = true}.buttonStyle(KruttButton())
                }
                if let bank = store.bank {
                    ForEach(0..<3,id:\.self) {level in
                        let unlocked = store.progress.unlocked(category.id,level)
                        let result = store.progress.results[QuizProgress.key(category.id,level)]
                        Button {
                            store.start(category.id,level)
                            playing = store.progress.active != nil
                        } label: {
                            HStack {
                                VStack(alignment:.leading,spacing:8) {
                                    Text(bank.levelNames[level]).font(.title3.bold())
                                    Text(unlocked ? "Beste: \(result?.best ?? 0) / 1000" : "Bestå forrige nivå først").font(.subheadline)
                                }
                                Spacer()
                                Image(systemName:unlocked ? ((result?.best ?? 0) >= 700 ? "star.fill":"arrow.right") : "lock.fill")
                            }.padding(8)
                        }.buttonStyle(KruttButton(prominent:unlocked)).disabled(!unlocked || store.progress.active != nil || store.storageBlocked)
                    }
                }
            }.padding(24).quizReadingWidth()
        }.background(Color.paper).navigationTitle("Velg nivå").navigationBarTitleDisplayMode(.inline)
    }
}
struct RoundView: View {
    @EnvironmentObject var store: GameStore
    @Environment(\.dismiss) private var dismiss
    @State private var finalScore: Int?
    @AccessibilityFocusState(for:.voiceOver) private var resultFocused: Bool
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment:.leading,spacing:22) {
                    if let points = finalScore {
                        VStack(spacing:24) {
                            Image(systemName:points >= 700 ? "star.circle.fill":"sparkles").font(.system(size:70)).foregroundStyle(Color.muted).accessibilityHidden(true)
                            Text(points >= 700 ? "Der satt den!":"Litt klokere allerede.").font(.largeTitle.bold()).accessibilityAddTraits(.isHeader).accessibilityFocused($resultFocused)
                            Text("\(points) / 1000 poeng").font(.title.bold())
                            Text(points >= 700 ? "Du har bestått nivået. Fortsett quizreisen når du vil.":"Prøv igjen og oppdag flere artige fakta. 700 poeng gir et merke.").foregroundStyle(Color.muted)
                            Button("Tilbake til quizreisen") {dismiss()}.buttonStyle(KruttButton())
                        }.frame(maxWidth:.infinity).multilineTextAlignment(.center).padding(.top,40)
                    } else if let bank = store.bank, let round = store.progress.active,
                              let q = bank.questions.first(where:{$0.id == round.cards[round.index].questionID}) {
                        let card = round.cards[round.index]
                        let answered = round.answers.count > round.index
                        let choice = answered ? round.answers[round.index]:nil
                        QuizRoundMetadata(left:bank.levelNames[round.level],right:"\(store.progress.score(round,bank:bank)) poeng")
                        ProgressView(value:Double(round.index),total:10).tint(Color.muted)
                            .accessibilityLabel("Fremdrift").accessibilityValue("\(round.index) av 10 spørsmål fullført")
                        Text("SPØRSMÅL \(round.index+1) AV 10").font(.caption.bold()).foregroundStyle(Color.muted)
                        NativeQuestionPanel(question:q,order:card.order,choice:choice,answer:store.answer).id(round.index)
                        if answered {
                            Button(round.index == 9 ? "Se resultatet":"Neste spørsmål") {finalScore = store.advance(); resultFocused = finalScore != nil}.buttonStyle(KruttButton())
                        }

                    }
                    if let error = store.error {Text(error).font(.footnote).foregroundStyle(.red); Button("Prøv lagring igjen") {store.save()}}
                }.padding(24).quizReadingWidth()
            }.id(store.progress.active?.index).background(Color.paper).foregroundStyle(Color.ink)
                .navigationTitle("Quizkrutt").navigationBarTitleDisplayMode(.inline)
                .toolbar {ToolbarItem(placement:.topBarLeading) {Button(finalScore == nil ? "Pause":"Lukk") {dismiss()}}}
        }.interactiveDismissDisabled()
    }
}
struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("quizkrutt.haptics") private var haptics = false
    var body: some View {
        NavigationStack {
            Form {
                Section("Gjør quizen til din") {
                    Toggle("Vibrasjon ved svar",isOn:$haptics)
                    Text("Av som standard. Tekststørrelse og redusert bevegelse følger innstillingene på iPhone.").font(.footnote)
                }
                Section("Om Quizkrutt") {
                    Text("Versjon \(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "–") (\(Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "–")) · 540 + 120 spørsmål")
                    Text("Seks kategorier, tre nivåer og ti spørsmål per runde. Riktig svar gir 100 poeng; 700 poeng åpner neste nivå.")
                    Text("Egenformulerte spørsmål med KI-støtte. Innholdet er under redaksjonell testing.")
                }
                Section("Hjelp og personvern") {
                    NavigationLink("Personvern") {PrivacyView()}
                    NavigationLink("Hjelp og tilbakemelding") {SupportView()}
                    Text("Solospill og innstillinger lagres på denne enheten i appen. Ingen konto, annonser eller analyseverktøy i solospillet. Fremdrift deles ikke med nettversjonen. Hvis appen slettes, kan lokal fremdrift gå tapt.")
                    Text("Quizpakker og sofaduell fungerer uten nett. Pakkehistorikk lagres separat fra grunnspillet. Sofadueller og kallenavn beholdes bare mens duellen pågår. Nettduell er ikke aktiv i denne betaversjonen.")
                }
            }.navigationTitle("Innstillinger").toolbar {Button("Ferdig") {dismiss()}}
        }
    }
}
struct IntroView: View {
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment:.leading,spacing:24) {
                    Text("Små spørsmål. Store aha!").font(.largeTitle.bold()).accessibilityAddTraits(.isHeader)
                    Label("Velg ett av seks temaer og start på Nybegynner.",systemImage:"1.circle.fill")
                    Label("Svar på ti spørsmål. Ingen klokke jager deg.",systemImage:"2.circle.fill")
                    Label("Få 700 poeng og åpne neste nivå. Du kan alltid prøve igjen.",systemImage:"3.circle.fill")
                    Text("Trykk Pause når du vil. Svar og fremdrift lagres automatisk, også uten nett.").foregroundStyle(Color.muted)
                    Button("La oss quizze!") {dismiss()}.buttonStyle(KruttButton())
                }.padding(24).quizReadingWidth()
            }.background(Color.paper).toolbar {Button("Lukk") {dismiss()}}
        }
    }
}
