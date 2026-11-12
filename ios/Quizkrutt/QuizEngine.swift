import Foundation

struct QuizCategory: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let icon: String
    let color: String
    let description: String
}
struct Question: Codable, Identifiable, Equatable {
    let id: String
    let category: String
    let level: Int
    let question: String
    let options: [String]
    let correct: Int
    let explanation: String
}
struct QuestionBank: Codable {
    let categories: [QuizCategory]
    let levelNames: [String]
    let questions: [Question]
    func validate() throws {
        guard categories.count == 6, Set(categories.map(\.id)).count == 6,
              levelNames.count == 3, questions.count == 540,
              Set(questions.map(\.id)).count == questions.count else { throw QuizError.invalidData }
        for q in questions {
            guard categories.contains(where: {$0.id == q.category}), (0...2).contains(q.level),
                  q.options.count == 4, Set(q.options).count == 4, (0...3).contains(q.correct),
                  !q.question.isEmpty else { throw QuizError.invalidData }
        }
        for c in categories { for level in 0...2 {
            guard questions.filter({$0.category == c.id && $0.level == level}).count == 30 else { throw QuizError.invalidData }
        }}
    }
}
enum QuizError: Error { case invalidData, locked, unfinished }
struct RoundCard: Codable, Equatable {
    let questionID: String
    let order: [Int]
}
struct QuizRound: Codable, Equatable {
    let category: String
    let level: Int
    let cards: [RoundCard]
    var index = 0
    var answers: [Int] = []
}
struct QuizResult: Codable { var best = 0; var rounds = 0 }
struct QuizProgress: Codable {
    var version = 1
    var results: [String: QuizResult] = [:]
    var seen: [String: [String]] = [:]
    var active: QuizRound?
    static func key(_ category: String, _ level: Int) -> String { "\(category):\(level)" }
    func unlocked(_ category: String, _ level: Int) -> Bool {
        guard (0...2).contains(level) else {return false}
        return level == 0 || (results[Self.key(category,level-1)]?.best ?? 0) >= 700
    }
    func score(_ round: QuizRound, bank: QuestionBank) -> Int {
        round.answers.enumerated().reduce(0) { total, answer in
            let card = round.cards[answer.offset]
            return total + (bank.questions.first(where: {$0.id == card.questionID})?.correct == card.order[answer.element] ? 100 : 0)
        }
    }
    mutating func start(category: String, level: Int, bank: QuestionBank) throws {
        guard active == nil else {throw QuizError.unfinished}
        guard unlocked(category,level) else {throw QuizError.locked}
        let used = seen[Self.key(category,level)] ?? []
        let pool = bank.questions.filter {$0.category == category && $0.level == level}.shuffled().sorted {
            (used.firstIndex(of:$0.id) ?? -1) < (used.firstIndex(of:$1.id) ?? -1)
        }
        guard pool.count >= 10 else {throw QuizError.invalidData}
        active = QuizRound(category:category,level:level,cards:pool.prefix(10).map {RoundCard(questionID:$0.id,order:Array(0...3).shuffled())})
    }
    @discardableResult mutating func answer(_ choice: Int) -> Bool {
        guard var round = active, (0...3).contains(choice), round.answers.count == round.index else {return false}
        round.answers.append(choice)
        let key = Self.key(round.category,round.level), id = round.cards[round.index].questionID
        seen[key] = Array(((seen[key] ?? []).filter {$0 != id} + [id]).suffix(30))
        active = round
        return true
    }
    /// Returns the final score exactly once, after all ten answers.
    mutating func advance(bank: QuestionBank) -> Int? {
        guard var round = active, round.answers.count == round.index + 1 else {return nil}
        if round.index < 9 {round.index += 1; active = round; return nil}
        let points = score(round,bank:bank), key = Self.key(round.category,round.level)
        var result = results[key] ?? QuizResult()
        result.best = max(result.best,points); result.rounds += 1
        results[key] = result; active = nil
        return points
    }
    func validate(bank: QuestionBank) throws {
        let validKeys = Set(bank.categories.flatMap { c in (0...2).map {Self.key(c.id,$0)} })
        guard version == 1, Set(results.keys).isSubset(of: validKeys), Set(seen.keys).isSubset(of:validKeys),
              results.values.allSatisfy({(0...1000).contains($0.best) && $0.best % 100 == 0 && $0.rounds >= 0}) else {throw QuizError.invalidData}
        for (key,ids) in seen {
            guard ids.count <= 30, Set(ids).count == ids.count,
                  ids.allSatisfy({id in bank.questions.contains { $0.id == id && Self.key($0.category,$0.level) == key }}) else {throw QuizError.invalidData}
        }
        if let a = active {
            guard unlocked(a.category,a.level), a.cards.count == 10, (0..<10).contains(a.index),
                  a.answers.count == a.index || a.answers.count == a.index+1,
                  a.answers.allSatisfy({(0...3).contains($0)}), Set(a.cards.map(\.questionID)).count == 10 else {throw QuizError.invalidData}
            for card in a.cards {
                guard card.order.count == 4, Set(card.order) == Set(0...3), bank.questions.contains(where: {$0.id == card.questionID && $0.category == a.category && $0.level == a.level}) else {throw QuizError.invalidData}
            }
        }
    }
}
