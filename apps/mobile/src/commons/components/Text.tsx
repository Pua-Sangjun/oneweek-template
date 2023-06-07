import {Text as NativeText, TextProps as NativeTextProps} from 'react-native'
import styled from '@emotion/native'
import {Color, FontSize, FontWeight} from '@oneweek-react/theme'
import {PropsWithChildren} from 'react'

type TextProps = {
    css?: {
        size?: FontSize | number
        color?: Color
        bold?: FontWeight
        opacity?: number
        margin?: string
        padding?: string
        underline?: boolean
        lineHeight?: number
        textAlign?: 'auto' | 'center' | 'justify' | 'left' | 'right'
        ellipsis?: {
            mode: 'head' | 'tail'
            line: number
        }
    }
} & NativeTextProps

const StyledText = styled(NativeText)<TextProps>`
    color: ${({theme: {colors}, css}) => (css?.color ? colors[css.color] : colors.black)};
    font-size: ${({
        theme: {
            font: {size: fontSizes},
        },
        css,
    }) => {
        if (typeof css?.size === 'number') {
            return `${css.size}px`
        }
        return fontSizes[css?.size || 'normal']
    }};
    font-weight: ${({
        theme: {
            font: {weight},
        },
        css,
    }) => weight[css?.bold || 'normal']};
    margin: ${({css}) => css?.margin || '0'};
    padding: ${({css}) => css?.padding || '0'};
    text-decoration-line: ${({css}) => (css?.underline ? 'underline' : 'none')};
    line-height: ${({
        theme: {
            font: {size: fontSizes},
        },
        css,
    }) => {
        if (!css?.lineHeight) {
            if (typeof css?.size === 'number') {
                return `${css?.size + 10}px`
            }
            return `${parseInt(fontSizes[css?.size || 'normal'].replace('px', '')) + 10}px`
        }
        return `${css.lineHeight}px`
    }};
    text-align: ${({css}) => css?.textAlign || 'center'};
    opacity: ${({css}) => css?.opacity || 1};
`

export function Text(props: PropsWithChildren<TextProps>) {
    const {children, css} = props
    return (
        <StyledText {...props} numberOfLines={css?.ellipsis?.line} ellipsizeMode={css?.ellipsis?.mode}>
            {children}
        </StyledText>
    )
}
