let demoMode =
    import.meta.env.VITE_FORCE_DEMO_MODE === '1' ||
    (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL)

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
