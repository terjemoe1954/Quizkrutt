// swift-tools-version: 6.0
import PackageDescription
let package = Package(name: "QuizkruttEngine", products: [.library(name: "QuizkruttEngine", targets: ["QuizkruttEngine"])], targets: [
 .target(name: "QuizkruttEngine", path: "Quizkrutt", exclude: ["QuizkruttApp.swift", "AccessibilitySupport.swift", "I2Views.swift", "OnlineViews.swift", "ReleaseInfoViews.swift", "AppReleaseInfo.swift", "Resources", "Assets.xcassets", "PrivacyInfo.xcprivacy"], sources: ["QuizEngine.swift", "I2Engine.swift", "OnlineEngine.swift", "QuizAccessibility.swift"]),
 .testTarget(name: "QuizkruttEngineTests", dependencies: ["QuizkruttEngine"], path: "EngineTests")
])
