import {localStorage} from '$commons/utils/localStorage'

export interface Persistent<DataType> {
    save(data: DataType): Promise<void>
    load(): Promise<DataType | undefined>
    delete(): Promise<void>
}

export interface PersistentArgs<DataType> {
    key: string
    serialize(data: DataType): Promise<string> | string
    deserialize(str: string): Promise<DataType> | DataType
}

class DevicePersistent<DataType> implements Persistent<DataType> {
    private readonly persistentArgs: PersistentArgs<DataType>

    constructor(persistentArgs: PersistentArgs<DataType>) {
        this.persistentArgs = persistentArgs
    }

    async save(data: DataType) {
        const {key, serialize} = this.persistentArgs
        const value = await serialize(data)
        await localStorage.set(key, value)
    }

    async load(): Promise<DataType | undefined> {
        const {key, deserialize} = this.persistentArgs
        const {result, data} = await localStorage.get(key)
        if (result === 'fail') {
            return undefined
        }
        return deserialize(data)
    }

    async delete() {
        const {key} = this.persistentArgs
        await localStorage.remove(key)
    }
}

export function serializeUsingJson<DataType>(data: DataType) {
    return JSON.stringify(data)
}

export function deserializeUsingJson<DataType>(str: string): DataType {
    return JSON.parse(str)
}

export function noNeedSerialize(data: unknown) {
    return data as string
}

export function noNeedDeserialize<T>(str: unknown) {
    return str as T
}

export function createPersistent<DataType>(
    key: string,
    serialize: PersistentArgs<DataType>['serialize'] = serializeUsingJson,
    deserialize: PersistentArgs<DataType>['deserialize'] = deserializeUsingJson,
): Persistent<DataType> {
    return new DevicePersistent<DataType>({key, serialize, deserialize})
}
