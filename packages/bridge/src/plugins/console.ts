import {PluginBase} from './base'

export type ConsoleInterface = {
    log: {
        console: (loggingType: 'log' | 'error', message: any) => string
    }
}

export class PluginConsole extends PluginBase {
    private name = 'PluginConsole'

    log(message: any) {
        if (this.isProd) {
            return
        }
        if (typeof this.bridge?.log?.console !== 'function') {
            this.throwUnsupportedError(`${this.name} log`)
        }
        this.bridge.log.console('log', message)
    }

    error(message: any) {
        if (this.isProd) {
            return
        }
        if (typeof this.bridge?.log?.console !== 'function') {
            this.throwUnsupportedError(`${this.name} error`)
        }
        this.bridge.log.console('error', message)
    }
}
