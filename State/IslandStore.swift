import Foundation
import Combine
import AppKit
import SwiftUI

enum IslandDisplayState {
    case idle
    case compact
    case expanded
}

enum IslandContentType {
    case none
    case music
}

final class IslandStore: ObservableObject {
    static let shared = IslandStore()

    @Published var displayState: IslandDisplayState = .idle
    @Published var contentType: IslandContentType = .none
    @Published var nowPlaying: NowPlayingInfo?
    @Published var ignoreMouseEventsWhenIdle: Bool = true
    @Published var animationIntensity: Double = 0.65
    @Published var blurEnabled: Bool = true
    @Published var glowEnabled: Bool = true
    @Published var hoverToExpand: Bool = false
    @Published var autoExpandOnPlay: Bool = true

    private var cancellables = Set<AnyCancellable>()

    private init() {}

    func update(with info: NowPlayingInfo?) {
        nowPlaying = info
        if info != nil {
            contentType = .music
            if autoExpandOnPlay {
                withAnimation(.spring(response: 0.45, dampingFraction: 0.8)) {
                    displayState = .expanded
                }
            } else if displayState == .idle {
                displayState = .compact
            }
        } else {
            contentType = .none
            displayState = .idle
        }
    }

    func toggleExpansion() {
        switch displayState {
        case .idle:
            displayState = nowPlaying == nil ? .idle : .compact
        case .compact:
            withAnimation(.spring(response: 0.5, dampingFraction: 0.85)) {
                displayState = .expanded
            }
        case .expanded:
            withAnimation(.spring(response: 0.45, dampingFraction: 0.88)) {
                displayState = nowPlaying == nil ? .idle : .compact
            }
        }
    }

    func collapse() {
        withAnimation(.spring(response: 0.5, dampingFraction: 0.9)) {
            displayState = nowPlaying == nil ? .idle : .compact
        }
    }
}
