import type {WebviewRequestParams} from '$webview/interface/request'
import type {GetDeviceInfo, DeviceStyle} from '$webview/interface/info'
import type {FirebaseCustomEventParams} from '$commons/utils/firebase'
import type {GetItem} from '$commons/utils/localStorage'
import type {ToastInfo} from '$contexts/toast'
import type {UserTokens} from '$storages/auth'
import type {AlertProps} from '$commons/components/Alert'
import {NavigationOptions, UIOptions} from '$webview/contexts/options'

export type WebViewCustomEvent<Type, Payload = undefined> = {type: Type; payload: Payload}

type WebViewLogReceivedEvent =
    | WebViewCustomEvent<'log.firebase', {name: string; params: FirebaseCustomEventParams}>
    | WebViewCustomEvent<'log.console', {loggingType: 'log' | 'error'; message: any}>

type WebViewInfoReceivedEvent =
    | WebViewCustomEvent<'info.style'>
    | WebViewCustomEvent<'info.scrollHeight', {scrollHeight: number}>
    | WebViewCustomEvent<'info.token', {actionType: 'get'} | {actionType: 'set'; tokens: UserTokens}>
    | WebViewCustomEvent<'info.device'>

type WebViewUIReceivedEvent =
    | WebViewCustomEvent<'ui.toast', ToastInfo>
    | WebViewCustomEvent<'ui.alert', Omit<AlertProps, 'isShow' | 'type' | 'onClose'>>

type WebViewRouterReceivedEvent =
    | WebViewCustomEvent<'router.navigation', {actionType: 'push' | 'replace'; url: string} | {actionType: 'close'}>
    | WebViewCustomEvent<'router.clientHistory'>

type WebViewRequestReceivedEvent = WebViewCustomEvent<'request', {base: boolean} & WebviewRequestParams>

type WebViewStorageReceivedEvent = WebViewCustomEvent<
    'storage',
    {actionType: 'get' | 'remove'; key: string} | {actionType: 'set'; key: string; value: string}
>

type WebViewOptionReceivedEvent =
    | WebViewCustomEvent<'option.ui', Partial<UIOptions> & {force: boolean}>
    | WebViewCustomEvent<'option.navigation', Partial<NavigationOptions & {force: boolean}>>

export type WebviewReceivedEvent =
    | WebViewLogReceivedEvent
    | WebViewInfoReceivedEvent
    | WebViewUIReceivedEvent
    | WebViewRouterReceivedEvent
    | WebViewRequestReceivedEvent
    | WebViewStorageReceivedEvent
    | WebViewOptionReceivedEvent

export type WebviewSendEvent =
    | WebViewCustomEvent<'info.style', DeviceStyle>
    | WebViewCustomEvent<'info.scrollHeight', {scrollHeight: number}>
    | WebViewCustomEvent<'info.device', {deviceInfo: GetDeviceInfo}>
    | WebViewCustomEvent<'info.token', UserTokens | undefined>
    | WebViewCustomEvent<'storage', Partial<GetItem>>
    | WebViewCustomEvent<'request', unknown>
    | WebViewCustomEvent<'router.clientHistory'>
