import {useMemo} from 'react'
import {useColorScheme} from 'react-native'

import useTheme from '$hooks/useTheme'

export function useDarkTheme() {
    const colorScheme = useColorScheme()
    const {colors} = useTheme()
    return useMemo(() => ({isDarkTheme: colorScheme === 'dark', colors}), [colorScheme, colors])
}
