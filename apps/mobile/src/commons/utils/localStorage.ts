import AsyncStorage, {AsyncStorageStatic} from '@react-native-async-storage/async-storage'

export type GetItem = {result: 'fail'; data: null} | {result: 'success'; data: string}
type SetOrRemoveItem = Omit<GetItem, 'data'>

class LocalStorage {
    private storage: AsyncStorageStatic

    constructor() {
        this.storage = AsyncStorage
    }

    async get(key: string): Promise<GetItem> {
        try {
            const savedData = await this.storage.getItem(key)
            if (!savedData) {
                return {result: 'fail', data: null}
            }
            return {result: 'success', data: savedData}
        } catch (error) {
            return {result: 'fail', data: null}
        }
    }

    async set(key: string, value: string): Promise<SetOrRemoveItem> {
        try {
            await this.storage.setItem(key, value)
            return {result: 'success'}
        } catch (error) {
            return {result: 'fail'}
        }
    }

    async remove(key: string): Promise<SetOrRemoveItem> {
        try {
            await this.storage.removeItem(key)
            return {result: 'success'}
        } catch (error) {
            return {result: 'fail'}
        }
    }
}

export const localStorage = new LocalStorage()
