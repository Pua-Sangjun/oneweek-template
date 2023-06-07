import {PluginBase} from './base'

export type ToastInterface = {
    ui: {
        toast: (message: string, duration?: number) => void
    }
}

export class PluginToast extends PluginBase {
    private name = 'PluginToast'

    show({message, duration}: {message: string; duration?: number}) {
        if (typeof this.bridge?.ui?.toast !== 'function') {
            this.throwUnsupportedError(`${this.name} show toast`)
        }
        this.bridge.ui.toast(message, duration)
    }
}
