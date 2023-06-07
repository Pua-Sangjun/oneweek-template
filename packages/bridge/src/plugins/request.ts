import {UnSupportedInterfaceError} from '../errors'
import {PluginBase} from './base'

type Requests =
    | {type: 'get'; url: string; config: any}
    | {type: 'post'; url: string; data: unknown; config: any}
    | {type: 'patch'; url: string; data: unknown; config: any}
    | {type: 'put'; url: string; data: unknown; config: any}
    | {type: 'delete'; url: string; config: any}

type RequestParams = {base: boolean} & Requests

export type RequestInterface = {
    request: (requestParams: RequestParams) => void
    onRequest: (data: unknown) => void
}

type CommonOptions = {
    base?: boolean
    config: any
}

export class PluginRequest extends PluginBase {
    private name = 'PluginRequest'

    private async request<ResponseData = unknown>(requestParams: RequestParams): Promise<ResponseData> {
        return new Promise((resolve, reject) => {
            if (typeof this.bridge?.request !== 'function') {
                reject(new UnSupportedInterfaceError(`${this.name} request`))
            }

            this.bridge.onRequest = function (data) {
                resolve(data as ResponseData)
            }

            this.bridge.request(requestParams)
        })
    }

    get<ResponseData = unknown>(url: string, options?: CommonOptions) {
        const {base = false, config = {}} = options || {}
        return this.request<ResponseData>({base, type: 'get', url, config})
    }

    post<ResponseData = unknown>(url: string, data: unknown, options?: CommonOptions) {
        const {base = false, config = {}} = options || {}
        return this.request<ResponseData>({base, type: 'post', url, data, config})
    }

    patch<ResponseData = unknown>(url: string, data: unknown, options?: CommonOptions) {
        const {base = false, config = {}} = options || {}
        return this.request<ResponseData>({base, type: 'patch', url, data, config})
    }

    put<ResponseData = unknown>(url: string, data: unknown, options?: CommonOptions) {
        const {base = false, config = {}} = options || {}
        return this.request<ResponseData>({base, type: 'put', url, data, config})
    }

    delete<ResponseData = unknown>(url: string, options?: CommonOptions) {
        const {base = false, config = {}} = options || {}
        return this.request<ResponseData>({base, type: 'delete', url, config})
    }
}
