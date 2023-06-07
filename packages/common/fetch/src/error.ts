export function isInstanceOfFetchInstanceError(error: Error): error is FetchInstanceError {
    return 'requestURL' in error && 'method' in error && 'status' in error && 'requestHeaders' in error
}

export class FetchInstanceError extends Error {
    requestURL: string

    method: string

    status: number

    requestHeaders: HeadersInit

    constructor({
        requestURL,
        requestHeaders,
        method,
        status,
    }: {
        requestURL: string
        requestHeaders: HeadersInit
        method: string
        status: number
    }) {
        super()

        this.requestURL = requestURL
        this.requestHeaders = requestHeaders
        this.method = method
        this.status = status
    }
}

export function isInstanceOfFetchError(error: Error): error is FetchError {
    return isInstanceOfFetchInstanceError(error) && 'response' in error
}

export class FetchError extends FetchInstanceError {
    response: string

    constructor(
        {
            requestURL,
            requestHeaders,
            method,
            status,
        }: {requestURL: string; requestHeaders: HeadersInit; method: string; status: number},
        response: string,
    ) {
        super({requestHeaders, method, requestURL, status})

        this.response = response
    }

    get name() {
        return 'FetchError'
    }

    get message() {
        return `${this.name} >> Failed to fetch [${this.method}] ${this.requestURL} with ${this.status}. Response: ${this.response}`
    }
}

export class ParsingError extends FetchInstanceError {
    constructor({
        requestURL,
        requestHeaders,
        method,
        status,
    }: {
        requestURL: string
        requestHeaders: HeadersInit
        method: string
        status: number
    }) {
        super({requestHeaders, method, requestURL, status})
    }

    get name() {
        return 'ParsingError'
    }

    get message() {
        return `${this.name} >> Failed to parse to JSON [${this.method}] ${this.requestURL} with ${this.status}`
    }
}
