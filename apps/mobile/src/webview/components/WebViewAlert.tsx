import {RefObject, useMemo} from 'react'
import ReactNativeWebView from 'react-native-webview'
import {useEvent} from '@oneweek-react/hook'

import {Alert} from '$commons/components/Alert'
import {useAlert} from '$contexts/alert'

type WebViewAlertProps = {
    webviewRef: RefObject<ReactNativeWebView>
}

export function WebViewAlert({webviewRef}: WebViewAlertProps) {
    const {alertInfo, handleClose} = useAlert()
    const isFromWebview = useMemo(() => alertInfo?.from === 'web', [alertInfo?.from])

    const handleSuccess = useEvent(() => {
        if (!webviewRef.current) {
            return
        }
        webviewRef.current.postMessage(JSON.stringify({type: 'onShowAlert', payload: 'success'}))
    })

    const handleCancel = useEvent(() => {
        if (!webviewRef.current) {
            return
        }
        webviewRef.current.postMessage(JSON.stringify({type: 'onShowAlert', payload: 'cancel'}))
    })

    if (!isFromWebview || !alertInfo) {
        return null
    }

    return (
        <Alert
            isShow={Boolean(alertInfo)}
            onClose={handleClose}
            {...alertInfo}
            success={{label: alertInfo.success?.label || '확인', callback: handleSuccess}}
            cancel={{label: alertInfo.cancel?.label || '취소', callback: handleCancel}}
        />
    )
}
