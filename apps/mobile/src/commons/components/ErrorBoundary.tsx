import {Component, ErrorInfo, PropsWithChildren} from 'react'
import {NativeExceptionHandler, setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler'
import {isRefreshTokenExpiredError} from '@oneweek/fetch'

import {PopupErrorAlert} from '$commons/components/PopupErrorAlert'
import {isPopupError} from '$commons/errors/popupError'
import {setUnhandledPromiseRejectionTracker} from '$utils/promiseHandler'

type ErrorBoundaryProps = PropsWithChildren<{}>

interface ErrorBoundaryState {
    error: Error | null
    fromComponentError: boolean
    showPopup: boolean
}

const DEFAULT_STATE: ErrorBoundaryState = {
    error: null,
    fromComponentError: false,
    showPopup: false,
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {...DEFAULT_STATE}
    }

    // 컴포넌트 렌더링 과정 중 발생한 에러 캐치
    static getDerivedStateFromError(error: Error) {
        const showPopup = isPopupError(error)
        return {error, fromComponentError: true, showPopup}
    }

    componentDidCatch(error: Error, _: ErrorInfo) {
        const showPopup = isPopupError(error)
        // 처음 발생한 에러 이후에 발생한 에러는 무시
        if (!this.state.error) {
            this.setState({error, fromComponentError: true, showPopup})
        }
    }

    componentDidMount() {
        /**
         * @description promise rejection으로 발생된 에러 캐치
         */
        setUnhandledPromiseRejectionTracker(this.promiseExceptionHandler)
        /**
         * @description 두번째 인자 RN Dev mode > 처리 > devMode여야 popupError를 fatal 처리하지 않음
         * JS error handler
         */
        setJSExceptionHandler(this.jsExceptionHandler, true)
        /**
         * @description 네이티브 에러 발생 핸들러
         * TODO : native 에러 핸들러 처리 (ex. force app quit)
         */
        setNativeExceptionHandler(this.nativeExceptionHandler, true, false)
    }

    private promiseExceptionHandler = (_: number, error: unknown) => {
        const isErrorInstance = error instanceof Error
        if (!isErrorInstance) {
            return
        }
        this.jsExceptionHandler(error)
    }

    private jsExceptionHandler = (error: Error, isFatalException: boolean = true) => {
        const showPopup = isPopupError(error)
        // 처음 발생한 에러 이후에 발생한 에러는 무시
        if (!this.state.error && !isRefreshTokenExpiredError(error)) {
            this.setState({error, fromComponentError: false, showPopup})
        }
        console.log('error', error, 'isFatalException', isFatalException) // eslint-disable-line no-console
        // 이 에러라면 알럿 이수, 앱을 재시작합니다 > popupError도 fatal error 처리됨. native 단 처리가 필요.
        // isFatal이 false인 경우는 console.error인 경우나, webview 같은데서 나온 에러
    }

    // TODO: https://github.com/a7ul/react-native-exception-handler#customizing-setnativeexceptionhandler
    private nativeExceptionHandler: NativeExceptionHandler = (exceptionMessage: string) => {
        // eslint-disable-next-line no-console
        console.log('exceptionMessage', exceptionMessage)
    }

    private reset = () => {
        if (this.state.error) {
            this.setState({...DEFAULT_STATE})
        }
    }

    private handlePopupClick = async () => {
        const {error} = this.state
        if (!isPopupError(error)) {
            return
        }
        await error.onPress?.()
        this.reset()
    }

    render() {
        const {error, fromComponentError, showPopup} = this.state

        // TODO : isRefreshTokenExpiredError(error) 가 true라면 로그인 페이지 띄우기

        return (
            <>
                {!fromComponentError && this.props.children}
                <PopupErrorAlert error={error} isShow={showPopup} onClose={this.handlePopupClick} />
            </>
        )
    }
}
