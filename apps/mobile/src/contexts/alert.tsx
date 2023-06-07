import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from 'react'
import {useEvent} from '@oneweek-react/hook'

import {Alert, AlertProps} from '$commons/components/Alert'

export type AlertInfo = Omit<AlertProps, 'isShow'> & {
    from?: 'app' | 'web'
}

interface AlertContext {
    alertInfo: AlertInfo | null
    showAlert: (info: AlertInfo) => void
    handleClose: () => void
}

const Context = createContext<AlertContext | undefined>(undefined)

export function AlertProvider({children}: PropsWithChildren<{}>) {
    const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null)

    const handleClose = useEvent(() => {
        setAlertInfo(null)
    })

    const showAlert = useCallback((alertInfo: AlertInfo) => {
        setAlertInfo({
            ...alertInfo,
            ...(alertInfo?.from ? {from: alertInfo?.from} : {from: 'app'}),
        })
    }, [])

    const value = useMemo(() => ({showAlert, alertInfo, handleClose}), [alertInfo, showAlert]) // eslint-disable-line

    return (
        <>
            <Context.Provider value={value}>{children}</Context.Provider>
            {alertInfo?.from === 'app' && <Alert isShow={Boolean(alertInfo)} onClose={handleClose} {...alertInfo} />}
        </>
    )
}

export function useAlert() {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useAlert must be within AlertProvider')
    }
    return context
}
