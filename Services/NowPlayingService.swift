import Foundation
import Combine
import AppKit

final class NowPlayingService {
    private let appName = "Music"
    private let queue = DispatchQueue(label: "music.nowplaying")
    private var timer: AnyCancellable?
    private var lastTrackID: String?
    private let artworkCache = NSCache<NSString, NSImage>()

    private let subject = CurrentValueSubject<NowPlayingInfo?, Never>(nil)
    var nowPlayingPublisher: AnyPublisher<NowPlayingInfo?, Never> {
        subject.eraseToAnyPublisher()
    }

    func start() {
        schedulePolling(interval: 2.0)
    }

    private func schedulePolling(interval: TimeInterval) {
        timer?.cancel()
        timer = Timer.publish(every: interval, on: .main, in: .common)
            .autoconnect()
            .receive(on: queue)
            .sink { [weak self] _ in
                self?.poll()
            }
    }

    private func poll() {
        guard isMusicRunning else {
            lastTrackID = nil
            subject.send(nil)
            schedulePolling(interval: 5.0)
            return
        }

        guard let state = fetchPlaybackState() else { return }
        let isPlaying = state == .playing
        schedulePolling(interval: isPlaying ? 1.0 : 4.0)

        guard let info = fetchNowPlaying(isPlaying: isPlaying) else {
            subject.send(nil)
            return
        }
        subject.send(info)
    }

    private var isMusicRunning: Bool {
        NSWorkspace.shared.runningApplications.contains { $0.bundleIdentifier == "com.apple.Music" }
    }

    private func fetchPlaybackState() -> PlaybackState? {
        let script = "tell application \"\(appName)\" to player state as string"
        var error: NSDictionary?
        let result = NSAppleScript(source: script)?.executeAndReturnError(&error)
        if let error { NSLog("State error: \(error)") }
        guard let state = result?.stringValue else { return nil }
        return PlaybackState(rawValue: state) ?? .stopped
    }

    private func fetchNowPlaying(isPlaying: Bool) -> NowPlayingInfo? {
        let source = """
        tell application \"\(appName)\"
            if not (exists current track) then return ""
            set trackName to name of current track
            set artistName to artist of current track
            set albumName to album of current track
            set durationSeconds to duration of current track
            set playerPos to player position
            set trackID to persistent ID of current track
            return trackName & "|" & artistName & "|" & albumName & "|" & (durationSeconds as string) & "|" & (playerPos as string) & "|" & trackID
        end tell
        """
        var error: NSDictionary?
        guard let result = NSAppleScript(source: source)?.executeAndReturnError(&error),
              error == nil,
              let string = result.stringValue else {
            if let error { NSLog("NowPlaying error: \(error)") }
            return nil
        }

        let components = string.components(separatedBy: "|")
        guard components.count == 6,
              let duration = TimeInterval(components[3]),
              let position = TimeInterval(components[4]) else { return nil }
        let trackID = components[5]

        var artwork: NSImage? = nil
        if let cached = artworkCache.object(forKey: trackID as NSString) {
            artwork = cached
        } else if let image = fetchArtwork() {
            artworkCache.setObject(image, forKey: trackID as NSString)
            artwork = image
        }

        let info = NowPlayingInfo(title: components[0],
                                  artist: components[1],
                                  album: components[2],
                                  duration: duration,
                                  position: position,
                                  isPlaying: isPlaying,
                                  artwork: artwork)
        return info
    }

    private func fetchArtwork() -> NSImage? {
        let script = """
        tell application \"\(appName)\"
            if not (exists current track) then return missing value
            set rawData to data of artwork 1 of current track
            return rawData
        end tell
        """
        var error: NSDictionary?
        guard let result = NSAppleScript(source: script)?.executeAndReturnError(&error), error == nil else {
            if let error { NSLog("Artwork error: \(error)") }
            return nil
        }
        guard let data = result.data else { return nil }
        return NSImage(data: data)
    }
}
