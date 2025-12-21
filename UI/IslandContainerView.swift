import SwiftUI

struct IslandContainerView: View {
    @ObservedObject var store: IslandStore
    @Namespace private var namespace
    @State private var hovering = false

    var body: some View {
        ZStack {
            switch store.displayState {
            case .idle:
                Color.clear
                    .frame(width: 40, height: 40)
                    .opacity(0.001)
            case .compact:
                compactView
            case .expanded:
                expandedView
            }
        }
        .padding(.top, 8)
        .padding(.horizontal, 8)
        .animation(.spring(response: 0.45, dampingFraction: 0.86).speed(store.animationIntensity), value: store.displayState)
        .onTapGesture {
            store.toggleExpansion()
        }
        .onHover { isHovering in
            hovering = isHovering
            if store.hoverToExpand && isHovering {
                store.displayState = .expanded
            }
        }
    }

    private var compactView: some View {
        HStack(spacing: 8) {
            ArtworkView(image: store.nowPlaying?.artwork, size: 24)
                .matchedGeometryEffect(id: "artwork", in: namespace)
            Text(store.nowPlaying?.title ?? "Dynamic Island")
                .font(.subheadline.weight(.semibold))
                .lineLimit(1)
                .matchedGeometryEffect(id: "title", in: namespace)
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 14)
        .background(pillBackground)
        .shadow(color: shadowColor, radius: store.glowEnabled ? 12 : 0, x: 0, y: 8)
    }

    private var expandedView: some View {
        HStack(spacing: 12) {
            ArtworkView(image: store.nowPlaying?.artwork, size: 54)
                .matchedGeometryEffect(id: "artwork", in: namespace)
                .transition(.opacity)

            VStack(alignment: .leading, spacing: 4) {
                Text(store.nowPlaying?.title ?? "Not Playing")
                    .font(.headline.weight(.semibold))
                    .lineLimit(1)
                    .matchedGeometryEffect(id: "title", in: namespace)
                Text(store.nowPlaying?.artist ?? "")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                ProgressBar(current: store.nowPlaying?.position ?? 0, total: store.nowPlaying?.duration ?? 1)
            }
            Spacer()
            TransportControls()
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
        .background(pillBackground)
        .frame(minWidth: 420)
        .shadow(color: shadowColor, radius: store.glowEnabled ? 16 : 0, x: 0, y: 10)
    }

    private var pillBackground: some View {
        ZStack {
            if store.blurEnabled {
                VisualEffectView(material: .hudWindow, blendingMode: .withinWindow)
                    .clipShape(Capsule())
            } else {
                Capsule().fill(.black.opacity(0.75))
            }
            Capsule()
                .stroke(.white.opacity(0.08), lineWidth: 1)
                .blur(radius: 0.5)
                .blendMode(.screen)
        }
    }

    private var shadowColor: Color {
        store.glowEnabled ? Color.white.opacity(0.08) : .clear
    }
}
