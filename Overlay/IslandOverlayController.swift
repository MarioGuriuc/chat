import SwiftUI
import AppKit
import Combine

final class IslandOverlayController: NSObject {
    private let panel: IslandPanel
    private let hosting: NSHostingController<IslandContainerView>
    private var observation: NSKeyValueObservation?
    private var store: IslandStore
    private var ignoreMouseCancellable: AnyCancellable?
    private var sizeCancellable: AnyCancellable?

    init(store: IslandStore) {
        self.store = store
        let contentView = IslandContainerView(store: store)
        hosting = NSHostingController(rootView: contentView)
        panel = IslandPanel(contentViewController: hosting)
        super.init()
        panel.delegate = self
        updatePanelFrame(animated: false)
        registerScreenChangeNotifications()
        observeMousePolicy()
        observeSizeChanges()
    }

    func show() {
        panel.orderFrontRegardless()
    }

    func hide() {
        panel.orderOut(nil)
    }

    private func registerScreenChangeNotifications() {
        NotificationCenter.default.addObserver(self, selector: #selector(screenParametersDidChange), name: NSApplication.didChangeScreenParametersNotification, object: nil)
    }

    @objc private func screenParametersDidChange() {
        updatePanelFrame(animated: false)
    }

    private func positionPanel() {
        guard let screen = NSScreen.main else { return }
        let size = panel.frame.size
        let x = screen.frame.midX - size.width / 2
        let y = screen.visibleFrame.maxY - size.height - 12
        panel.setFrameOrigin(NSPoint(x: x, y: y))
    }

    private func updatePanelFrame(animated: Bool) {
        hosting.view.layoutSubtreeIfNeeded()
        let targetSize = hosting.view.fittingSize
        panel.setContentSize(targetSize)
        if animated {
            NSAnimationContext.runAnimationGroup { ctx in
                ctx.duration = 0.2
                positionPanel()
            }
        } else {
            positionPanel()
        }
    }

    private func observeMousePolicy() {
        ignoreMouseCancellable = store.$displayState
            .combineLatest(store.$ignoreMouseEventsWhenIdle)
            .sink { [weak panel] state, ignore in
                DispatchQueue.main.async {
                    let shouldIgnore = ignore && state == .idle
                    panel?.ignoresMouseEvents = shouldIgnore
                }
            }
    }

    private func observeSizeChanges() {
        sizeCancellable = store.$displayState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.updatePanelFrame(animated: true)
            }
    }
}

extension IslandOverlayController: NSPanelDelegate {
    func windowDidResignKey(_ notification: Notification) {
        store.collapse()
    }
}
