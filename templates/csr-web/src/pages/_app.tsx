import {GlobalPortal} from '@oneweek-react/component'
import {EmotionThemeProvider} from '@oneweek-react/theme'
import {useEffect} from 'react'
import VConsole from 'vconsole'
import {css, Global} from '@emotion/react'
import normalize from 'emotion-normalize'

import type {ChildrenProps} from '$types/react'

function Provider({children}: ChildrenProps) {
    useEffect(() => {
        const vConsole = new VConsole({
            onReady: () => {
                const button = document.querySelector('.vc-switch')
                if (button) {
                    button.innerHTML = 'DevTools'
                }
            },
        })

        return () => {
            vConsole.destroy()
        }
    }, [])

    return (
        <GlobalPortal.Provider>
            <Global
                styles={css`
                    ${normalize}
                    h1, h2, h3, h4, h5, h6 {
                        font-size: 1em;
                        font-weight: normal;
                        margin: 0; /* or ‘0 0 1em’ if you’re so inclined */
                    }
                `}
            />
            <EmotionThemeProvider>{children}</EmotionThemeProvider>
        </GlobalPortal.Provider>
    )
}

export default Provider
