import SwiftUI

struct ProgressBar: View {
    var current: TimeInterval
    var total: TimeInterval

    private var progress: Double {
        guard total > 0 else { return 0 }
        return min(max(current / total, 0), 1)
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(.white.opacity(0.08))
                Capsule()
                    .fill(.white.opacity(0.6))
                    .frame(width: geometry.size.width * progress)
                    .animation(.linear(duration: 0.15), value: progress)
            }
        }
        .frame(height: 6)
    }
}
