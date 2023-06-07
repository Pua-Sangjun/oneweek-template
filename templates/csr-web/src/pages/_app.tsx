import {GlobalPortal} from '@oneweek-react/component'
import {EmotionThemeProvider} from '@oneweek-react/theme'

import type {ChildrenProps} from '$types/react'

function Provider({children}: ChildrenProps) {
    return (
        <GlobalPortal.Provider>
            <EmotionThemeProvider>{children}</EmotionThemeProvider>
        </GlobalPortal.Provider>
    )
}

export default Provider
