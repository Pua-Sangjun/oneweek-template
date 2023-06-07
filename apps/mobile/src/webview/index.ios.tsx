/**
 * horizontal swipe gestures for ios
	allowsBackForwardNavigationGestures
    keyboard avoiding view
*/

import {memo, useEffect, useMemo, useRef, useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import {useEvent} from '@oneweek-react/hook'
import {WebViewNavigation} from 'react-native-webview'
import {WebViewScrollEvent} from 'react-native-webview/lib/WebViewTypes'
import {throttle} from '@oneweek/util'

import {WebViewCommon, WebViewCommonProps, WebViewForwardRef} from './index.common'
import {useWebViewOptions} from './contexts/options'
import {useDeviceStyle} from './interface/info'
import {WebViewStatusBar} from './components/WebViewStatusBar'
import {WebViewHeaderShadow} from './components/WebViewHeaderShadow'

import {HeaderBackButton} from '$commons/components/header/BackButton'
import {View} from '$commons/components/View'

type WebViewAndroidProps = WebViewCommonProps

export const WebView = memo(function WebView({uri}: WebViewAndroidProps) {
    const webviewRef = useRef<WebViewForwardRef>(null)
    const canGoBackRef = useRef<boolean>(false)
    const navigation = useNavigation()
    const {safeAreaInsets, headerHeight} = useDeviceStyle()
    const {uiOptions, navigationOptions} = useWebViewOptions()
    const [showHeaderShadow, setShowHeaderShadow] = useState<boolean>(false)

    /**
     * @only ios
     * webview 내부 routing을 감지해서 ref에 저장
     */
    const handleWebViewInternalNavigation = useEvent((event: WebViewNavigation) => {
        canGoBackRef.current = event.canGoBack
    })
    /**
     * webview 내부 routing을 감지해서 back button handle하는 effect
     */
    useEffect(() => {
        if (!uiOptions.enableHeader) {
            return
        }

        function handleWebViewBackButton() {
            canGoBackRef.current ? webviewRef.current?.goBack?.() : navigation.goBack()
        }

        navigation.setOptions({
            headerLeft: () => <HeaderBackButton onPress={handleWebViewBackButton} />,
        })
    }, [navigation, uiOptions.enableHeader])

    const handleWebViewInternalScroll = useEvent((e: WebViewScrollEvent) => {
        const yOffset = e.nativeEvent.contentOffset.y
        setShowHeaderShadow(yOffset > 0)
    })

    const [throttledHandleWebViewInternalScroll] = throttle(handleWebViewInternalScroll, 100)

    const safeAreaInsetsPaddings = useMemo(() => {
        const {enableHeader, enableSafeAreaInsets} = uiOptions
        if (!enableSafeAreaInsets) {
            return '0px'
        }
        if (enableHeader) {
            return `0px 0px ${safeAreaInsets.bottom}px 0px`
        }
        return `${safeAreaInsets.top}px 0px ${safeAreaInsets.bottom}px 0px`
    }, [safeAreaInsets.bottom, safeAreaInsets.top, uiOptions])

    return (
        <View css={{padding: safeAreaInsetsPaddings}}>
            <WebViewStatusBar {...uiOptions} />
            {uiOptions.enableHeader && <View css={{height: `${safeAreaInsets.top + headerHeight - 5}px`}} />}
            {showHeaderShadow && navigationOptions.headerShadowVisible && <WebViewHeaderShadow />}
            <WebViewCommon
                ref={webviewRef}
                uri={uri}
                pullToRefreshEnabled={uiOptions.pullToRefresh}
                allowsBackForwardNavigationGestures
                onNavigationStateChange={handleWebViewInternalNavigation}
                onScroll={throttledHandleWebViewInternalScroll}
            />
        </View>
    )
})
