import type {AxiosInstance, RawAxiosRequestConfig} from 'axios'

export class SimpleApi {
    // eslint-disable-next-line no-useless-constructor
    constructor(private readonly axiosInstance: AxiosInstance) {}

    async get<Result>(url: string, config?: RawAxiosRequestConfig): Promise<Result> {
        const {data: result} = await this.axiosInstance.get<Result>(url, config)

        return result
    }

    async post<Result>(url: string, data?: unknown, config?: RawAxiosRequestConfig): Promise<Result> {
        const {data: result} = await this.axiosInstance.post<Result>(url, data, config)

        return result
    }

    async delete<Result>(url: string, config?: RawAxiosRequestConfig): Promise<Result> {
        const {data: result} = await this.axiosInstance.delete<Result>(url, config)

        return result
    }

    async patch<Result>(url: string, data?: unknown, config?: RawAxiosRequestConfig): Promise<Result> {
        const {data: result} = await this.axiosInstance.patch<Result>(url, data, config)

        return result
    }

    async put<Result>(url: string, data?: unknown, config?: RawAxiosRequestConfig): Promise<Result> {
        const {data: result} = await this.axiosInstance.put<Result>(url, data, config)

        return result
    }
}
