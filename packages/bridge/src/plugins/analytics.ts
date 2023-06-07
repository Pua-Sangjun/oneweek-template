import {PluginBase} from './base'

export type AnalyticsInterface = {
    log: {
        firebase: (name: string, params: any) => void
    }
}

export class PluginAnalytics extends PluginBase {
    private name = 'PluginAnalytics'

    async log({name, params}: {name: string; params: any}) {
        if (typeof this.bridge?.log?.firebase !== 'function') {
            this.throwUnsupportedError(`${this.name} log`)
        }

        this.bridge.log.firebase(name, params)
    }
}
