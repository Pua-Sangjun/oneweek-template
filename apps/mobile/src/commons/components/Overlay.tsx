import React, {PropsWithChildren} from 'react'
import Animated, {FadeIn} from 'react-native-reanimated'
import {GestureResponderEvent} from 'react-native'
import {styled} from 'styled-components/native'

type OverlayProps = {
    isShow: boolean
    onClose?: (e: GestureResponderEvent) => void
}

const Container = styled(Animated.View)`
    position: absolute;

    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.5);
`

export const Overlay = ({isShow, onClose, children}: PropsWithChildren<OverlayProps>) => {
    if (!isShow) {
        return null
    }

    return (
        <Container onTouchEnd={onClose} entering={FadeIn.duration(200)}>
            {children}
        </Container>
    )
}
