import {PropsWithChildren, forwardRef, Ref, useMemo, useState, useImperativeHandle} from 'react'
import {ThemeProvider} from 'styled-components'

import {getTheme} from '../constant/colors'

type StyledComponentsThemeProviderProps = {
    isDarkMode?: boolean
}

export type ChangeThemeRef = {
    changeMode: (mode: 'light' | 'dark') => void
}

export const StyledComponentThemeProvider = forwardRef(function StyledComponentThemeProvider(
    {isDarkMode = false, children}: PropsWithChildren<StyledComponentsThemeProviderProps>,
    changeRef: Ref<ChangeThemeRef>,
) {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(isDarkMode)

    const theme = useMemo(() => getTheme(isDarkTheme), [isDarkTheme])

    useImperativeHandle(changeRef, () => ({
        changeMode: (mode) => setIsDarkTheme(mode !== 'light'),
    }))

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
})
