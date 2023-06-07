import {PropsWithChildren, useMemo} from 'react'
import {GestureResponderEvent} from 'react-native'
import {Portal} from '@gorhom/portal'
import Animated, {FadeInDown} from 'react-native-reanimated'
import {styled} from 'styled-components/native'
import {useEvent} from '@oneweek-react/hook'
import {noop} from '@oneweek/util'
import {Color} from '@oneweek-react/theme'

import {Overlay} from './Overlay'

import {Button} from '$commons/components/Button'
import {Text} from '$commons/components/Text'

type AlertTypes = 'confirm' | 'popup'
type ButtonDirections = 'vertical' | 'horizontal'
type AlertCallback = {
    callback?: (e: GestureResponderEvent) => void | Promise<void>
    label?: string
    color?: Color
}

export type AlertProps = {
    isShow: boolean
    type?: AlertTypes
    title?: string
    message?: string
    onClose?: (e: GestureResponderEvent) => void
    success?: AlertCallback
    cancel?: AlertCallback
    direction?: ButtonDirections
    preventOutsideClick?: boolean
}

const Content = styled(Animated.View)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 85%;
    max-height: 100%;
    border-radius: 16px;
    background-color: ${({theme: {colors}}) => colors.whiteGray};
    overflow: hidden;
    letter-spacing: -0.5px;
    text-align: center;
`

const TextWrapper = styled.View`
    width: 90%;
    padding: 23px 0;
    word-break: keep-all;
    overflow-wrap: break-word;
`

const ButtonWrapper = styled.View<{buttonDirection: ButtonDirections}>`
    margin-bottom: 15px;
    flex-direction: ${({buttonDirection}) => (buttonDirection === 'vertical' ? 'column' : 'row-reverse')};
`

const AlertStyle = {
    title: {
        color: 'primary',
        size: 'extraLarge',
        bold: 'ultraBold',
        textAlign: 'left',
        margin: '0px 20px',
        lineHeight: 25,
    },
    message: {
        color: 'secondary',
        size: 'medium',
        lineHeight: 21,
        textAlign: 'left',
        margin: '21px 0 0 0',
        padding: '0px 23px',
    },
    successText: {size: 'semiLarge', lineHeight: 20, color: 'forceWhite', bold: 'extraBold'},
    cancelText: {size: 'medium', color: 'primarySub', bold: 'extraBold'},
} as const

export function Alert(props: PropsWithChildren<AlertProps>) {
    const {
        isShow,
        type = 'confirm',
        title,
        message,
        onClose = noop,
        success = {callback: noop, label: '확인', color: 'main'},
        cancel = {callback: noop, label: '취소', color: 'button'},
        direction = 'horizontal',
        preventOutsideClick = false,
        children,
    } = props
    const handleOutsidePress = useEvent((e: GestureResponderEvent) => {
        e.preventDefault()
        if (preventOutsideClick) {
            return
        }
        onClose(e)
    })

    const handleSuccessPress = useEvent(async (e: GestureResponderEvent) => {
        await success?.callback?.(e)
        onClose(e)
    })

    const handleCandlePress = useEvent(async (e: GestureResponderEvent) => {
        await cancel?.callback?.(e)
        onClose(e)
    })

    const handleStopPropagationPress = useEvent((e: GestureResponderEvent) => {
        e.stopPropagation()
    })

    const isVerticalDirection = useMemo(() => {
        if (type === 'popup') {
            return true
        }
        return direction === 'vertical'
    }, [type, direction])

    if (!isShow) {
        return null
    }

    return (
        // portal을 사용해서, exiting animation을 사용하면 이상함
        <Portal>
            <Overlay isShow onClose={handleOutsidePress}>
                <Content entering={FadeInDown.mass(0.4).delay(70).springify()} onTouchEnd={handleStopPropagationPress}>
                    <TextWrapper>
                        {title && <Text css={AlertStyle.title}>{title}</Text>}
                        {message && <Text css={AlertStyle.message}>{message}</Text>}
                        {children}
                    </TextWrapper>
                    <ButtonWrapper buttonDirection={direction}>
                        <Button
                            css={{
                                width: isVerticalDirection ? '85%' : '40%',
                                height: '45px',
                                backgroundColor: success.color || 'main',
                                border: {radius: 10, color: success.color || 'main'},
                            }}
                            onPress={handleSuccessPress}>
                            <Text css={AlertStyle.successText}>{success.label || '확인'}</Text>
                        </Button>
                        {type === 'confirm' && (
                            <Button
                                css={{
                                    width: isVerticalDirection ? '85%' : '40%',
                                    margin: isVerticalDirection ? '8px 0 0 0' : '0 10px 0 0',
                                    height: '45px',
                                    backgroundColor: cancel.color || 'button',
                                    border: {radius: 10, color: cancel.color || 'button'},
                                }}
                                onPress={handleCandlePress}>
                                <Text css={AlertStyle.cancelText}>{cancel.label || '닫기'}</Text>
                            </Button>
                        )}
                    </ButtonWrapper>
                </Content>
            </Overlay>
        </Portal>
    )
}
