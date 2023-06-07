import {memo} from 'react'
import {StatusBar} from 'react-native'
import {useTheme} from '@emotion/react'

import {UIOptions} from '$webview/contexts/options'

export const WebViewStatusBar = memo(function WebViewStatusBar({
    darkTheme,
    enableHeader,
    enableSafeAreaInsets,
}: Pick<UIOptions, 'darkTheme' | 'enableHeader' | 'enableSafeAreaInsets'>) {
    const {colors} = useTheme()

    if (enableHeader || enableSafeAreaInsets) {
        return null
    }

    return (
        <StatusBar
            backgroundColor={darkTheme ? colors.white : colors.black}
            barStyle={darkTheme ? 'light-content' : 'dark-content'}
        />
    )
})
