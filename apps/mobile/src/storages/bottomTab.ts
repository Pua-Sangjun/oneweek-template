import {createPersistent} from '$commons/utils/persistent'

export type BottomTab = {
    height: number
}

// last 방문 tab 저장할 때 사용해도 될듯
const BOTTOM_TAB: Readonly<string> = 'BOTTOM_TAB'

export const bottomTabPersistent = createPersistent<BottomTab>(BOTTOM_TAB)
