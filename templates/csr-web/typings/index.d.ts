declare global {
    type valueof<T> = T[keyof T] // eslint-disable-line @typescript-eslint/naming-convention

    type DeepReadonly<T> = T extends (infer R)[]
        ? DeepReadonlyArray<R>
        : T extends Function
        ? T
        : T extends object
        ? DeepReadonlyObject<T>
        : T

    type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>

    type DeepReadonlyObject<T> = {
        readonly [P in keyof T]: DeepReadonly<T[P]>
    }
}
