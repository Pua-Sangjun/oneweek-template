import {Color} from '@oneweek-react/theme'

import {UnSupportedInterfaceError} from '../errors'
import {PluginBase} from './base'

type AlertPayload = {
    title?: string
    message?: string
    success?: {label?: string; color?: Color}
    cancel?: {label?: string; color?: Color}
    direction?: 'vertical' | 'horizontal'
    preventOutsideClick?: boolean
}

export type AlertInterface = {
    ui: {
        alert: (props: AlertPayload) => void
        onAlert: (payload: 'success' | 'cancel') => void
    }
}

export class PluginAlert extends PluginBase {
    private name = 'PluginAlert'

    async show(payload: AlertPayload): Promise<'success' | 'cancel'> {
        return new Promise((resolve, reject) => {
            if (typeof this.bridge?.ui?.alert !== 'function') {
                reject(new UnSupportedInterfaceError(`${this.name} show alert`))
            }

            this.bridge.ui.onAlert = function (result) {
                resolve(result)
            }

            this.bridge.ui.alert(payload)
        })
    }
}
