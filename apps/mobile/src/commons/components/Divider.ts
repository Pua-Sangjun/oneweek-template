import {View} from 'react-native'
import styled from '@emotion/native'
import {Color} from '@oneweek-react/theme'

type DividerProps = {
    css?: {
        height?: string
        backgroundColor?: Color
    }
}

export const Divider = styled(View)<DividerProps>`
    width: 100%;
    height: ${({css}) => css?.height || '9px'};
    background-color: ${({theme: {colors}, css}) => colors[css?.backgroundColor || 'line']};
`
