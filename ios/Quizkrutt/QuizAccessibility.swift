import Foundation

/// Spoken labels must never reveal the answer until a choice has been made.
enum QuizAccessibility {
    static func answerLabel(option: String, index: Int, choice: Int?, correct: Int) -> String {
        let letter = String(UnicodeScalar(65+index)!)
        var label = "Alternativ \(letter): \(option)"
        if let choice {
            if choice == index {label += ", ditt svar"}
            if correct == index {label += ", riktig svar"}
        }
        return label
    }
    static func feedback(right: Bool, correctAnswer: String, explanation: String) -> String {
        let result = right ? "Helt riktig. 100 poeng.":"Ikke helt. Riktig svar er \(correctAnswer)."
        return result+" "+explanation
    }
}
