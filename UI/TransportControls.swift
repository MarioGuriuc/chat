import SwiftUI

struct TransportControls: View {
    @StateObject private var controller = MusicController()
    @ObservedObject private var store = IslandStore.shared

    var body: some View {
        HStack(spacing: 12) {
            controlButton(systemName: "backward.fill") { controller.previous() }
            controlButton(systemName: store.nowPlaying?.isPlaying == true ? "pause.fill" : "play.fill") {
                controller.togglePlayPause()
            }
            controlButton(systemName: "forward.fill") { controller.next() }
        }
        .buttonStyle(.plain)
    }

    private func controlButton(systemName: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.title3.weight(.semibold))
                .foregroundStyle(.primary)
                .frame(width: 36, height: 36)
                .background(.white.opacity(0.08))
                .clipShape(Circle())
        }
    }
}
