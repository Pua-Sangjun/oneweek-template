import NativeSvg, {Path as NativePath} from 'react-native-svg'
import {styled} from 'styled-components/native'
import {Color} from '@oneweek-react/theme'

export type SvgProps = {
    css?: {
        width?: string | number
        height?: string | number
        margin?: string
        fillColor?: Color
        outline?: Color
    }
    onPress?: () => void
}

export const Svg = styled(NativeSvg)<SvgProps>`
    width: ${({css}) => css?.width || 24};
    height: ${({css}) => css?.height || 24};
    margin: ${({css}) => css?.margin || '0'};
    fill: ${({theme: {colors}, css}) => colors[css?.fillColor || 'black']};
    stroke: ${({theme: {colors}, css}) => (css?.outline ? colors[css.outline] : 'none')};
`

export type PathProps = {
    fillColor?: Color
    outline?: Color
}

export const Path = styled(NativePath)<PathProps>`
    fill: ${({theme: {colors}, fillColor}) => colors[fillColor || 'black']};
    stroke: ${({theme: {colors}, outline}) => (outline ? colors[outline] : 'none')};
`
