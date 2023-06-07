import axios, {AxiosRequestConfig, AxiosError, AxiosResponse, RawAxiosRequestConfig} from 'axios'

import {isAccessTokenExpiredError, RefreshTokenExpiredError} from './error'

export interface RequestInterceptor {
    fulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig
    rejected?: (error: AxiosError) => Promise<AxiosError> | null
}

export interface ResponseInterceptor {
    fulfilled?: (response: AxiosResponse) => AxiosResponse
    rejected?: (error: AxiosError) => Promise<AxiosError> | null
}

type Awaitable<T> = T | Promise<T>
type Tokens = {accessToken: string; refreshToken: string}

interface CreateAxiosInstanceParams {
    config?: RawAxiosRequestConfig
    interceptors?: {
        requestInterceptors?: RequestInterceptor[]
        responseInterceptors?: ResponseInterceptor[]
    }
    tokenHandler?: {
        get?: (refresh?: boolean) => Awaitable<string | undefined>
        reIssue?: (config: RawAxiosRequestConfig) => Promise<Tokens>
        set?: (newToken: Tokens) => Awaitable<void>
    }
}

type RefetchRequest = (accessToken: string) => void

export function createAxiosInstance({config = {}, interceptors = {}, tokenHandler}: CreateAxiosInstanceParams = {}) {
    const instance = axios.create(config)

    let isTokenRefreshing: boolean = false
    let refreshSubscribers: Array<RefetchRequest> = []

    const onTokenRefreshed = (accessToken: string) => {
        refreshSubscribers.forEach((callback) => callback(accessToken))
        refreshSubscribers = []
    }

    const {requestInterceptors = [], responseInterceptors = []} = interceptors
    requestInterceptors.forEach(({fulfilled, rejected}) => instance.interceptors.request.use(fulfilled, rejected))
    responseInterceptors.forEach(({fulfilled, rejected}) => instance.interceptors.response.use(fulfilled, rejected))

    instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
        // setRequest AccessToken when tokenHandler.get injected
        if (!tokenHandler?.get) {
            return config
        }
        const userAccessToken = await tokenHandler.get(false)
        if (userAccessToken) {
            config.headers.Authorization = `Bearer ${userAccessToken}`
        }
        return config
    }, null)

    // access token expired되면 refresh token을 이용해 access token 재발급 하고 재 셋팅
    instance.interceptors.response.use(null, async (error: AxiosError) => {
        if (
            !tokenHandler?.get ||
            !tokenHandler?.set ||
            !tokenHandler?.reIssue ||
            !error.config ||
            !isAccessTokenExpiredError(error)
        ) {
            return Promise.reject(error)
        }

        if (isTokenRefreshing) {
            const retryOriginalRequest = new Promise((resolve) => {
                const refetchPromise = (newAccessToken: string) => {
                    if (!error.config) {
                        return
                    }
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`
                    resolve(instance.request(error.config))
                }
                refreshSubscribers.push(refetchPromise)
            })
            return retryOriginalRequest
        }

        isTokenRefreshing = true
        const userRefreshToken = await tokenHandler.get(true)
        if (!userRefreshToken) {
            return Promise.reject(error)
        }
        error.config.headers.Authorization = `Bearer ${userRefreshToken}`
        try {
            const newTokens = await tokenHandler.reIssue(error.config)
            await tokenHandler.set(newTokens)
            isTokenRefreshing = false
            onTokenRefreshed(newTokens.accessToken)
            error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`
            return instance.request(error.config || {})
        } catch (error) {
            throw new RefreshTokenExpiredError()
        }
    })

    return instance
}
