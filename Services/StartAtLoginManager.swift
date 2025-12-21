import Foundation
import ServiceManagement

final class StartAtLoginManager: ObservableObject {
    private let appService = SMAppService.mainApp

    @Published private(set) var isEnabled: Bool = false

    init() {
        isEnabled = (try? appService.status()) == .enabled
    }

    func enable() throws {
        try appService.register()
        isEnabled = true
    }

    func disable() throws {
        try appService.unregister()
        isEnabled = false
    }
}
