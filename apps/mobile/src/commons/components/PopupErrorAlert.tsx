import React, {FC} from 'react'
import {GestureResponderEvent} from 'react-native'
import {noop} from '@oneweek/util'

import {PopupError} from '$commons/errors/popupError'
import {Alert} from '$commons/components/Alert'

type PopupErrorAlertProps = {
    error: Error | null
    isShow: boolean
    onClose: (e: GestureResponderEvent) => void
}

export const PopupErrorAlert: FC<PopupErrorAlertProps> = ({error, isShow, onClose}) => {
    if (!error) {
        return null
    }

    if (!(error instanceof PopupError)) {
        return null
    }

    const {title, message, buttonText} = error

    return (
        <Alert
            type="alert"
            direction="vertical"
            success={{label: buttonText, callback: noop}}
            isShow={isShow}
            title={title || ''}
            message={message}
            onClose={onClose}
            preventOutsideClick
        />
    )
}
