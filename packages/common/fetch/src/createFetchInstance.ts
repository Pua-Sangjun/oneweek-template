import {IncomingMessage} from 'http'

import {StatusCodes} from 'http-status-codes'
import fetch from 'isomorphic-fetch'
import {stringify} from 'query-string'

import {FetchError, ParsingError} from './error'

function getHeaderFromReq(req: IncomingMessage) {
    const referer = req.headers.referer || ''
    const cookie = req.headers.cookie || ''
    const userAgent = req.headers['user-agent'] || ''

    return {
        referer,
        cookie,
        'user-agent': userAgent,
    }
}

export enum ResponseParsingType {
    JSON = 'json',
    TEXT = 'text',
    EMPTY = 'empty',
}

export enum SuppressErrorLoggingType {
    ALL = 'all',
    STATUS_4XX = '4XX',
    OFF = 'off',
}

type SuppressErrorTracking = SuppressErrorLoggingType | number[] | number

export interface FetchOptions<T> extends RequestInit {
    req?: IncomingMessage
    params?: {
        [key: string]: unknown
    }
    responseType?: ResponseParsingType
    abortController?: AbortController
    silently?: boolean
    suppressErrorLoggingType?: SuppressErrorTracking
    defaultResult?: T
}

export type FetchResult<T> = {
    status: number
    ok: boolean
    result: T
}

function shouldSuppressErrorLogging(type: SuppressErrorTracking, httpStatus: number): boolean {
    if (typeof type === 'number') {
        return httpStatus === type
    }

    if (Array.isArray(type)) {
        return type.includes(httpStatus)
    }

    const isStatus4XX = httpStatus >= 400 && httpStatus < 500

    switch (type) {
        case SuppressErrorLoggingType.ALL: {
            return true
        }
        case SuppressErrorLoggingType.STATUS_4XX: {
            return isStatus4XX
        }
    }
    return false
}

/**
 * @param baseURL [Req] 요청 api의 baseURL
 * @param options [Optional] {logger} => void 로깅함수
 *
 * @param apiPath [Req] 요청 api의 pathname
 * @param options.req [Optional] getServerSideProps 요청시 사용하는 req
 * @param options.params [Optional] 요청 api에 추가할 query parameters
 * @param options.responseType [Optional=JSON] 응답값을 파싱하는 방법. 값에 따라 json, text, none(=null) 가능
 * @param options.abortController [Optional] 응답을 취소하기 위한 abortController
 * @param options.suppressErrorTracking [Optional=None] http 응답이 에러로 왔을 경우(2XX, 3XX 외) 어떤 에러를 로깅에서 제외할 것인지 정의.
 * HttpCode, Array<HttpCode> 로 할 경우 특정 응답코드를 제외할 수 있음.
 * SuppressErrorType 값을 사용하여 전체, 4XX, 무시하지 않음으로 관리 가능
 * @param options.silently [Optional=false] true인 경우 어떠한 경우에도 에러를 throw 하지 않음
 * @param options.defaultResult [Optional=null] 응답 요청시 에러 / 빈 응답 등을 대비하는 기본값.
 * @param options.headers [Optional] 요청 헤더. options.responseType이 JSON이라면 'Content-Type': 'application/json'을 기본으로 탑재
 * @return Promise<FetchResult<T>>
 */
export function createFetchInstance(baseURL: string, {logger}: {logger?: (e: Error | unknown) => void} = {}) {
    return async function <T>(apiPath: string, options: FetchOptions<T> = {}): Promise<FetchResult<T>> {
        const {
            req,
            params,
            responseType = ResponseParsingType.JSON,
            abortController,
            suppressErrorLoggingType = SuppressErrorLoggingType.OFF,
            silently = false,
            defaultResult,
            method = 'GET',
            headers,
            ...requestOptions
        } = options

        const {signal} = abortController || {}

        const isJSONResponse = responseType === ResponseParsingType.JSON

        const requestURL = `${baseURL}${apiPath}${params ? `?${stringify(params)}` : ''}`

        const defaultHeaders = req ? getHeaderFromReq(req) : {}

        const requestHeaders = {
            ...headers,
            ...defaultHeaders,
            ...(isJSONResponse && {'Content-Type': 'application/json'}),
        }

        const response = await fetch(requestURL, {
            method,
            signal,
            headers: requestHeaders,
            ...requestOptions,
        })

        const {ok, status} = response
        const suppressErrorLogging = shouldSuppressErrorLogging(suppressErrorLoggingType, status)

        const fetchResult: FetchResult<T> = {
            status,
            ok,
            result: defaultResult as T,
        }

        try {
            if (!ok) {
                const result = await response.text()

                const fetchError = new FetchError({requestURL, method, status, requestHeaders}, result)

                throw fetchError
            } else {
                fetchResult.result =
                    isJSONResponse && status !== StatusCodes.NO_CONTENT ? await response.json() : await response.text()
            }

            return fetchResult
        } catch (e) {
            const error = ok ? new ParsingError({requestURL, method, status, requestHeaders}) : e

            if (!suppressErrorLogging) {
                logger?.(error)
                console.error(error) // eslint-disable-line no-console
            }

            if (!silently) {
                throw error
            }

            return fetchResult
        }
    }
}
