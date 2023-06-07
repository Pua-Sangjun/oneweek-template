import {PluginBase} from './base'

export type RouterInterface = {
    router: {
        navigation: (
            params:
                | {
                      actionType: 'push' | 'replace'
                      url: string
                  }
                | {actionType: 'close'},
        ) => void
    }
}

export class PluginRouter extends PluginBase {
    private name = 'PluginRouter'

    private getUrlWithOrigin(url: string) {
        const validUrlSchemes = ['https://', ...(this.isProd ? [] : ['http://'])]
        const nextUrl = validUrlSchemes.some((scheme) => url.startsWith(scheme))
            ? url
            : `${window.location.origin}${url}`
        return nextUrl
    }

    push(url: string) {
        if (typeof this.bridge?.router?.navigation !== 'function') {
            this.throwUnsupportedError(`${this.name} error`)
        }
        this.bridge.router.navigation({actionType: 'push', url: this.getUrlWithOrigin(url)})
    }

    replace(url: string) {
        if (typeof this.bridge?.router?.navigation !== 'function') {
            this.throwUnsupportedError(`${this.name} error`)
        }

        this.bridge.router.navigation({actionType: 'replace', url: this.getUrlWithOrigin(url)})
    }

    close() {
        if (typeof this.bridge?.router?.navigation !== 'function') {
            this.throwUnsupportedError(`${this.name} error`)
        }

        this.bridge.router.navigation({actionType: 'close'})
    }
}
