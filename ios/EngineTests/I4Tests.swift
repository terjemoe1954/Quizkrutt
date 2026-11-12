import XCTest
@testable import QuizkruttEngine

final class I4Tests: XCTestCase {
    func testUnansweredSpokenOptionsNeverRevealTheCorrectChoice() {
        for correct in 0..<4 {for index in 0..<4 {
            let label = QuizAccessibility.answerLabel(option:"Svar \(index)",index:index,choice:nil,correct:correct)
            XCTAssertFalse(label.contains("riktig")); XCTAssertFalse(label.contains("ditt svar"))
            XCTAssertTrue(label.contains("Svar \(index)"))
        }}
    }
    func testSpokenFeedbackIdentifiesBothChoiceAndAnswerAfterAnswering() {
        let labels = (0..<4).map {QuizAccessibility.answerLabel(option:"Valg \($0)",index:$0,choice:1,correct:3)}
        XCTAssertTrue(labels[1].contains("ditt svar")); XCTAssertFalse(labels[1].contains("riktig svar"))
        XCTAssertTrue(labels[3].contains("riktig svar")); XCTAssertFalse(labels[3].contains("ditt svar"))
        let right = QuizAccessibility.answerLabel(option:"Trondheim",index:2,choice:2,correct:2)
        XCTAssertTrue(right.contains("ditt svar")); XCTAssertTrue(right.contains("riktig svar"))
    }
    func testWrongAnswerAnnouncementIncludesTheAnswerEvenWhenExplanationDoesNot() {
        let message = QuizAccessibility.feedback(right:false,correctAnswer:"Trondheim",explanation:"Her startet historien.")
        XCTAssertTrue(message.contains("Riktig svar er Trondheim")); XCTAssertTrue(message.contains("Her startet historien."))
        XCTAssertFalse(message.contains("100 poeng"))
        XCTAssertTrue(QuizAccessibility.feedback(right:true,correctAnswer:"Trondheim",explanation:"Forklaring.").contains("100 poeng"))
    }
}
