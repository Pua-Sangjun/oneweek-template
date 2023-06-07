import {useEffect, useState} from 'react'
import {
    Bridge,
    PluginAlert,
    PluginAnalytics,
    PluginInfo,
    PluginRequest,
    PluginRouter,
    PluginStorage,
    PluginToast,
} from '@oneweek-react/bridge'
import {css} from '@emotion/react'
import {useNavigate} from 'react-router-dom'

import {Sample} from '../sample/components/sample'

import type {GetInitialProps} from '$types/getInitialProps'

type InitialProps = {
    text: number
}

export const bridge = new Bridge()
    .addPlugin(PluginAnalytics)
    .addPlugin(PluginStorage)
    .addPlugin(PluginToast)
    .addPlugin(PluginAlert)
    .addPlugin(PluginInfo)
    .addPlugin(PluginRequest)
    .addPlugin(PluginRouter)

function RootPage({text}: InitialProps) {
    const navigate = useNavigate()
    const [uiStyle, setUiStyle] = useState<any>()
    useEffect(() => {
        async function load() {
            try {
                // await bridge.info.setToken({accessToken: 'test', refreshToken: 'test'})
                const userInfo = await bridge.info.device()
                bridge.console.log(userInfo)
                const result = await bridge.info.token()
                bridge.console.log(JSON.stringify(result))

                bridge.info.style().then((value) => {
                    bridge.console.log(value)
                    setUiStyle(value)
                })

                bridge.option.navigation({
                    headerRight: [
                        {
                            key: 'string',
                            title: 'string',
                            callback: () => {
                                navigate('/test')
                            },
                        },
                    ],
                })

                setTimeout(() => {
                    bridge.option.navigation({
                        headerTitle: '이게되니?',
                    })
                }, 1000)
            } catch (error) {
                alert(error)
                bridge.console.log(JSON.stringify(error))
            }
        }
        load()
    }, [navigate])

    if (!uiStyle) {
        return null
    }

    return (
        <div
            css={css`
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
            `}>
            <div
                css={css`
                    height: 100px;
                    width: 100%;
                    border: 1px solid black;

                    position: absolute;
                `}>
                margin
            </div>
            <div
                css={css`
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    width: 100%;
                    padding: 0;
                    // 페이지 접근 쿼리로 query enableSafeAreaInsets false일 때, 두 값을 더해줘야되고 true 라면 headerHeight만 사용
                    height: 1000px;
                    align-items: center;
                    margin-top: 100px;
                    background-color: #f8f9fb;
                `}>
                root index page text {text} {window.location.href}
                <input type="text" />
                <button
                    onClick={() => {
                        bridge.toast.show({
                            message: 'dfsdfds',
                            duration: 1000,
                        })
                        bridge.console.log('토스트~')
                    }}>
                    토스트
                </button>
                <p>{JSON.stringify(uiStyle)}</p>
                <button
                    onClick={async () => {
                        try {
                            const response = await bridge.request.get<Array<{_id: string}>>('/users')
                            bridge.console.log(response?.[0]?._id)
                        } catch (error) {
                            bridge.console.log(JSON.stringify(error))
                        }
                    }}>
                    request
                </button>
                <button
                    onClick={async () => {
                        try {
                            const result = await bridge.alert.show({title: 'gd'})
                            alert(result)
                        } catch (error) {
                            alert(error)
                        }
                    }}>
                    알럿
                </button>
                <button
                    onClick={async () => {
                        try {
                            navigate('/test')
                            // bridge.router.push('/test')
                        } catch (error) {
                            alert(error)
                        }
                    }}>
                    test push
                </button>
                <button
                    onClick={async () => {
                        try {
                            bridge.toast.show({
                                message: 'toast 후 close',
                                duration: 1000,
                            })
                            bridge.router.close()
                        } catch (error) {
                            alert(error)
                        }
                    }}>
                    close
                </button>
                <Sample />
            </div>
        </div>
    )
}

export function loading() {
    return <div>Root 로로로오오오오오오ㅗ오옹딩중</div>
}

export const getInitialProps: GetInitialProps<InitialProps> = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                props: {text: 1},
            })
        }, 100)
    })
}

export default RootPage
