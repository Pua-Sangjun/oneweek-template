/* eslint-disable no-case-declarations */
import {WebViewMessageEvent} from 'react-native-webview'
import {useEvent} from '@oneweek-react/hook'
import {useMemo} from 'react'
import {StackActions, useNavigation} from '@react-navigation/native'

import {WebviewReceivedEvent, WebviewSendEvent} from '$webview/interface/type'
import {WebViewCustomEventError} from '$webview/interface/error'
import {logCustomEventToFirebase} from '$commons/utils/firebase'
import {getDeviceInfo, useDeviceStyle} from '$webview/interface/info'
import {bridgeStorage} from '$webview/interface/storage'
import {webviewRequest} from '$webview/interface/request'
import {useToast} from '$contexts/toast'
import {useAlert} from '$contexts/alert'
import {getTokens, setToken} from '$storages/auth'
import {STACK_SCREENS} from '$constants/routes'
import {initialNavigationOptions, initialUIOptions, useWebViewOptions} from '$webview/contexts/options'

export function useWebviewEventHandler() {
    const {showToast} = useToast()
    const {showAlert} = useAlert()
    const navigation = useNavigation()
    const deviceStyle = useDeviceStyle()
    const {setUIOptions, setNavigationOptions} = useWebViewOptions()

    const getResponseFromWebViewEvent = useEvent(
        async (event: WebViewMessageEvent): Promise<WebviewSendEvent | undefined> => {
            try {
                const parsedEvent = JSON.parse(event.nativeEvent.data)
                const {type, payload} = (parsedEvent || {}) as WebviewReceivedEvent
                switch (type) {
                    /**
                     * log
                     */
                    case 'log.console':
                        console[payload.loggingType](`from webview :`, payload.message) // eslint-disable-line no-console
                        return
                    case 'log.firebase':
                        await logCustomEventToFirebase(payload.name, payload.params)
                        return
                    /**
                     * info
                     */
                    case 'info.device':
                        const deviceInfo = await getDeviceInfo()
                        return {type, payload: {deviceInfo}}
                    case 'info.token':
                        if (payload.actionType === 'get') {
                            const tokens = await getTokens()
                            return {type, payload: tokens}
                        }
                        await setToken(payload.tokens)
                        return {type, payload: undefined}
                    case 'info.style':
                        return {type, payload: deviceStyle}
                    case 'info.scrollHeight':
                        return {type, payload}
                    /**
                     * ui
                     */
                    case 'ui.toast':
                        showToast(payload)
                        return
                    case 'ui.alert':
                        showAlert({from: 'web', ...payload})
                        return
                    /**
                     * storage
                     */
                    case 'storage':
                        const result = await (payload.actionType === 'set'
                            ? bridgeStorage.set(payload.key, payload.value)
                            : bridgeStorage[payload.actionType](payload.key))
                        return {type, payload: result}
                    /**
                     * request
                     */
                    case 'request':
                        const {base, ...requestParams} = payload
                        const response = await webviewRequest({base, requestParams})
                        return {type: 'request', payload: response}
                    /**
                     * router
                     */
                    case 'router.navigation':
                        if (payload.actionType === 'close') {
                            navigation.goBack()
                            return
                        }
                        const newAction = StackActions[payload.actionType](STACK_SCREENS.WEBVIEW, {uri: payload.url})
                        navigation.dispatch(newAction)
                        return
                    case 'router.clientHistory':
                        return {type, payload}
                    /**
                     * option (ui, navigation)
                     */
                    case 'option.ui':
                        const {force: forceSetUIOptions = false, ...uiOptions} = payload
                        setUIOptions(
                            forceSetUIOptions
                                ? {...initialUIOptions, ...uiOptions}
                                : (prevUIOptions) => ({...prevUIOptions, ...uiOptions}),
                        )
                        return
                    case 'option.navigation':
                        const {force: forceSetNavigationOptions = false, ...navigationOptions} = payload
                        setNavigationOptions(
                            forceSetNavigationOptions
                                ? {...initialNavigationOptions, ...navigationOptions}
                                : (prevNavigationOptions) => ({...prevNavigationOptions, ...payload}),
                        )
                        return
                    default:
                        throw new WebViewCustomEventError('정의되지 않은 event')
                }
            } catch (error) {
                // TODO : error logging
                throw new WebViewCustomEventError('webview event data json parse error')
            }
        },
    )
    return useMemo(() => getResponseFromWebViewEvent, [getResponseFromWebViewEvent])
}
