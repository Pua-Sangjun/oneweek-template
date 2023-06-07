import {useTheme} from '@emotion/react'
import {useMemo} from 'react'
import {useColorScheme} from 'react-native'

export function useDarkTheme() {
    const colorScheme = useColorScheme()
    const {colors} = useTheme()
    return useMemo(() => ({isDarkTheme: colorScheme === 'dark', colors}), [colorScheme, colors])
}
