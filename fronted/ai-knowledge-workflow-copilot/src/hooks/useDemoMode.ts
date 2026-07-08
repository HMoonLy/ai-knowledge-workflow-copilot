import { useEffect, useState } from 'react'
import { isDemoMode, subscribeDemoMode } from '../lib/demoMode'

export function useDemoMode() {
    const [demoModeEnabled, setDemoModeEnabled] = useState(isDemoMode())

    useEffect(() => {
        return subscribeDemoMode(() => {
            setDemoModeEnabled(isDemoMode())
        })
    }, [])

    return demoModeEnabled
}
