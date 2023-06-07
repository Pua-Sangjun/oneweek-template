import {getTheme} from '@oneweek-react/theme'
import {useMemo} from 'react'
import {useColorScheme} from 'react-native'
import {useTheme as useStyledComponentsTheme} from 'styled-components'

export default function useTheme() {
    const theme = useStyledComponentsTheme()
    const colorScheme = useColorScheme()
    const isDarkMode = useMemo(() => colorScheme === 'dark', [colorScheme])
    if (!theme) {
        return getTheme(isDarkMode)
    }
    return theme
}
