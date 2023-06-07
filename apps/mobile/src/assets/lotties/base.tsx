import NativeLottie, {AnimatedLottieViewProps} from 'lottie-react-native'
import {styled} from 'styled-components/native'
import {useEffect, useRef, useState} from 'react'
import {AppState, AppStateStatus} from 'react-native'

export type LottieStyleProps = {
    css?: {width?: string | number; height?: string | number}
}

export type LottieProps = AnimatedLottieViewProps & LottieStyleProps

const StyledLottie = styled(NativeLottie)<LottieProps>`
    width: ${({css}) => {
        if (!css?.width) {
            return '50px'
        }
        return typeof css.width === 'string' ? css.width : `${css.width}px`
    }};
    height: ${({css}) => {
        if (!css?.height) {
            return '50px'
        }
        return typeof css.height === 'string' ? css.height : `${css.height}px`
    }};
    margin: 0 auto;
`

export function Lottie(props: LottieProps) {
    const [appState, setAppState] = useState<AppStateStatus>()
    const lottieRef = useRef<NativeLottie>(null)

    useEffect(() => {
        function handleAppStateChange(nextAppState: AppStateStatus) {
            if (appState && appState.match(/inactive|background/) && nextAppState === 'active') {
                lottieRef.current?.play()
            }
            setAppState(nextAppState)
        }

        const subscribe = AppState.addEventListener('change', handleAppStateChange)

        return () => {
            subscribe.remove()
        }
    }, [appState])

    return <StyledLottie ref={lottieRef} {...props} />
}
