import {EffectCallback, useEffect} from 'react'

export function useEffectOnce(effect: EffectCallback) {
    useEffect(effect, []) // eslint-disable-line react-hooks/exhaustive-deps
}
