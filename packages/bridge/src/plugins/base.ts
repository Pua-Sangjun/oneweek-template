import {UnSupportedInterfaceError} from '../errors'
import {Oneweek} from '../typings'

export abstract class PluginBase {
    protected bridge: Oneweek

    isProd: boolean

    constructor(env: 'dev' | 'real') {
        this.bridge = window.oneweek
        this.isProd = env === 'real'
    }

    throwUnsupportedError(message: string) {
        if (this.isProd) {
            throw new UnSupportedInterfaceError(message)
        } else {
            console.log(message) // eslint-disable-line no-console
        }
    }
}
