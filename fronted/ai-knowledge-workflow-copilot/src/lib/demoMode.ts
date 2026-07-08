let demoMode = false

const demoModeEventName = 'ai-knowledge-demo-mode-change'

export function isDemoMode() {
    return demoMode
}

export function enableDemoMode() {
    if (demoMode) return

    demoMode = true
    window.dispatchEvent(new CustomEvent(demoModeEventName))
}

export function subscribeDemoMode(listener: () => void) {
    window.addEventListener(demoModeEventName, listener)

    return () => {
        window.removeEventListener(demoModeEventName, listener)
    }
}
