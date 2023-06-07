import {localStorage} from '$commons/utils/localStorage'

export const bridgeStorage = {
    get: async (key: string) => {
        return localStorage.get(key)
    },
    set: async (key: string, value: string) => {
        return localStorage.set(key, value)
    },
    remove: async (key: string) => {
        return localStorage.remove(key)
    },
}
