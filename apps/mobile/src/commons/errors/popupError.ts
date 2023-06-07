import {CommonError} from '$commons/errors/commonErrors'

const DEFAULT_BUTTON_TEXT = '확인'

export type PopupErrorParams = Readonly<{
    title?: string
    message?: string
    buttonText?: string
    onPress?: Function
}>

export interface PopupErrorLike {
    readonly isPopupError: boolean
    onPress?: Function
}

export function isPopupError(error: any): error is PopupErrorLike {
    if (!error) {
        return false
    }

    return error.isPopupError
}

export class PopupError extends CommonError implements PopupErrorLike {
    constructor(private readonly params: PopupErrorParams) {
        super(params.message || '')
    }

    get name() {
        return 'PopupError'
    }

    get isPopupError() {
        return true
    }

    get buttonText() {
        return this.params.buttonText || DEFAULT_BUTTON_TEXT
    }

    get onPress() {
        return this.params.onPress
    }

    get title() {
        return this.params.title
    }
}
