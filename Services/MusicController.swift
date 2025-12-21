import Foundation
import AppKit

final class MusicController: ObservableObject {
    private let appName = "Music"

    private func runScript(_ source: String) {
        let script = NSAppleScript(source: source)
        var errorDict: NSDictionary?
        script?.executeAndReturnError(&errorDict)
        if let errorDict {
            NSLog("AppleScript error: \(errorDict)")
        }
    }

    func togglePlayPause() {
        runScript("tell application \"\(appName)\" to playpause")
    }

    func next() {
        runScript("tell application \"\(appName)\" to next track")
    }

    func previous() {
        runScript("tell application \"\(appName)\" to previous track")
    }
}
