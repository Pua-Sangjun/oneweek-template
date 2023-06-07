import {useEvent} from '@oneweek-react/hook'
import {useNavigation} from '@react-navigation/native'
import {useEffect, useRef} from 'react'
import {BackHandler, ToastAndroid} from 'react-native'

import {STACK_SCREENS} from '$constants/routes'
import {isIOS} from '$constants/platform'

export function useHardwareBackPress() {
    const navigation = useNavigation()
    const forceCloseBackButton = useRef<boolean>(true)
    const backButtonPressActionHandler = useEvent(() => {
        const {routes: currentRoutesState} = navigation.getState()
        const isTopTabScreen = currentRoutesState.length === 1 && currentRoutesState[0].name === STACK_SCREENS.TAB
        if (!isTopTabScreen) {
            return false
        }
        if (forceCloseBackButton.current) {
            ToastAndroid.show(`'뒤로' 버튼을 한번 더 누르시면 종료됩니다.`, 100)
            forceCloseBackButton.current = false
            return true
        }
        forceCloseBackButton.current = true
        return false
    })

    useEffect(() => {
        if (isIOS) {
            return
        }
        const listener = BackHandler.addEventListener('hardwareBackPress', backButtonPressActionHandler)
        return () => {
            listener.remove()
        }
    }, [backButtonPressActionHandler])
}
