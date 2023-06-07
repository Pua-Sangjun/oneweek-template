class DeferredPromise<T = void> implements Promise<T> {
    private readonly promise: Promise<T>

    private _resolve!: (value: T | PromiseLike<T>) => void

    private _reject!: (reason?: any) => void

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }

    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
        onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onFulfilled, onRejected)
    }

    catch<TResult = never>(
        onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): Promise<T | TResult> {
        return this.promise.catch(onRejected)
    }

    finally(onfinally?: (() => void) | null): Promise<T> {
        return this.promise.finally(onfinally)
    }

    [Symbol.toStringTag]: string

    get resolve() {
        return this._resolve
    }

    get reject() {
        return this._reject
    }
}

export default DeferredPromise
