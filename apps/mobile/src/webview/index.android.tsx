import {memo, useEffect, useMemo, useRef, useState} from 'react'
import {EventListenerCallback, EventMapCore, StackNavigationState, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationEventMap} from '@react-navigation/native-stack'
import {useEvent} from '@oneweek-react/hook'
import {WebViewMessageEvent} from 'react-native-webview'
import {ScrollView} from 'react-native-gesture-handler'
import {useTheme} from '@emotion/react'
import {useHeaderHeight} from '@react-navigation/elements'
import {WebViewScrollEvent} from 'react-native-webview/lib/WebViewTypes'
import styled from '@emotion/native'

import {WebViewCommon, WebViewCommonProps, WebViewForwardRef} from './index.common'
import {useWebViewOptions} from './contexts/options'
import {WebViewStatusBar} from './components/WebViewStatusBar'
import {WebViewHeaderShadow} from './components/WebViewHeaderShadow'

import {View} from '$commons/components/View'
import {StackScreenParams} from '$constants/routes'
import {HeaderBackButton} from '$commons/components/header/BackButton'

type WebViewAndroidProps = WebViewCommonProps

type WebViewStackNavigateBeforeRemoveCallback = EventListenerCallback<
    NativeStackNavigationEventMap & EventMapCore<StackNavigationState<StackScreenParams>>,
    'beforeRemove'
>

const StyledRefreshControl = styled.RefreshControl`
    z-index: -1;
`

export const WebView = memo(function WebView({uri}: WebViewAndroidProps) {
    const {colors} = useTheme()
    const navigation = useNavigation()
    const scrollViewRef = useRef<ScrollView>(null)
    const webviewRef = useRef<WebViewForwardRef>(null)
    const canGoBackRef = useRef<boolean>(false)
    const headerHeight = useHeaderHeight()
    /**
     * 만약에 강제종료가 된다면 필요
     * android webview 가 height 0인 scrollView에 있을 때 강제 종료 (https://eloquence-developers.tistory.com/156) // opacity: 0.99, minHeight: 1,
     *  */
    const [enablePullToRefresh, setEnablePullToRefresh] = useState<boolean>(true)
    const [showHeaderShadow, setShowHeaderShadow] = useState<boolean>(false)

    const {uiOptions, navigationOptions} = useWebViewOptions()

    const handleGoBackFromMessage = useEvent((event: WebViewMessageEvent) => {
        try {
            const {type} = JSON.parse(event.nativeEvent.data)
            switch (type) {
                case 'router.clientHistory':
                    // TODO : 스크롤 유지 할건지?
                    scrollViewRef.current?.scrollTo({y: 0, animated: false})
                    canGoBackRef.current = event.nativeEvent.canGoBack
                    break
                default:
                    break
            }
        } catch {
            // ignored
        }
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

    /**
     * android의 물리적 back button을 리스닝하는 함수
     * ios는 back swipe가 일어난 다음에 beforeRemove event 발생
     */
    useEffect(() => {
        const handleWebViewNavigate: WebViewStackNavigateBeforeRemoveCallback = (e) => {
            if (canGoBackRef.current) {
                e.preventDefault()
                webviewRef.current?.goBack?.()
                return
            }
            navigation.dispatch(e.data.action)
        }

        navigation.addListener('beforeRemove', handleWebViewNavigate)

        return () => {
            navigation.removeListener('beforeRemove', handleWebViewNavigate)
        }
    }, [navigation])

    const handleWebViewInternalScroll = useEvent((e: WebViewScrollEvent) => {
        const yOffset = e.nativeEvent.contentOffset.y
        setEnablePullToRefresh(yOffset < headerHeight)
        setShowHeaderShadow(yOffset > 0)
    })

    const refreshControl = useMemo(() => {
        return (
            <StyledRefreshControl
                onRefresh={() => {
                    webviewRef.current?.reload?.()
                }}
                enabled={enablePullToRefresh && uiOptions.pullToRefresh}
                refreshing={false}
            />
        )
    }, [uiOptions.pullToRefresh, enablePullToRefresh])

    const scrollViewContainerStyle = useMemo(
        () => ({
            backgroundColor: colors.white,
            flexGrow: 1,
            minHeight: '100%',
        }),
        [colors.white],
    )

    return (
        <View>
            <WebViewStatusBar {...uiOptions} />
            {uiOptions.enableHeader && <View css={{height: `${headerHeight}px`}} />}
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={scrollViewContainerStyle}
                refreshControl={refreshControl}>
                {showHeaderShadow && navigationOptions.headerShadowVisible && <WebViewHeaderShadow />}
                <WebViewCommon
                    ref={webviewRef}
                    uri={uri}
                    onMessage={handleGoBackFromMessage}
                    scrollEnabled={false}
                    onScroll={handleWebViewInternalScroll}
                />
            </ScrollView>
        </View>
    )
})
