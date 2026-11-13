import Foundation
import CryptoKit

struct PackEntry: Codable, Identifiable {
    let id: String
    let version: Int
    let title: String
    let description: String
    let category: String
    let level: Int
    let count: Int
    let bytes: Int
    let sha256: String
    let file: String
    var categoryName: String? = nil
    var key: String {"\(id)@\(version)"}
}
struct PackQuestion: Codable {
    let id: String
    let question: String
    let options: [String]
    let correct: Int
    let explanation: String
}
struct QuizPack: Codable {
    let schema: Int
    let id: String
    let version: Int
    let title: String
    let description: String
    let category: String
    let level: Int
    let questions: [PackQuestion]
    func nativeQuestions() -> [Question] {
        questions.map {Question(id:$0.id,category:category,level:level,question:$0.question,options:$0.options,correct:$0.correct,explanation:$0.explanation)}
    }
}
func validNativeQuestion(_ q: Question) -> Bool {
    !q.id.isEmpty && !q.question.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty &&
    !q.explanation.isEmpty && q.options.count == 4 && Set(q.options).count == 4 &&
    q.options.allSatisfy {!$0.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty} &&
    (0...3).contains(q.correct) && (0...2).contains(q.level) &&
    q.category.range(of:"^[a-z][a-z0-9-]{1,70}$",options:.regularExpression) != nil
}
func validatePack(_ data: Data, entry: PackEntry) throws -> QuizPack {
    guard entry.id.range(of:"^[a-z0-9]+(-[a-z0-9]+)*$",options:.regularExpression) != nil,
          entry.version > 0, (10...200).contains(entry.count), entry.bytes > 0, entry.bytes <= 1_000_000,
          data.count == entry.bytes,
          SHA256.hash(data:data).map({String(format:"%02x",$0)}).joined() == entry.sha256,
          entry.file == "packs/\(entry.id).v\(entry.version).json" else {throw QuizError.invalidData}
    let p = try JSONDecoder().decode(QuizPack.self,from:data)
    guard p.schema == 1, p.id == entry.id, p.version == entry.version,
          p.title == entry.title, p.description == entry.description, p.category == entry.category,
          p.level == entry.level, p.questions.count == entry.count,
          Set(p.questions.map(\.id)).count == entry.count,
          p.nativeQuestions().allSatisfy(validNativeQuestion) else {throw QuizError.invalidData}
    return p
}
struct InstalledPack: Codable {let entry: PackEntry; let data: Data}
struct SnapshotCard: Codable {
    let question: Question
    let order: [Int]
    init(_ question: Question) {self.question = question; order = Array(0...3).shuffled()}
    var correct: Int {order.firstIndex(of:question.correct)!}
    func validate() -> Bool {validNativeQuestion(question) && order.count == 4 && Set(order) == Set(0...3)}
}
struct PackHistory: Codable {
    var best = 0
    var rounds = 0
    var seen: [String] = []
}
struct PackRound: Codable {
    let source: Data
    let entry: PackEntry
    let cards: [SnapshotCard]
    var index = 0
    var answers: [Int] = []
    var score: Int {answers.enumerated().reduce(0) {$0 + (cards[$1.offset].correct == $1.element ? 100:0)}}
}
struct PackLibrary: Codable {
    var version = 1
    var installed: [String: InstalledPack] = [:]
    var history: [String: PackHistory] = [:]
    var active: PackRound?
    mutating func install(_ data: Data, entry: PackEntry) throws {
        _ = try validatePack(data,entry:entry)
        if let old = installed[entry.id], old.entry.version > entry.version {throw QuizError.invalidData}
        installed[entry.id] = InstalledPack(entry:entry,data:data)
    }
    mutating func resetProgress() {history = [:]; active = nil}
    mutating func remove(_ id: String) {installed.removeValue(forKey:id)}
    mutating func start(_ id: String) throws {
        guard active == nil else {throw QuizError.unfinished}
        guard let saved = installed[id] else {throw QuizError.invalidData}
        let pack = try validatePack(saved.data,entry:saved.entry), seen = history[saved.entry.key]?.seen ?? []
        let pool = pack.nativeQuestions().shuffled().sorted {
            (seen.firstIndex(of:$0.id) ?? -1) < (seen.firstIndex(of:$1.id) ?? -1)
        }
        active = PackRound(source:saved.data,entry:saved.entry,cards:pool.prefix(10).map(SnapshotCard.init))
    }
    @discardableResult mutating func answer(_ choice: Int) -> Bool {
        guard var a = active, (0...3).contains(choice), a.answers.count == a.index else {return false}
        a.answers.append(choice); active = a
        var h = history[a.entry.key] ?? PackHistory(), id = a.cards[a.index].question.id
        h.seen = Array((h.seen.filter {$0 != id} + [id]).suffix(200)); history[a.entry.key] = h
        return true
    }
    mutating func advance() -> Int? {
        guard var a = active, a.answers.count == a.index+1 else {return nil}
        if a.index < 9 {a.index += 1; active = a; return nil}
        var h = history[a.entry.key] ?? PackHistory(); h.best = max(h.best,a.score); h.rounds += 1
        history[a.entry.key] = h; active = nil; return a.score
    }
    func validate() throws {
        guard version == 1 else {throw QuizError.invalidData}
        for (id,p) in installed {guard id == p.entry.id else {throw QuizError.invalidData}; _ = try validatePack(p.data,entry:p.entry)}
        for (key,h) in history {
            guard key.range(of:"^[a-z0-9]+(-[a-z0-9]+)*@[1-9][0-9]*$",options:.regularExpression) != nil else {throw QuizError.invalidData}
            guard (0...1000).contains(h.best), h.best % 100 == 0, h.rounds >= 0,
                  h.seen.count <= 200, Set(h.seen).count == h.seen.count else {throw QuizError.invalidData}
        }
        if let a = active {
            let original = try validatePack(a.source,entry:a.entry).nativeQuestions()
            guard a.cards.allSatisfy({original.contains($0.question)}), a.cards.count == 10, (0..<10).contains(a.index),
                  a.answers.count == a.index || a.answers.count == a.index+1,
                  a.answers.allSatisfy({(0...3).contains($0)}),
                  a.cards.allSatisfy({$0.validate() && $0.question.category == a.entry.category && $0.question.level == a.entry.level}),
                  Set(a.cards.map(\.question.id)).count == 10 else {throw QuizError.invalidData}
        }
    }
}
/// Separate file from I1; no migration or writes to progress-v1.json.
struct PackDisk {
    let file: URL
    func load() throws -> PackLibrary {
        guard FileManager.default.fileExists(atPath:file.path) else {return PackLibrary()}
        let value = try JSONDecoder().decode(PackLibrary.self,from:Data(contentsOf:file)); try value.validate(); return value
    }
    func save(_ value: PackLibrary) throws {
        try value.validate()
        try FileManager.default.createDirectory(at:file.deletingLastPathComponent(),withIntermediateDirectories:true)
        try JSONEncoder().encode(value).write(to:file,options:.atomic)
    }
}

