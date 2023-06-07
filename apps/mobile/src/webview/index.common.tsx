import {ComponentType, forwardRef, memo, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef} from 'react'
import NativeWebView, {WebViewMessageEvent, WebViewProps as NativeWebViewProps} from 'react-native-webview'
import {getUserAgentSync} from 'react-native-device-info'
import {useNavigation} from '@react-navigation/native'
import {useEffectOnce, useEvent} from '@oneweek-react/hook'
import {Keyboard} from 'react-native'

import {WebViewAlert} from './components/WebViewAlert'
import {useWebviewEventHandler} from './interface/native'
import {parseConfigs, useWebViewOptions} from './contexts/options'

import {useDeviceStyle} from '$webview/interface/info'
import {injectedInterface} from '$webview/interface/client'
import {EmptyView} from '$commons/components/View'
import {FullSizeLoading} from '$commons/components/Loading'
import {useAlert} from '$contexts/alert'
import {useDarkTheme} from '$hooks/useDarkTheme'
import {PopupError} from '$commons/errors/popupError'
import {Button} from '$commons/components/Button'
import {Text} from '$commons/components/Text'

export type WebViewCommonProps = NativeWebViewProps & {
    uri?: string
    showLoadingBar?: boolean
    LoadingElement?: ComponentType
    enableHeader?: boolean
}

const WebViewEmptyView = memo(function WebViewEmptyView() {
    // 에러 메세지 및 로깅 (view 처리 해야댐) > 사실상 popup error 처리해서 이슈 없음
    return <EmptyView style={{position: 'absolute', top: 0, left: 0}} />
})

export type WebViewForwardRef = {
    goBack?: () => void
    reload?: () => void
    postMessage?: (message: string) => void
}

export const WebViewCommon = memo(
    forwardRef(function WebViewCommon(
        {uri = '', LoadingElement, onMessage, ...props}: WebViewCommonProps,
        ref: Ref<WebViewForwardRef>,
    ) {
        const {showAlert} = useAlert()
        const navigation = useNavigation()
        const webviewRef = useRef<NativeWebView>(null)
        const {isDarkTheme, colors} = useDarkTheme()
        const {headerHeight} = useDeviceStyle()
        const getResponseFromWebViewEvent = useWebviewEventHandler()
        const {
            uiOptions,
            setUIOptions,
            navigationOptions: {headerRight},
            setNavigationOptions,
            resetOptions,
        } = useWebViewOptions()

        const {
            url,
            uiOptions: parsedUIOptions,
            navigationOptions: parsedNavigationOptions,
        } = useMemo(() => parseConfigs(uri, isDarkTheme), [uri, isDarkTheme])

        useEffectOnce(() => {
            setUIOptions(parsedUIOptions)
            setNavigationOptions((options) => ({...options, ...parsedNavigationOptions}))
        })

        useImperativeHandle(ref, () => ({
            goBack: webviewRef.current?.goBack,
            reload: webviewRef.current?.reload,
            postMessage: webviewRef.current?.postMessage,
        }))

        const handleWebViewLoadError = useEvent(() => {
            showAlert({
                title: '일시적으로 오류가 발생했어요',
                message: '이전 화면으로 이동해요',
                success: {callback: navigation.goBack},
                cancel: {label: '새로고침', callback: webviewRef.current?.reload},
                preventOutsideClick: true,
            })
        })

        const handleWebViewReceivedMessage = useEvent(async (event: WebViewMessageEvent) => {
            const message = await getResponseFromWebViewEvent(event)
            if (!message) {
                return
            }
            // 다른 이벤트로 처리해야되는 경우 onMessage로 처리
            if (['info.scrollHeight', 'router.clientHistory'].includes(message.type)) {
                onMessage?.(event)
                return
            }
            webviewRef.current?.postMessage(JSON.stringify(message))
        })

        const renderError = useEvent(() => {
            return <WebViewEmptyView />
        })

        // TODO : pull to refresh 로딩 처리 다시해야됨...
        const renderLoading = useEvent(() => {
            if (!uiOptions.showLoadingBar) {
                return <WebViewEmptyView />
            }
            if (LoadingElement) {
                return <LoadingElement />
            }
            return <FullSizeLoading enableHeader={uiOptions.enableHeader} />
        })

        const handleLoadingStart = useEvent(() => {
            resetOptions({uiOptions: parsedUIOptions, navigationOptions: parsedNavigationOptions})
        })

        useEffect(() => {
            if (!uri) {
                throw new PopupError({
                    title: '잘못된 접근입니다.',
                    onPress: navigation.goBack,
                })
            }
        }, [navigation, uri])

        const handlePressRightButton = useCallback(
            (key: string) => () => {
                const payload = {
                    type: 'option.navigation.rightButton',
                    payload: key,
                }
                webviewRef.current?.postMessage(JSON.stringify(payload))
            },
            [],
        )

        useEffect(() => {
            navigation.setOptions({
                headerRight: () => {
                    if (!headerRight || headerRight.length === 0) {
                        return null
                    }
                    return headerRight.map(({key, title}) => {
                        // TODO: icon rendering
                        return (
                            <Button
                                key={key}
                                onPress={handlePressRightButton(key)}
                                css={{width: 50, height: headerHeight}}
                                style={{marginRight: -10, backgroundColor: 'transparent'}}>
                                <Text css={{size: 'medium'}}>{title}</Text>
                            </Button>
                        )
                    })
                },
            })
        }, [navigation, headerRight, headerHeight, handlePressRightButton])

        useEffect(() => {
            const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
                // console.log('Keyboard Shown')
            })
            const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
                // console.log('Keyboard Hidden')
            })

            return () => {
                showSubscription.remove()
                hideSubscription.remove()
            }
        }, [])

        if (!uri) {
            return null
        }

        return (
            <>
                <NativeWebView
                    ref={webviewRef}
                    /**
                     * webview injected js
                     */
                    injectedJavaScriptBeforeContentLoaded={injectedInterface}
                    /**
                     * TODO : uri validation
                     */
                    source={{uri: url}}
                    /**
                     * webview loading, error 상태 callback 핸들러
                     */
                    onMessage={handleWebViewReceivedMessage}
                    onError={handleWebViewLoadError}
                    onHttpError={handleWebViewLoadError}
                    onLoadStart={handleLoadingStart}
                    // onLoadEnd={endLoading}
                    /**
                     * render loading 시작 state 설정 및 Loading, Error View 처리
                     */
                    startInLoadingState
                    renderError={renderError}
                    renderLoading={renderLoading}
                    /**
                     * userAgent
                     */
                    userAgent={getUserAgentSync()}
                    style={{backgroundColor: colors.white}}
                    {...props}
                />
                {/* {loading && renderLoading()} */}
                <WebViewAlert webviewRef={webviewRef} />
            </>
        )
    }),
)
