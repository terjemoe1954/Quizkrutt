import Foundation

enum AppReleaseInfo {
    // Only an explicit Debug build can expose the unfinished private account flow.
    // Release/TestFlight stays offline even if this condition is accidentally supplied.
    static var onlineEnabled: Bool {
        #if DEBUG && QUIZKRUTT_ONLINE_PREVIEW
        return true
        #else
        return false
        #endif
    }
    static let privacyURL = URL(string:"https://terjemoe1954.github.io/app-page/quizkrutt/privacy/")!
    static let supportURL = URL(string:"https://terjemoe1954.github.io/app-page/quizkrutt/support/")!
    static let contact = "terjemoe54@hotmail.com"
    static let contactURL = URL(string:"mailto:terjemoe54@hotmail.com")!
}
