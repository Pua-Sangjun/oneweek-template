import {ResponseInterceptor} from './createInstance'

export const extractApiResponseHandler: ResponseInterceptor = {
    fulfilled: (response) => {
        return response.data
    },
}
