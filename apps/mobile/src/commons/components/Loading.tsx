import {CircleSnail} from 'react-native-progress'
import styled from '@emotion/native'

import {View} from '$commons/components/View'
import {useDarkTheme} from '$hooks/useDarkTheme'
import {useDeviceStyle} from '$webview/interface/info'

const CenterView = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0;
    left: 0;
`

export function FullSizeLoading({isShow = true, enableHeader = false}: {isShow?: boolean; enableHeader?: boolean}) {
    const {
        colors: {primary, quaternary},
        isDarkTheme,
    } = useDarkTheme()
    const {headerHeight} = useDeviceStyle()

    if (!isShow) {
        return null
    }

    return (
        <CenterView>
            <CircleSnail
                style={{top: enableHeader ? -Math.floor(headerHeight / 2) : 0}}
                color={isDarkTheme ? primary : quaternary}
                size={30}
                indeterminate
            />
        </CenterView>
    )
}
