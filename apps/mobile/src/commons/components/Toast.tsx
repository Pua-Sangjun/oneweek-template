import {Portal} from '@gorhom/portal'
import {useNavigationState} from '@react-navigation/native'
import {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {styled} from 'styled-components/native'

import {Text} from './Text'

import {STACK_SCREENS} from '$constants/routes'
import {bottomTabPersistent} from '$storages/bottomTab'

export interface ToastProps {
    message: string | null
    duration: number
    onDestroy: () => void
}

const ToastContainer = styled(Animated.View)<{paddingBottomOffset?: number}>`
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: ${({paddingBottomOffset = 0}) => `0px 20px ${paddingBottomOffset}px`};
    z-index: 1000;
`

const ToastMessageWrapper = styled.View`
    padding: 13px 18px 14px;
    border-radius: 5px;
`

const ToastMessage = styled(Text)`
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
`

const DEFAULT_HEIGHT = {
    // tab 위로 띄울 값
    COMMON: 10,
    BOTTOM_TAB: 45,
} as const

function ToastWrapper({message, duration, onDestroy}: PropsWithChildren<ToastProps>) {
    const timeoutID = useRef<ReturnType<typeof setTimeout> | null>(null)
    const safeAreaInset = useSafeAreaInsets()
    const isTabBarNavigation = useNavigationState((state) => state?.routes?.slice(-1)?.[0]?.name === STACK_SCREENS.TAB)
    const [bottomOffset, setBottomOffset] = useState<number>(DEFAULT_HEIGHT.BOTTOM_TAB)

    const handleDestroy = useCallback(() => {
        if (timeoutID.current) {
            clearTimeout(timeoutID.current)
            timeoutID.current = null
        }

        onDestroy()
    }, [onDestroy])

    useEffect(() => {
        timeoutID.current = setTimeout(handleDestroy, duration)

        return () => {
            if (timeoutID.current) {
                clearTimeout(timeoutID.current)
                timeoutID.current = null
            }
        }
    }, [handleDestroy, duration])

    useLayoutEffect(() => {
        // tabBar로드 시 저장된 값을 가지고 와서, 초기화 (tabBar에는 safeAreaInset.bottom이 반영되어있음)
        async function setInitialHeight() {
            const bottomTabInfo = await bottomTabPersistent.load()
            const bottomTabHeight = bottomTabInfo?.height || DEFAULT_HEIGHT.BOTTOM_TAB
            const tabBarHeight = isTabBarNavigation ? bottomTabHeight : safeAreaInset.bottom
            setBottomOffset(tabBarHeight + DEFAULT_HEIGHT.COMMON)
        }
        setInitialHeight()
    }, [isTabBarNavigation, safeAreaInset.bottom])

    return (
        <ToastContainer
            paddingBottomOffset={bottomOffset}
            entering={FadeInDown.mass(0.5).delay(100).springify()}
            exiting={FadeOutDown.mass(0.5).delay(100).springify()}>
            <ToastMessageWrapper style={{backgroundColor: 'rgba(33, 150, 243, 0.94)'}}>
                <ToastMessage css={{color: 'forceWhite', size: 'semiMedium', lineHeight: 21}}>{message}</ToastMessage>
            </ToastMessageWrapper>
        </ToastContainer>
    )
}

export default function Toast(props: ToastProps) {
    if (!props.message) {
        return null
    }

    return (
        <Portal>
            <ToastWrapper {...props} />
        </Portal>
    )
}
