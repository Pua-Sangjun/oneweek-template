import {NotWebViewConditionError} from './errors'
import {
    PluginConsole,
    PluginAnalytics,
    PluginInfo,
    PluginStorage,
    PluginToast,
    PluginAlert,
    PluginRequest,
    PluginRouter,
    PluginOption,
} from './plugins'

type Newable<T> = {new (...args: any[]): T}

type BridgeOptions = {
    env: 'dev' | 'real'
}

type NewablePlugins = Newable<
    PluginAnalytics | PluginInfo | PluginStorage | PluginToast | PluginAlert | PluginRequest | PluginRouter
>

export class Bridge {
    private env: 'dev' | 'real'

    console: PluginConsole

    option: PluginOption

    analytics!: PluginAnalytics

    info!: PluginInfo

    storage!: PluginStorage

    toast!: PluginToast

    alert!: PluginAlert

    request!: PluginRequest

    router!: PluginRouter

    constructor(options?: BridgeOptions) {
        this.env = options?.env || 'dev'
        if (typeof window === 'undefined' || !window.oneweek) {
            if (this.env === 'real') {
                throw new NotWebViewConditionError('oneweek app의 webview 환경이 아닙니다.')
            } else {
                // eslint-disable-next-line no-console
                console.log('oneweek app의 webview 환경이 아닙니다.')
            }
        }
        // 기본 플러그인
        this.console = new PluginConsole(this.env)
        this.option = new PluginOption(this.env)
    }

    addPlugin(Plugin: NewablePlugins): this {
        const plugin = new Plugin(this.env)
        if (plugin instanceof PluginAnalytics) {
            this.analytics = plugin
        }
        if (plugin instanceof PluginInfo) {
            this.info = plugin
        }
        if (plugin instanceof PluginStorage) {
            this.storage = plugin
        }
        if (plugin instanceof PluginToast) {
            this.toast = plugin
        }
        if (plugin instanceof PluginAlert) {
            this.alert = plugin
        }
        if (plugin instanceof PluginRequest) {
            this.request = plugin
        }
        if (plugin instanceof PluginRouter) {
            this.router = plugin
        }
        return this
    }
}
