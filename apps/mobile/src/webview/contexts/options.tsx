import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import queryString from 'query-string'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useEvent} from '@oneweek-react/hook'

import {assertBoolean} from '$commons/utils/common'
import {useDarkTheme} from '$hooks/useDarkTheme'
import {StackScreenParams} from '$constants/routes'
import {useDeviceStyle} from '$webview/interface/info'

export type UIOptions = {
    enableHeader: boolean
    enableSafeAreaInsets: boolean
    showLoadingBar: boolean
    darkTheme: boolean
    pullToRefresh: boolean
}

export const initialUIOptions: UIOptions = {
    enableHeader: true,
    enableSafeAreaInsets: true,
    showLoadingBar: true,
    darkTheme: false,
    pullToRefresh: true,
}

export type NavigationOptions = {
    navbar: boolean
    backSwipeable: boolean
    headerLeft: 'back' | 'close'
    headerTitle: string
    headerRight?: Array<{key: string; icon?: string; title: string}>
    headerShadowVisible: boolean
}

export const initialNavigationOptions: NavigationOptions = {
    navbar: false,
    backSwipeable: false,
    headerLeft: 'back',
    headerTitle: '',
    headerRight: [],
    headerShadowVisible: true,
}

type ResetOptions = {
    uiOptions?: Partial<UIOptions>
    navigationOptions?: Partial<NavigationOptions>
}

export type WebViewOptionsContext = {
    uiOptions: UIOptions
    setUIOptions: Dispatch<SetStateAction<UIOptions>>
    navigationOptions: NavigationOptions
    setNavigationOptions: Dispatch<SetStateAction<NavigationOptions>>
    resetOptions: ({uiOptions, navigationOptions}: ResetOptions) => void
}

const Context = createContext<WebViewOptionsContext | undefined>(undefined)

export function WebViewOptionsProvider({children}: {children: ReactNode}) {
    const navigation = useNavigation<NativeStackNavigationProp<StackScreenParams, 'webview', undefined>>()
    const {isDarkTheme, colors} = useDarkTheme()
    const {headerHeight} = useDeviceStyle()

    const [uiOptions, setUIOptions] = useState<UIOptions>({...initialUIOptions})
    const [navigationOptions, setNavigationOptions] = useState<NavigationOptions>({...initialNavigationOptions})

    const resetOptions = useEvent(({uiOptions, navigationOptions}: ResetOptions) => {
        setUIOptions({...initialUIOptions, ...uiOptions})
        setNavigationOptions({...initialNavigationOptions, ...navigationOptions})
    })

    /**
     * webview query param을 통한 ui 상태 설정
     */
    useEffect(() => {
        const {navbar, backSwipeable, headerTitle} = navigationOptions
        navigation.setOptions({
            headerShown: navbar,
            gestureEnabled: backSwipeable,
            headerTitle,
            // 기존 tabHeader transparent 처리 및 background style도 transparent 처리
            headerTransparent: true,
            ...(navbar && {
                headerStyle: {
                    backgroundColor: 'transparent',
                },
            }),
        })
    }, [colors.primarySub, colors.quaternary, headerHeight, isDarkTheme, navigation, navigationOptions])

    const values = useMemo(
        () => ({uiOptions, setUIOptions, navigationOptions, setNavigationOptions, resetOptions}),
        [uiOptions, navigationOptions, resetOptions],
    )

    return <Context.Provider value={values}>{children}</Context.Provider>
}

export function useWebViewOptions() {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useWebViewOptions must be within WebViewOptionsProvider')
    }
    return context
}

export function parseConfigs(uri: string, isDarkTheme: boolean) {
    const {query} = queryString.parseUrl(uri || '')
    const {navbar, backSwipeable, enableSafeAreaInsets, enableHeader, showLoadingBar, darkTheme, pullToRefresh} = query
    const navigationOptions = {
        navbar: assertBoolean(navbar, {default: false}),
        backSwipeable: assertBoolean(backSwipeable, {default: true}),
    } as const
    const uiOptions = {
        // webview 영역을 전체로 쓸지 정하는 옵션 (view를 삽입해서 header + safeAreaInsets.top 만큼 띄움)
        enableHeader: assertBoolean(enableHeader, {default: true}),
        enableSafeAreaInsets: assertBoolean(enableSafeAreaInsets, {default: true}),
        showLoadingBar: assertBoolean(showLoadingBar, {default: true}),
        darkTheme: assertBoolean(darkTheme, {default: isDarkTheme}),
        pullToRefresh: assertBoolean(pullToRefresh, {default: true}),
    } as const
    return {
        url: uri,
        navigationOptions,
        uiOptions,
    }
}
