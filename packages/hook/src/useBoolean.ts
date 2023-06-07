import {useCallback, useMemo, useState} from 'react'

export const useBoolean = (
    initialState = false,
): [
    boolean,
    () => void, // open
    () => void, // close
] => {
    const [state, setState] = useState(initialState)

    const handleStateToTrue = useCallback(() => setState(true), [])
    const handleStateToFalse = useCallback(() => setState(false), [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => [state, handleStateToTrue, handleStateToFalse], [state])
}
