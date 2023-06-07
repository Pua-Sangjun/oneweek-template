import type {WebViewMessageEvent} from 'react-native-webview'

export async function getResponseFromWebViewEvent(event: WebViewMessageEvent) {
    const {type} = JSON.parse(event.nativeEvent.data)
    switch (type) {
        case 'test':
            return {
                type: 'test',
                payload: {},
            }
        default:
            break
    }
}
