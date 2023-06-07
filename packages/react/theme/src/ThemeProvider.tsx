import {forwardRef, PropsWithChildren, Ref, useImperativeHandle, useMemo, useState} from 'react'
import {ThemeProvider} from '@emotion/react'

import {getTheme} from './theme'

type EmotionThemeProviderProps = {
    isDarkMode?: boolean
}

export type ChangeThemeRef = {
    changeMode: (mode: 'light' | 'dark') => void
}

export const EmotionThemeProvider = forwardRef(function EmotionThemeProvider(
    {isDarkMode = false, children}: PropsWithChildren<EmotionThemeProviderProps>,
    changeRef: Ref<ChangeThemeRef>,
) {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(isDarkMode)

    const theme = useMemo(() => getTheme(isDarkTheme), [isDarkTheme])

    useImperativeHandle(changeRef, () => ({
        changeMode: (mode) => setIsDarkTheme(mode !== 'light'),
    }))

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
})
