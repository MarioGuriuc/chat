import SwiftUI
import AppKit
import Combine
import ServiceManagement

@main
struct DynamicIslandApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        Settings {
            PreferencesView()
        }
    }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem!
    private var menu: NSMenu!
    private var islandController: IslandOverlayController!
    private var store = IslandStore.shared
    private var startAtLoginManager = StartAtLoginManager()
    private var nowPlayingService: NowPlayingService!
    private var cancellables = Set<AnyCancellable>()

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory) // hide dock icon
        setupMenuBar()
        islandController = IslandOverlayController(store: store)
        nowPlayingService = NowPlayingService()
        bindState()
        nowPlayingService.start()
        islandController.show()
    }

    private func bindState() {
        nowPlayingService.nowPlayingPublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] info in
                self?.store.update(with: info)
            }
            .store(in: &cancellables)
    }

    private func setupMenuBar() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "capsule.portrait", accessibilityDescription: "Island")
        }
        menu = NSMenu()
        menu.addItem(withTitle: "Show Island", action: #selector(showIsland), keyEquivalent: "")
        menu.addItem(withTitle: "Hide Island", action: #selector(hideIsland), keyEquivalent: "")
        menu.addItem(NSMenuItem.separator())
        let loginItem = NSMenuItem(title: "Start at Login", action: #selector(toggleLogin), keyEquivalent: "")
        loginItem.state = startAtLoginManager.isEnabled ? .on : .off
        menu.addItem(loginItem)
        menu.addItem(withTitle: "Preferences…", action: #selector(openPreferences), keyEquivalent: ",")
        menu.addItem(NSMenuItem.separator())
        menu.addItem(withTitle: "Quit", action: #selector(quit), keyEquivalent: "q")
        statusItem.menu = menu
    }

    @objc private func showIsland() {
        islandController.show()
    }

    @objc private func hideIsland() {
        islandController.hide()
    }

    @objc private func openPreferences() {
        NSApp.sendAction(Selector(("showPreferencesWindow:")), to: nil, from: nil)
    }

    @objc private func toggleLogin(_ sender: NSMenuItem) {
        do {
            if startAtLoginManager.isEnabled {
                try startAtLoginManager.disable()
                sender.state = .off
            } else {
                try startAtLoginManager.enable()
                sender.state = .on
            }
        } catch {
            NSLog("Failed to toggle login item: \(error)")
        }
    }

    @objc private func quit() {
        NSApp.terminate(nil)
    }
}
