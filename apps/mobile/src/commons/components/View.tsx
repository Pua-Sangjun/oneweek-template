import {SafeAreaView as NativeSafeAreaView} from 'react-native-safe-area-context'
import {View as NativeView, ViewProps as NativeViewProps} from 'react-native'
import styled from '@emotion/native'
import {Color} from '@oneweek-react/theme'
import {memo} from 'react'

const SafeAreaContainerView = styled(NativeSafeAreaView)`
    flex: 1;
    background-color: ${({theme: {colors}}) => colors.white};
`

export type ViewProps = NativeViewProps & {
    css?: {
        width?: string | number
        height?: string | number
        backgroundColor?: Color
        margin?: string
        padding?: string
        border?: string
    }
}

export const View = styled(NativeView)<ViewProps>`
    width: ${({css}) => css?.width || '100%'};
    height: ${({css}) => css?.height || '100%'};
    background-color: ${({theme: {colors}, css}) => colors[css?.backgroundColor || 'white']};
    margin: ${({css}) => css?.margin || '0'};
    padding: ${({css}) => css?.padding || '0'};
    border: ${({css}) => css?.border || 'none'};
`

export function SafeAreaView({children, ...props}: ViewProps) {
    return (
        <SafeAreaContainerView>
            <View {...props}>{children}</View>
        </SafeAreaContainerView>
    )
}

export const EmptyView = memo(function EmptyView(props?: ViewProps) {
    return <View {...props} />
})
