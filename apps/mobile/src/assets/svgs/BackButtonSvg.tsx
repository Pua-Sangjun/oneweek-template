import {memo} from 'react'

import {Svg, Path, SvgProps} from '$assets/svgs/base'

export const BackButtonSvg = memo(function BackButtonSvg({css, onPress}: SvgProps) {
    return (
        <Svg css={css} viewBox="0 0 24 24" onPress={onPress}>
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.6875 3.27994C17.0575 3.64994 17.0575 4.24994 16.6875 4.61994L9.30752 11.9999L16.6875 19.3799C17.0575 19.7499 17.0575 20.3499 16.6875 20.7199C16.3175 21.0899 15.7175 21.0899 15.3475 20.7199L7.29752 12.6699C6.92752 12.2999 6.92752 11.6999 7.29752 11.3299L15.3475 3.27994C15.7175 2.90994 16.3175 2.90994 16.6875 3.27994Z"
                fillColor={css?.fillColor}
            />
        </Svg>
    )
})
