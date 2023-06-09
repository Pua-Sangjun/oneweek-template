import {ReactNode, useEffect, useRef, useState} from 'react'
import normalize from 'emotion-normalize'
import {css, Global, useTheme} from '@emotion/react'
import {GlobalPortal, Sample} from '@oneweek-react/component'
import {useBoolean} from '@oneweek-react/hook'
import {EmotionThemeProvider, ChangeThemeRef} from '@oneweek-react/theme'

function Layout({children}: {children: ReactNode}) {
    const {colors} = useTheme()

    useEffect(() => {}, [colors])

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

export function App() {
    const [a, b, c] = useBoolean(false)
    const [res, setRes] = useState<any>()
    const ref = useRef<ChangeThemeRef | null>(null)

    useEffect(() => {
        async function test() {
            setRes('')
        }
        test()
    }, [a])

    useEffect(() => {
        setTimeout(() => {
            ref.current?.changeMode('light')
        }, 1000)
    }, [])

    return (
        <EmotionThemeProvider isDarkMode ref={ref}>
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
                    <p>{JSON.stringify(res)}</p>
                    <Sample />
                </Layout>
            </GlobalPortal.Provider>
        </EmotionThemeProvider>
    )
}
