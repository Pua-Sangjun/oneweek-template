import {useEffect, useLayoutEffect} from 'react'

/**
 * @description ssr인 경우 useEffect, 아닌 경우 useLayoutEffect 사용
 * React Native에서는 사용 금지
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
