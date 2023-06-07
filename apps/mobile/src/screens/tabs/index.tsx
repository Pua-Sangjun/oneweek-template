import {NavigationProp, useNavigation} from '@react-navigation/native'
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
    useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {memo, useLayoutEffect, useMemo} from 'react'
import {CircleSnail} from 'react-native-progress'

import {Test} from './test/test'

import {StackScreenParams} from '$constants/routes'
import {Button} from '$commons/components/Button'
import {Text} from '$commons/components/Text'
import {useToast} from '$contexts/toast'
import {useAlert} from '$contexts/alert'
import {PopupError} from '$commons/errors/popupError'
import {bottomTabPersistent} from '$storages/bottomTab'
import {View} from '$commons/components/View'
import {useHardwareBackPress} from '$hooks/useHardwareBackPress'
import {useDarkTheme} from '$hooks/useDarkTheme'
// import {isIOS} from '$constants/platform'

const tabNavigator = createBottomTabNavigator()
const {Navigator: BottomTabNavigator, Screen: BottomTabScreen} = tabNavigator

type TabProps = NativeStackScreenProps<StackScreenParams, 'tab'>

function Tab1() {
    const navigator = useNavigation<NavigationProp<StackScreenParams>>()

    return (
        <View>
            <Button
                css={{width: 100, height: 100}}
                onPress={() => {
                    navigator.navigate('webview', {
                        uri: 'http://192.168.0.2:5555?navbar=true&scrollable=false&date=123&enableSafeAreaInsets=true&enableHeader=true&darkTheme=false',
                        // uri: isIOS ? 'http://192.168.0.2:5173' : 'http://new-local-m.pay.naver.com:5173',
                        // uri: isIOS
                        //     ? 'http://localhost:5173?navbar=false&scrollable=false&date=123&enableSafeAreaInsets=true'
                        //     : 'http://new-local-m.pay.naver.com:5173',
                    })
                }}>
                <Text>go to webview</Text>
            </Button>
            <Test />
            <SaveBottomTabBarHeight />
        </View>
    )
}

function Tab2() {
    const {showToast} = useToast()
    return (
        <View>
            <Button
                css={{width: 100, height: 100}}
                onPress={() => {
                    showToast({
                        message:
                            '테스트 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
                    })
                }}>
                <Text>toast</Text>
            </Button>
        </View>
    )
}

function Tab3() {
    const {showAlert} = useAlert()
    return (
        <Button
            css={{width: 100, height: 100}}
            onPress={() => {
                showAlert({
                    title: 'test',
                    message:
                        '테스트 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트',
                })
            }}>
            <Text>alert</Text>
        </Button>
    )
}

function Tab4() {
    return (
        <Button
            css={{width: 100, height: 100}}
            onPress={() => {
                throw new PopupError({
                    title: 'test',
                    message: 'error',
                    onPress: () => {},
                })
            }}>
            <Text>popup error</Text>
        </Button>
    )
}

function SaveBottomTabBarHeight() {
    const height = useBottomTabBarHeight()

    useLayoutEffect(() => {
        const roundedHeight = Math.round(height)
        bottomTabPersistent.save({height: roundedHeight})
    }, [height])

    return null
}

export const Tab = memo(function Tab({navigation: _}: TabProps) {
    const {isDarkTheme, colors} = useDarkTheme()

    useHardwareBackPress()

    const tabBarScreenOptions: BottomTabNavigationOptions = useMemo(() => {
        const {white, black, primarySub, quaternary} = colors
        return {
            headerTitleAlign: 'center',
            headerTitleStyle: {
                color: black,
            },
            headerStyle: {
                backgroundColor: white,
            },
            headerShadowVisible: false,
            tabBarActiveTintColor: black,
            tabBarStyle: {
                backgroundColor: white,
                borderTopColor: isDarkTheme ? primarySub : quaternary, // 당근마켓 스타일 tabBarTopColor
            },
            tabBarIcon: () => <CircleSnail borderWidth={0} size={30} indeterminate />,
        }
    }, [isDarkTheme, colors])

    return (
        <BottomTabNavigator screenOptions={tabBarScreenOptions} initialRouteName={'index'}>
            <BottomTabScreen
                name={'index'}
                component={Tab1}
                options={{
                    headerTitle: 'Tab1',
                    // headerTransparent: true,
                }}
            />
            <BottomTabScreen
                name={'index1'}
                component={Tab2}
                options={() => {
                    return {
                        title: 'tab 이름 변경하기~',
                        // TODO : active 일때, click 했을 떄, 처리
                        headerLeft: () => <Text>tet</Text>,
                        headerTitle: () => null,
                        headerRight: () => <Text>tet</Text>,
                    }
                }}
            />
            <BottomTabScreen name={'index2'} component={Tab3} />
            <BottomTabScreen name={'index3'} component={Tab4} />
        </BottomTabNavigator>
    )
})
