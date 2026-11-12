import XCTest
@testable import QuizkruttEngine

final class QuizEngineTests: XCTestCase {
    func bank() throws -> QuestionBank {
        let url = URL(fileURLWithPath:#filePath).deletingLastPathComponent().deletingLastPathComponent().appending(path:"Quizkrutt/Resources/questions.json")
        let b = try JSONDecoder().decode(QuestionBank.self,from:Data(contentsOf:url)); try b.validate(); return b
    }
    func play(_ p: inout QuizProgress, bank:QuestionBank, correct:Int) throws -> Int {
        var result:Int?
        for index in 0..<10 {
            let a = try XCTUnwrap(p.active), card = a.cards[index], q = try XCTUnwrap(bank.questions.first {$0.id == card.questionID})
            let right = try XCTUnwrap(card.order.firstIndex(of:q.correct))
            XCTAssertTrue(p.answer(index < correct ? right : (right+1)%4))
            XCTAssertFalse(p.answer(right))
            result = p.advance(bank:bank)
            try p.validate(bank:bank)
        }
        return try XCTUnwrap(result)
    }
    func testBankAndAllLevels() throws {
        let b = try bank(); var p = QuizProgress()
        for c in b.categories {for level in 0...2 {
            try p.start(category:c.id,level:level,bank:b)
            XCTAssertEqual(try play(&p,bank:b,correct:10),1000)
        }}
        XCTAssertEqual(p.results.count,18)
    }
    func testUnlockThresholdAndRepeatedAdvance() throws {
        let b = try bank(); var p = QuizProgress()
        XCTAssertThrowsError(try p.start(category:"world",level:1,bank:b))
        try p.start(category:"world",level:0,bank:b)
        XCTAssertEqual(try play(&p,bank:b,correct:6),600)
        XCTAssertFalse(p.unlocked("world",1))
        try p.start(category:"world",level:0,bank:b)
        XCTAssertEqual(try play(&p,bank:b,correct:7),700)
        XCTAssertTrue(p.unlocked("world",1)); XCTAssertFalse(p.unlocked("nature",1))
        XCTAssertNil(p.advance(bank:b)); XCTAssertEqual(p.results["world:0"]?.rounds,2)
    }
    func testResumeAndUniqueRotation() throws {
        let b = try bank(); var p = QuizProgress(); var ids = Set<String>()
        for _ in 0..<3 {
            try p.start(category:"mix",level:0,bank:b)
            ids.formUnion(try XCTUnwrap(p.active).cards.map(\.questionID))
            XCTAssertTrue(p.answer(0))
            p = try JSONDecoder().decode(QuizProgress.self,from:JSONEncoder().encode(p))
            try p.validate(bank:b); XCTAssertEqual(p.active?.answers,[0]); XCTAssertFalse(p.answer(1))
            _ = p.advance(bank:b)
            for _ in 1..<10 {XCTAssertTrue(p.answer(0)); _ = p.advance(bank:b)}
        }
        XCTAssertEqual(ids.count,30)
    }
    func testInvalidDataAndActiveRoundProtection() throws {
        let b = try bank(); var p = QuizProgress()
        try p.start(category:"mix",level:0,bank:b)
        XCTAssertThrowsError(try p.start(category:"nature",level:0,bank:b))
        XCTAssertFalse(p.answer(-1)); XCTAssertNil(p.advance(bank:b))
        p.active?.answers = [10]
        XCTAssertThrowsError(try p.validate(bank:b))
    }
}
