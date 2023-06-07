// import {NativeStackNavigationEventMap, NativeStackScreenProps} from '@react-navigation/native-stack'
// import {memo, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
// import {useEvent} from '@oneweek-react/hook'
// import NativeWebView, {WebViewMessageEvent, WebViewNavigation} from 'react-native-webview'
// import {StackNavigationState, EventListenerCallback, EventMapCore} from '@react-navigation/native'
// import queryString from 'query-string'
// import {Dimensions, RefreshControl, ScrollView, StatusBar} from 'react-native'
// import {useHeaderHeight} from '@react-navigation/elements'

// import {StackScreenParams} from '$constants/routes'
// import {WebView} from '$webview/index.common'
// import {useAlert} from '$contexts/alert'
// import {View} from '$commons/components/View'
// import {useWebviewEventHandler} from '$webview/interface/native'
// import {WebViewAlert} from '$webview/components/WebViewAlert'
// import {isAndroid, isIOS} from '$constants/platform'
// import {assertBoolean} from '$commons/utils/common'
// import {HeaderBackButton} from '$commons/components/header/BackButton'
// import {useDarkTheme} from '$hooks/useDarkTheme'

// type WebViewScreenProps = NativeStackScreenProps<StackScreenParams, 'webview'>
// type WebViewStackNavigateBeforeRemoveCallback = EventListenerCallback<
//     NativeStackNavigationEventMap & EventMapCore<StackNavigationState<StackScreenParams>>,
//     'beforeRemove'
// >

// const windowHeight = Dimensions.get('window').height

// export const WebViewScreen = memo(function WebViewScreen({route, navigation}: WebViewScreenProps) {
//     const {showAlert} = useAlert()
//     const webviewRef = useRef<NativeWebView>(null)
//     const headerHeight = useHeaderHeight()
//     const {isDarkTheme, colors} = useDarkTheme()
//     const canGoBackRef = useRef<boolean>(false)
//     const [webViewScrollHeight, setWebViewScrollHeight] = useState<number>(windowHeight)

//     // TODO : ui option useEffect로 style 처리할 수 있도록 state로 변경
//     const {uri, navigationOptions, uiOptions} = useMemo(() => {
//         const {url, query} = queryString.parseUrl(route.params?.uri || '')
//         const {
//             navbar,
//             backSwipeable,
//             scrollable,
//             enableSafeAreaInsets,
//             enableHeader,
//             showLoadingBar,
//             darkTheme,
//             pullToRefresh,
//             ...rest
//         } = query
//         const navigationOptions = {
//             navbar: assertBoolean(navbar, {default: false}),
//             backSwipeable: assertBoolean(backSwipeable, {default: true}),
//         } as const
//         const uiOptions = {
//             enableHeader: assertBoolean(enableHeader, {default: true}),
//             enableSafeAreaInsets: assertBoolean(enableSafeAreaInsets, {default: true}),
//             showLoadingBar: assertBoolean(showLoadingBar, {default: true}),
//             scrollable: assertBoolean(scrollable, {default: true}),
//             darkTheme: assertBoolean(darkTheme, {default: isDarkTheme}),
//             pullToRefresh: assertBoolean(pullToRefresh, {default: true}),
//         } as const
//         return {uri: `${url}?${queryString.stringify(rest)}`, navigationOptions, uiOptions}
//     }, [route.params?.uri, isDarkTheme])

//     const getResponseFromWebViewEvent = useWebviewEventHandler()

//     const handleWebViewLoadError = useEvent(() => {
//         showAlert({
//             title: '일시적으로 오류가 발생했어요',
//             message: '이전 화면으로 이동해요',
//             success: {callback: navigation.goBack},
//             cancel: {label: '새로고침', callback: webviewRef.current?.reload},
//             preventOutsideClick: true,
//         })
//     })

//     /**
//      * webview에서 오는 message를 handle하고 그 결과를 다시 webview로 send
//      */
//     const handleWebViewMessage = useEvent(async (event: WebViewMessageEvent) => {
//         if (!webviewRef.current) {
//             return
//         }
//         const message = await getResponseFromWebViewEvent(event)
//         if (!message) {
//             return
//         }
//         if (message.type === 'info.scrollHeight') {
//             setWebViewScrollHeight(message.payload.scrollHeight)
//             return
//         }
//         if (isAndroid && message.type === 'router.clientHistory') {
//             canGoBackRef.current = event.nativeEvent.canGoBack
//             return
//         }
//         webviewRef.current.postMessage(JSON.stringify(message))
//     })

