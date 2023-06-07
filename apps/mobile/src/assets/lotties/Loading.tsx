import {memo} from 'react'

import {Lottie, LottieStyleProps} from '$assets/lotties/base'

export const LoadingLottie = memo(function LoadingLottie(props: LottieStyleProps) {
    return <Lottie {...props} source={require('$assets/lotties/json/loading.json')} autoPlay loop speed={1.2} />
})
