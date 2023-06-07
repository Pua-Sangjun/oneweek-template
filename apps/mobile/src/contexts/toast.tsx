import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from 'react'

import Toast from '$commons/components/Toast'

export type ToastInfo = {message: string; duration?: number}
interface ToastContext {
    showToast: (info: ToastInfo) => void
}

const Context = createContext<ToastContext | undefined>(undefined)

export function ToastProvider({children}: PropsWithChildren<{}>) {
    const [toast, setToast] = useState<ToastInfo | null>(null)

    const handleDestroy = useCallback(() => {
        setToast(null)
    }, [])

    const showToast = useCallback((toastInfo: ToastInfo) => {
        setToast({...toastInfo})
    }, [])

    const values = useMemo(() => ({showToast}), [showToast])

    return (
        <>
            <Context.Provider value={values}>{children}</Context.Provider>
            <Toast message={toast?.message || ''} duration={toast?.duration || 1000} onDestroy={handleDestroy} />
        </>
    )
}

export function useToast() {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useToast must be within ToastProvider')
    }
    return context
}
