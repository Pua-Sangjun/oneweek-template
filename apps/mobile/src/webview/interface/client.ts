import {isIOS} from '$constants/platform'

const disableZoom = `
function disableZoom() {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0')
    document.getElementsByTagName('head')?.[0]?.appendChild(meta)
}
window.addEventListener('DOMContentLoaded', disableZoom)

`
// post message to react native webview
const postMessage = `
window.oneweek = window.oneweek || {}
const bridge = window.oneweek
function postMessage({type, payload}) {
	if(!type){
		console.log("injected js interface type이 정의 되어있지 않음")
		return
	}
	const message = JSON.stringify({type, payload})
	window.ReactNativeWebView.postMessage(message)
}
` as const

const clientRouterWrapper = `
;(function () {
    function wrapHistory(fn) {
        return function wrapper() {
            const result = fn.apply(this, arguments)
            postMessage({type: 'router.clientHistory'})
            return result
        }
    }
    history.pushState = wrapHistory(history.pushState)
    history.replaceState = wrapHistory(history.replaceState)
    window.addEventListener('popstate', function () {
        postMessage({type: 'router.clientHistory'})
    })
})()
`

const clientToNative = `
bridge.storage = function (actionType, key, value) {
    postMessage({type: 'storage', payload: {actionType, key, value}})
}
bridge.request = function (payload) {
    postMessage({type: 'request', payload})
}
bridge.log = {
    console: function (loggingType, message) {
        postMessage({type: 'log.console', payload: {loggingType, message}})
    },
    firebase: function (name, params) {
        postMessage({type: 'log.firebase', payload: {name, params}})
    },
}
bridge.info = {
    style: function () {
        postMessage({type: 'info.style'})
    },
    device: function () {
        postMessage({type: 'info.device'})
    },
    token: function (payload) {
        postMessage({type: 'info.token', payload})
    },
}
bridge.ui = {
    toast: function (message, duration) {
        postMessage({type: 'ui.toast', payload: {message, duration}})
    },
    alert: function (payload) {
        postMessage({type: 'ui.alert', payload})
    },
}
bridge.router = {
    navigation: function (payload) {
        postMessage({type: 'router.navigation', payload})
    },
}
bridge.option = {
    ui: function (payload) {
        postMessage({type: 'option.ui', payload})
    },
    navigation: function (payload) {
        postMessage({type: 'option.navigation', payload})
    }
}
` as const

/**
 * webview handler 는 ios는 window / aos는 document로 달아야한다
 */
// TODO : 광역으로 right button 처리해야함
const nativeResponseHandler = `
${isIOS ? 'window' : 'document'}.addEventListener('message', function (e) {
	try {
		const {type, payload} = JSON.parse(e.data)
		switch (type) {
			case "info.device":
				window.oneweek.info.onDevice(payload)
				return
			case "info.token":
				window.oneweek.info.onToken(payload)
				return
			case "info.style":
				window.oneweek.info.onStyle(payload)
				return
			case "storage":
				window.oneweek.onStorage(payload)
				return
			case "ui.alert":
				window.oneweek.ui.onAlert(payload)
				return
			case "request":
				window.oneweek.onRequest(payload)
				return
            case "option.navigation.rightButton":
                window.oneweek.option.onRightButton(payload)
                return
			default:
				throw new Error(type + JSON.stringify(payload) + "는 injected js interface 정의 되어있지 않음")
		}
	} catch (error) {
		console.log(error);
		throw new Error(error.message + "injected js interface parse error")
	}
})
` as const

export const injectedInterface = `
${disableZoom}
${postMessage}
${clientRouterWrapper}
${clientToNative}
${nativeResponseHandler}
`
