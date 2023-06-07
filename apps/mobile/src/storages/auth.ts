import {createPersistent} from '$commons/utils/persistent'

export type UserTokens = {
    accessToken: string
    refreshToken: string
}

const AUTH_TOKENS: Readonly<string> = 'auth_tokens'

export const authPersistent = createPersistent<UserTokens>(AUTH_TOKENS)

export async function getTokens() {
    const tokens = await authPersistent.load()
    return tokens
}

export async function getToken(refresh?: boolean) {
    const tokens = await getTokens()
    return refresh ? tokens?.refreshToken : tokens?.accessToken
}

export async function setToken(token: UserTokens) {
    await authPersistent.save(token)
}
