/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'promise/lib/done'
import 'promise/lib/finally'

// @ts-ignore
import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions'
// @ts-ignore
import Promise from 'promise/lib/es6-extensions'
// @ts-ignore
import tracking from 'promise/lib/rejection-tracking'

type Tracker = (id: number, error: unknown) => void

export const setUnhandledPromiseRejectionTracker = (tracker: Tracker) => {
    polyfillGlobal('Promise', () => {
        tracking.enable({
            allRejections: true,
            onUnhandled: tracker,
        })

        return Promise
    })
}
