import {memo} from 'react'

import {Button} from '$commons/components/Button'
import {BackButtonSvg} from '$assets/svgs/BackButtonSvg'
import {SvgProps} from '$assets/svgs/base'
import {useDeviceStyle} from '$webview/interface/info'

const svgStyle: Pick<SvgProps, 'css'> = {css: {width: '26px', height: '26px', fillColor: 'primarySub'}} as const

export const HeaderBackButton = memo(function HeaderBackButton({onPress}: {onPress: () => void}) {
    const {headerHeight} = useDeviceStyle()

    return (
        <Button
            style={{
                backgroundColor: 'transparent',
                // 버튼 중앙 정렬 및 위치 수정 >> ios는 safeAreaInsets가 있으면 5를 밑으로 내려야댐
                marginLeft: -20,
                // marginTop: buttonMarginTop,
            }}
            css={{width: '50px', height: headerHeight}}
            onPress={onPress}>
            <BackButtonSvg css={svgStyle.css} />
        </Button>
    )
})
