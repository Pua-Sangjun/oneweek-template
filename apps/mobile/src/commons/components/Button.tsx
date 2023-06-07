import {
    TouchableOpacity as NativeTouchableOpacity,
    TouchableOpacityProps as NativeTouchableOpacityProps,
    GestureResponderEvent,
} from 'react-native'
import styled from '@emotion/native'
import type {Color} from '@oneweek-react/theme'
import {PropsWithChildren} from 'react'

export type ButtonProps = {
    css: {
        width?: string | number
        height?: string | number
        margin?: string
        backgroundColor?: Color
        minWidth?: string
        minHeight?: string
        border?: {
            color?: Color
            radius?: number
        }
        disabled?: boolean
    }
    onPress?: (e: GestureResponderEvent) => void
    native?: {
        activeOpacity?: number
    }
} & NativeTouchableOpacityProps

const TouchableButton = styled(NativeTouchableOpacity)<ButtonProps>`
    width: ${({css: {width}}) => {
        if (!width) {
            return 'auto'
        }
        return typeof width === 'number' ? `${width}px` : width
    }};
    height: ${({css: {height}}) => {
        if (!height) {
            return 'auto'
        }
        return typeof height === 'number' ? `${height}px` : height
    }};
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({theme: {colors}, css: {backgroundColor}, disabled}) => {
        if (disabled) {
            return colors.quaternary
        }
        return backgroundColor ? colors[backgroundColor] : colors.main
    }};
    border: ${({theme: {colors}, css: {border}}) => {
        if (!border || !border?.color) {
            return 'none'
        }
        return `1px solid ${colors[border?.color || 'main']};`
    }};
    border-radius: ${({css: {border}}) => `${border?.radius ?? 8}px`};
    margin: ${({css: {margin}}) => margin || '0'};
    min-width: ${({css: {width, minWidth}}) => minWidth || width};
    min-height: ${({css: {height, minHeight}}) => minHeight || height};
`

export function Button(props: PropsWithChildren<ButtonProps>) {
    const {disabled, native, children} = props
    return (
        <TouchableButton activeOpacity={native?.activeOpacity || 0.8} {...props} disabled={disabled}>
            {children}
        </TouchableButton>
    )
}