//     const handleWebViewInternalNavigation = useEvent((event: WebViewNavigation) => {
//         canGoBackRef.current = event.canGoBack
//     })

//     /**
//      * webview query param을 통한 ui 상태 설정
//      */
//     useLayoutEffect(() => {
//         const {navbar, backSwipeable} = navigationOptions
//         navigation.setOptions({
//             headerShown: navbar,
//             gestureEnabled: backSwipeable,
//             // 기존 tabHeader transparent 처리 및 background style도 transparent 처리
//             headerTransparent: true,
//             ...(navbar && {headerStyle: {backgroundColor: 'transparent'}}),
//         })
//     }, [navigation, navigationOptions])

//     /**
//      * webview 내부 routing을 감지해서 back button handle하는 effect 두개
//      */
//     useEffect(() => {
//         if (!uiOptions.enableHeader) {
//             return
//         }

//         function handleWebViewBackButton() {
//             canGoBackRef.current ? webviewRef.current?.goBack() : navigation.goBack()
//         }

//         navigation.setOptions({
//             headerLeft: () => <HeaderBackButton onPress={handleWebViewBackButton} />,
//         })
//     }, [navigation, uiOptions.enableHeader])

//     /**
//      * android의 물리적 back button을 리스닝하는 함수
//      * ios는 back swipe가 일어난 다음에 beforeRemove event 발생
//      */
//     useEffect(() => {
//         if (isIOS) {
//             return
//         }
//         const handleWebViewNavigate: WebViewStackNavigateBeforeRemoveCallback = (e) => {
//             if (canGoBackRef.current) {
//                 e.preventDefault()
//                 webviewRef.current?.goBack()
//                 return
//             }
//             navigation.dispatch(e.data.action)
//         }

//         navigation.addListener('beforeRemove', handleWebViewNavigate)

//         return () => {
//             navigation.removeListener('beforeRemove', handleWebViewNavigate)
//         }
//     }, [navigation])

//     if (!uri) {
//         return null
//     }

//     return (
//         <View>
//             {!(uiOptions.enableHeader || uiOptions.enableSafeAreaInsets) && (
//                 <StatusBar
//                     backgroundColor={uiOptions.darkTheme ? colors.white : colors.black}
//                     barStyle={uiOptions.darkTheme ? 'light-content' : 'dark-content'}
//                 />
//             )}
//             {uiOptions.enableHeader && <View css={{height: `${headerHeight}px`}} />}
//             <ScrollView
//                 contentContainerStyle={{
//                     backgroundColor: colors.white,
//                     flexGrow: 1,
//                     // height: 1000,
//                 }}
//                 refreshControl={
//                     uiOptions.pullToRefresh ? (
//                         <RefreshControl
//                             onRefresh={webviewRef.current?.reload}
//                             refreshing={false}
//                             enabled={uiOptions.pullToRefresh}
//                         />
//                     ) : undefined
//                 }
//                 onLayout={(e) => {
//                     console.log(e.nativeEvent)
//                 }}
//                 onScroll={(e) => {
//                     console.log(e.nativeEvent)
//                 }}>
//                 {uiOptions.enableHeader && <View css={{height: `20px`}} />}
//                 <WebView
//                     ref={webviewRef}
//                     uri={uri}
//                     showLoadingBar={uiOptions.showLoadingBar}
//                     enableHeader={uiOptions.enableHeader}
//                     onMessage={handleWebViewMessage}
//                     onError={handleWebViewLoadError}
//                     onNavigationStateChange={handleWebViewInternalNavigation}
//                     scrollEnabled={false}
//                     automaticallyAdjustContentInsets={false}>
//                     <View css={{height: `20px`}} />
//                 </WebView>
//             </ScrollView>
//             <WebViewAlert webviewRef={webviewRef} />
//         </View>
//     )
// })
export {}
