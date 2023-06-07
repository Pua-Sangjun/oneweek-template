import {PluginBase} from './base'

export type UIOptions = {force?: boolean} & {
    enableHeader: boolean
    enableSafeAreaInsets: boolean
    showLoadingBar: boolean
    darkTheme: boolean
    pullToRefresh: boolean
}

type HeaderRight = Array<{key: string; icon?: string; title?: string; callback: () => void}>

export type NavigationOptions = {force?: boolean} & {
    navbar: boolean
    backSwipeable: boolean
    headerLeft: 'back' | 'close'
    headerTitle: string
    headerRight?: HeaderRight
    headerShadowVisible: boolean
}

export type OptionInterface = {
    option: {
        ui: (payload: Partial<UIOptions>) => void
        navigation: (payload: Partial<NavigationOptions>) => void
        onRightButton: (key: string) => void
    }
}

export class PluginOption extends PluginBase {
    private name = 'PluginOption'

    private headerRight: HeaderRight = []

    ui(newOptions: Partial<UIOptions>) {
        if (typeof this.bridge?.option?.ui !== 'function') {
            this.throwUnsupportedError(`${this.name} ui`)
        }
        this.bridge.option.ui(newOptions)
    }

    navigation(newOptions: Partial<NavigationOptions>) {
        if (typeof this.bridge?.option?.navigation !== 'function') {
            this.throwUnsupportedError(`${this.name} navigation`)
        }

        if (newOptions?.headerRight) {
            this.headerRight = newOptions.headerRight || []
            this.bridge.option.onRightButton = (key: string) => {
                const {callback} = this.headerRight.find((button) => button.key === key) || {}
                callback?.()
            }
        }

        this.bridge.option.navigation(newOptions)
    }
}
