import axios, {AxiosError} from 'axios'
import {StatusCodes} from 'http-status-codes'

export function isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error)
}

export class AccessTokenExpiredError extends Error {
    constructor() {
        super('AccessTokenExpiredError')
    }

    get name() {
        return 'AccessTokenExpiredError'
    }
}

export function isAccessTokenExpiredError(error: unknown): error is AccessTokenExpiredError {
    if (!axios.isAxiosError(error)) {
        return false
    }
    const {status, data} = error.response as {status: number; data?: {message: string}}

    return status === StatusCodes.UNAUTHORIZED && data?.message === 'Unauthorized'
}

export class RefreshTokenExpiredError extends Error {
    constructor() {
        super('RefreshTokenExpiredError')
    }

    get name() {
        return 'RefreshTokenExpiredError'
    }
}

export function isRefreshTokenExpiredError(error: unknown): error is RefreshTokenExpiredError {
    return error instanceof Error && error.message === 'RefreshTokenExpiredError'
}
