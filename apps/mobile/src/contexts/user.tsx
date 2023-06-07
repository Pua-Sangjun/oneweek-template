import {createContext, ReactNode, useContext} from 'react'

export type UserInfoContext = {}

const Context = createContext<UserInfoContext | undefined>(undefined)

export function UserInfoProvider({children}: {children: ReactNode}) {
    const values = undefined

    return <Context.Provider value={values}>{children}</Context.Provider>
}

export function useUserInfo() {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useUserInfo must be within UserInfoProvider')
    }
    return context
}
