import {createNativeStackNavigator, NativeStackNavigationOptions} from '@react-navigation/native-stack'
import {memo, useCallback, useMemo} from 'react'
import {RouteProp} from '@react-navigation/native'
import {useTheme} from '@emotion/react'

import {Tab} from '$screens/tabs'
import {WebViewScreen} from '$screens/webview'
import {isIOS} from '$constants/platform'
import {StackScreenParams, STACK_SCREENS} from '$constants/routes'

const {Navigator: StackNavigator, Screen: StackScreen} = createNativeStackNavigator<StackScreenParams>()

const NAVIGATION_ANIMATION = isIOS ? 'default' : 'fade_from_bottom'
const TAB_BAR_HEADER_OPTIONS = {headerShown: false} as const

export const StackRouter = memo(function StackRouter() {
    const {colors} = useTheme()

    const commonStackScreenOptions: NativeStackNavigationOptions = useMemo(
        () => ({
            headerTitle: '',
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            animation: NAVIGATION_ANIMATION,
            headerTintColor: colors.black,
            headerStyle: {
                backgroundColor: colors.white,
            },
        }),
        [colors],
    )

    const getScreenOptions = useCallback(
        (params: {route: RouteProp<StackScreenParams, keyof StackScreenParams>}): NativeStackNavigationOptions => {
            if (params.route.name === STACK_SCREENS.TAB) {
                return commonStackScreenOptions
            }
            // TODO : Header Back button 처리 (header를 아예 안보이게 하려면,, EmptyView 처리가 없어야함)
            return commonStackScreenOptions
        },
        [commonStackScreenOptions],
    )

    return (
        <StackNavigator screenOptions={getScreenOptions}>
            <StackScreen name={STACK_SCREENS.TAB} component={Tab} options={TAB_BAR_HEADER_OPTIONS} />
            <StackScreen name={STACK_SCREENS.WEBVIEW} component={WebViewScreen} />
        </StackNavigator>
    )
})
