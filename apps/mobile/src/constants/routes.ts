export const STACK_SCREENS = {
    TAB: 'tab',
    WEBVIEW: 'webview',
} as const

export type StackScreenParams = {
    [STACK_SCREENS.TAB]: undefined
    [STACK_SCREENS.WEBVIEW]: {
        uri: string
    }
}