enum SofaPhase {case handover, question, feedback, finished}
struct SofaDuel {
    let names: [String]
    let category: String
    let level: Int
    let count: Int
    let cards: [[SnapshotCard]]
    let first: Int
    var answers: [[Int]] = [[],[]]
    var turn = 0
    var phase: SofaPhase = .handover
    var player: Int {(first+turn)%2}
    var index: Int {turn/2}
    /// UI only receives a card when this turn has been explicitly revealed.
    var visibleCard: SnapshotCard? {phase == .question || phase == .feedback ? cards[player][index]:nil}
    var scores: [Int] {(0..<2).map {p in answers[p].enumerated().reduce(0) {$0 + (cards[p][$1.offset].correct == $1.element ? 100:0)}}}
    var winner: Int? {guard phase == .finished, scores[0] != scores[1] else {return nil}; return scores[0] > scores[1] ? 0:1}
    static func normalizedNames(_ values: [String]) throws -> [String] {
        guard values.count == 2 else {throw QuizError.invalidData}
        let names = values.map {$0.split(whereSeparator:{$0.isWhitespace}).joined(separator:" ")}
        let forbidden = CharacterSet.controlCharacters.union(CharacterSet(charactersIn:"\u{202a}\u{202b}\u{202c}\u{202d}\u{202e}\u{2066}\u{2067}\u{2068}\u{2069}"))
        guard names.allSatisfy({!$0.isEmpty && $0.count <= 20 && $0.rangeOfCharacter(from:forbidden) == nil}),
              names[0].precomposedStringWithCompatibilityMapping.lowercased() != names[1].precomposedStringWithCompatibilityMapping.lowercased() else {throw QuizError.invalidData}
        return names
    }
    init(names: [String], category: String, level: Int, count: Int, bank: QuestionBank, first: Int = Int.random(in:0...1)) throws {
        self.names = try Self.normalizedNames(names)
        guard bank.categories.contains(where:{$0.id == category}), (0...2).contains(level), [5,10].contains(count), (0...1).contains(first) else {throw QuizError.invalidData}
        self.category = category; self.level = level; self.count = count; self.first = first
        // Same quota from each fact group; no shared questions between players.
        let pool = bank.questions.filter {$0.category == category && $0.level == level}
        let groups = Dictionary(grouping:pool) {String($0.id.split(separator:"-").dropLast().joined(separator:"-"))}
        let topics = Array(groups.keys).shuffled()
        guard !topics.isEmpty else {throw QuizError.invalidData}
        var sets: [[Question]] = [[],[]]
        for (i,topic) in topics.enumerated() {
            let quota = count/topics.count + (i<count%topics.count ? 1:0), questions = groups[topic]!.shuffled()
            guard questions.count >= quota*2 else {throw QuizError.invalidData}
            for j in 0..<(quota*2) {sets[j%2].append(questions[j])}
        }
        cards = sets.map {$0.shuffled().map(SnapshotCard.init)}
    }
    mutating func reveal() {
        guard phase == .handover else {return}
        phase = answers[player].count > index ? .feedback:.question
    }
    @discardableResult mutating func answer(_ choice: Int) -> Bool {
        guard phase == .question, (0...3).contains(choice), answers[player].count == index else {return false}
        answers[player].append(choice); phase = .feedback; return true
    }
    mutating func next() {
        guard phase == .feedback else {return}
        turn += 1; phase = turn == count*2 ? .finished:.handover
    }
    mutating func hide() {if phase == .question || phase == .feedback {phase = .handover}}
}
