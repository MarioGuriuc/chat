import SwiftUI

struct PreferencesView: View {
    @StateObject private var store = IslandStore.shared
    @StateObject private var startAtLogin = StartAtLoginManager()

    var body: some View {
        Form {
            Section(header: Text("Launch")) {
                Toggle("Start at login", isOn: Binding(
                    get: { startAtLogin.isEnabled },
                    set: { newValue in
                        do {
                            if newValue { try startAtLogin.enable() } else { try startAtLogin.disable() }
                        } catch {
                            NSLog("Failed to toggle login item: \(error)")
                        }
                    })
                )
            }

            Section(header: Text("Behavior")) {
                Toggle("Auto-expand on play", isOn: $store.autoExpandOnPlay)
                Toggle("Ignore mouse when idle", isOn: $store.ignoreMouseEventsWhenIdle)
                Toggle("Hover to expand", isOn: $store.hoverToExpand)
            }

            Section(header: Text("Visuals")) {
                Toggle("Enable blur", isOn: $store.blurEnabled)
                Toggle("Enable glow", isOn: $store.glowEnabled)
                Slider(value: $store.animationIntensity, in: 0.2...1.0) {
                    Text("Animation intensity")
                }
            }
        }
        .padding(20)
        .frame(width: 360)
    }
}
