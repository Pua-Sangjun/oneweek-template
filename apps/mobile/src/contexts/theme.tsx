import {ReactNode, useEffect, useMemo, useState} from 'react'
import {Appearance} from 'react-native'
import {ThemeProvider} from '@emotion/react'
import {getTheme} from '@oneweek-react/theme'

export function EmotionThemeProvider({children}: {children: ReactNode}) {
    const colorScheme = Appearance.getColorScheme()
    const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === 'dark')

    useEffect(() => {
        const subscription = Appearance.addChangeListener(function (preference) {
            setIsDarkMode(preference.colorScheme === 'dark')
        })
        return () => {
            subscription.remove()
        }
    }, [])

    const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode])

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
