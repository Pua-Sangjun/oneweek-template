import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {memo} from 'react'

import {StackScreenParams} from '$constants/routes'
import {WebView} from '$webview/index'
import {WebViewOptionsProvider} from '$webview/contexts/options'

type WebViewScreenProps = NativeStackScreenProps<StackScreenParams, 'webview'>

export const WebViewScreen = memo(function WebViewScreen({route}: WebViewScreenProps) {
    return (
        <WebViewOptionsProvider>
            <WebView uri={route.params?.uri} showLoadingBar />
        </WebViewOptionsProvider>
    )
})
