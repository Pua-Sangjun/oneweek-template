import {useMemo, useRef} from 'react'

import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect'

type Function<ARGS extends unknown[], R> = (...args: ARGS) => R

/**
 * @description await 한 시점에서 최신 props나 state를 읽어오지 못함 / async는 외부에서 사용 / 참조값을 계속 유지하는 친구
 * 의존성이 없는 memo가 ref를 계속해서 참조하고 있기 때문에, 항상 같은 메모리 값을 리턴한다.
 */
export const useEvent = <Arg extends unknown[], Return>(fn: Function<Arg, Return>): Function<Arg, Return> => {
    const ref = useRef<Function<Arg, Return>>(fn)
    useIsomorphicLayoutEffect(() => {
        ref.current = fn
    })

    return useMemo(
        () =>
            (...args: Arg): Return => {
                const {current} = ref
                return current(...args)
            },
        [], // eslint-disable-line react-hooks/exhaustive-deps
    )
}
