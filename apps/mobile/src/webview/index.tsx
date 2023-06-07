import {useCallback, useRef} from 'react'
import ReactNativeWebView, {WebViewMessageEvent} from 'react-native-webview'

import {getResponseFromWebViewEvent} from './interface'

type WebViewProps = {
    onLoadError?: () => void
    uri: string
}

export function WebView({uri}: WebViewProps) {
    const webviewRef = useRef<ReactNativeWebView>(null)

    const handleWebViewMessage = useCallback(async (event: WebViewMessageEvent) => {
        if (!webviewRef.current) {
            return
        }
        const message = await getResponseFromWebViewEvent(event)
        webviewRef.current.postMessage(JSON.stringify(message))
    }, [])

    return (
        <ReactNativeWebView
            ref={webviewRef}
            /**
             * TODO : uri validation
             */
            source={{uri}}
            /**
             * horizontal swipe gestures for ios
             */
            allowsBackForwardNavigationGestures
            /**
             * webview callback 핸들러
             */
            onMessage={handleWebViewMessage}
            /**
             * android web view 강제 종료로 인해 추가 (https://eloquence-developers.tistory.com/156)
             *  */
            style={{opacity: 0.99, minHeight: 1}}
        />
    )
}
