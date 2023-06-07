import './sass/app.scss'

import {ReactNode} from 'react'
import normalize from 'emotion-normalize'
import {css, Global} from '@emotion/react'
import {GlobalPortal, Sample} from '@geo-chat/component-web'
import {useBoolean} from '@geo-chat/hook'

function Layout({children}: {children: ReactNode}) {
    return (
        <div
            css={css`
                max-width: 100%;
                width: 100%;
                padding: 0;
                margin: 0;
                height: auto;
            `}>
            <div css={css``}>{children}</div>
        </div>
    )
}

function App() {
    const [a, b, c] = useBoolean(false)

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
            <Layout>
                <button onClick={a ? c : b}>{`${a}`} 버튼</button>
                <Sample />
            </Layout>
        </GlobalPortal.Provider>
    )
}

export default App
