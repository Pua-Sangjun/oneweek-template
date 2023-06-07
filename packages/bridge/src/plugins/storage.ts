import {UnSupportedInterfaceError} from '../errors'
import {PluginBase} from './base'

type GetItem = {result: 'fail'; data: null} | {result: 'success'; data: string}
type SetOrRemoveItem = Omit<GetItem, 'data'>

export type StorageInterface = {
    storage: (actionType: 'get' | 'remove' | 'set', key: string, value?: string) => void
    onStorage: (params: GetItem | SetOrRemoveItem) => void
}

type DeviceStorage = {type: 'get' | 'remove'; key: string} | {type: 'set'; key: string; value: string}

export class PluginStorage extends PluginBase {
    private name = 'PluginStorage'

    private async deviceStorage(params: DeviceStorage): Promise<GetItem | SetOrRemoveItem> {
        return new Promise((resolve, reject) => {
            if (typeof this.bridge?.storage !== 'function') {
                reject(new UnSupportedInterfaceError(`${this.name} deviceStorage`))
            }

            const {type, key} = params

            this.bridge.onStorage = function (payload) {
                resolve(payload)
            }

            if (params.type === 'set') {
                this.bridge.storage(type, key, params.value)
            } else {
                this.bridge.storage(type, key)
            }
        })
    }

    async get(
        key: string,
        options?: {
            defaultValue?: any
            json?: boolean
        },
    ): Promise<GetItem> {
        const {defaultValue = null, json = true} = options || {}
        try {
            const response = (await this.deviceStorage({type: 'get', key})) as GetItem
            if (response?.result === 'success') {
                return {
                    result: 'success',
                    data: json ? JSON.parse(response?.data) : response?.data,
                }
            }
            return {result: 'fail', data: defaultValue}
        } catch {
            return {result: 'fail', data: defaultValue}
        }
    }

    async set(key: string, value: string): Promise<SetOrRemoveItem> {
        const result = (await this.deviceStorage({type: 'set', key, value})) as SetOrRemoveItem
        return result
    }

    async remove(key: string): Promise<SetOrRemoveItem> {
        const result = (await this.deviceStorage({type: 'remove', key})) as SetOrRemoveItem
        return result
    }
}
