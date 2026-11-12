//*****
import SwiftUI

extension View {
    /// Keep paragraphs readable on iPad without constraining Dynamic Type's height.
    func quizReadingWidth() -> some View {
        frame(maxWidth:680,alignment:.leading).frame(maxWidth:.infinity)
    }
}
struct QuizRoundMetadata: View {
    let left: String
    let right: String
    @Environment(\.dynamicTypeSize) private var textSize
    var body: some View {
        Group {
            if textSize.isAccessibilitySize {
                VStack(alignment:.leading,spacing:8) {Text(left); Text(right)}
            } else {
                HStack(alignment:.firstTextBaseline) {Text(left); Spacer(minLength:12); Text(right)}
            }
        }.font(.subheadline.bold()).fixedSize(horizontal:false,vertical:true)
    }
}

struct QuizLabelStyle: LabelStyle {
    @Environment(\.dynamicTypeSize) private var textSize
    func makeBody(configuration: Configuration) -> some View {
        HStack(alignment:.firstTextBaseline,spacing:10) {
            if !textSize.isAccessibilitySize {configuration.icon.accessibilityHidden(true)}
            configuration.title.fixedSize(horizontal:false,vertical:true)
        }
    }
}

struct QuizAnswerStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        // A submitted answer is disabled for input, but remains readable for review.
        configuration.label.foregroundStyle(Color.ink).opacity(configuration.isPressed ? 0.85:1)
    }
}
