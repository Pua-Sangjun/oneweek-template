import {createAxiosInstance, SimpleApi} from '@oneweek/fetch'
import {RawAxiosRequestConfig} from 'axios'

import {getToken, setToken, UserTokens} from '$storages/auth'
import {REST_API_ROUTES} from '$constants/api'

export const BASE_URL: Readonly<string> = 'http://localhost:5555/api'

/**
 * @description 기본 baseUrl이 들어간 API
 */
const restBaseApiInstance = createAxiosInstance({
    config: {baseURL: `${BASE_URL}/rest`},
})

export const restBaseApi = new SimpleApi(restBaseApiInstance)

/**
 *
 * @description token을 재 발행하기 위한 api
 * circular 참조를 끊기위해서, api에 작성
 */
async function reIssueToken(config: RawAxiosRequestConfig) {
    const newTokens = await restBaseApi.get<UserTokens>(REST_API_ROUTES.AUTH.REFRESH, config)
    return newTokens
}
/**
 * @description token이 들어간 API
 */
const restAuthApiInstance = createAxiosInstance({
    config: {baseURL: `${BASE_URL}/rest`},
    tokenHandler: {
        get: getToken,
        set: setToken,
        reIssue: reIssueToken,
    },
})

export const restAuthApi = new SimpleApi(restAuthApiInstance)
