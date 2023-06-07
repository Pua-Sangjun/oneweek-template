import {UnSupportedInterfaceError} from '../errors'
import {PluginBase} from './base'

type DeviceInfo = {
    id: string
    appVersion: string
    platform: 'ios' | 'aos'
}

type UserTokens = {
    accessToken: string
    refreshToken: string
}

type TokenBridgeParams =
    | {actionType: 'get'}
    | {
          actionType: 'set'
          tokens: UserTokens
      }

type DeviceStyle = {
    device: {width: number; height: number}
    safeAreaInsets: {
        top: number
        right: number
        bottom: number
        left: number
    }
    headerHeight: number
}

export type InfoInterface = {
    info: {
        /**
         * device 정보
         */
        device: () => void
        onDevice: (payload: {deviceInfo: DeviceInfo}) => void

        /**
         * user token get set
         */
        token: (params: TokenBridgeParams) => void
        onToken: (payload: UserTokens | undefined) => void
        /**
         * device에 따른 ui style
         */
        style: () => void
        onStyle: (payload: DeviceStyle) => void
    }
}

export class PluginInfo extends PluginBase {
    private name = 'PluginInfo'

    async device(): Promise<DeviceInfo> {
        return new Promise((resolve, reject) => {
            if (typeof this.bridge?.info?.device !== 'function') {
                reject(new UnSupportedInterfaceError(`${this.name} device`))
            }

            this.bridge.info.onDevice = function (payload) {
                resolve(payload.deviceInfo)
            }

            this.bridge.info.device()
        })
    }

    private async tokenBridge(params: TokenBridgeParams): Promise<UserTokens | string | undefined> {
        return new Promise((resolve, reject) => {
            if (typeof this.bridge?.info?.token !== 'function') {
                reject(new UnSupportedInterfaceError(`${this.name} token`))
            }

            const isGetAction = params.actionType === 'get'

            this.bridge.info.onToken = function (payload) {
                resolve(isGetAction ? payload : 'success')
            }

            if (isGetAction) {
                this.bridge.info.token({actionType: 'get'})
            } else {
                this.bridge.info.token({actionType: 'set', tokens: params.tokens})
            }
        })
    }

    token() {
        return this.tokenBridge({actionType: 'get'})
    }

    setToken(tokens: UserTokens) {
        return this.tokenBridge({actionType: 'set', tokens})
    }

    async style(): Promise<DeviceStyle> {
        return new Promise((resolve, reject) => {
            if (typeof this.bridge?.info?.style !== 'function') {
                reject(new UnSupportedInterfaceError(`${this.name} info.style`))
            }

            this.bridge.info.onStyle = function (payload) {
                resolve(payload)
            }

            this.bridge.info.style()
        })
    }

    /**
     * TODO: userInfo 가지고 오도록 수정
     * app에서 user info 가지고 오기
     */
    get user() {
        return ''
    }
}
