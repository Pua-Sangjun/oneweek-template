import {RawAxiosRequestConfig} from 'axios'

import {restAuthApi, restBaseApi} from '$utils/api'

function getRestApi(base: boolean) {
    return base ? restBaseApi : restAuthApi
}

export type WebviewRequestParams =
    | {type: 'get'; url: string; config: RawAxiosRequestConfig}
    | {type: 'post'; url: string; data: unknown; config: RawAxiosRequestConfig}
    | {type: 'patch'; url: string; data: unknown; config: RawAxiosRequestConfig}
    | {type: 'put'; url: string; data: unknown; config: RawAxiosRequestConfig}
    | {type: 'delete'; url: string; config: RawAxiosRequestConfig}

export function webviewRequest({base = false, requestParams}: {base: boolean; requestParams: WebviewRequestParams}) {
    const restApi = getRestApi(base)
    const {type, url, config} = requestParams
    if (type === 'get' || type === 'delete') {
        return restApi[type](url, config)
    }
    return restApi[type](url, requestParams.data, config)
}
