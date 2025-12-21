import Foundation
import AppKit

struct NowPlayingInfo: Equatable {
    let title: String
    let artist: String
    let album: String
    let duration: TimeInterval
    let position: TimeInterval
    let isPlaying: Bool
    let artwork: NSImage?
}

enum PlaybackState: String {
    case stopped
    case paused
    case playing
}
