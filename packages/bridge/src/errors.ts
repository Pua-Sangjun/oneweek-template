export class NotWebViewConditionError extends Error {
    get name() {
        return 'NotWebViewConditionError'
    }
}

export class UnSupportedInterfaceError extends Error {
    interfaceName: string

    constructor(interfaceName: string) {
        super('UnSupportedInterfaceError')
        this.interfaceName = interfaceName
    }

    get name() {
        return 'UnSupportedInterfaceError'
    }
}
