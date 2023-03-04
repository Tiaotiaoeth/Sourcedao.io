import instance from './intercept'

// 请求头部信息
export type HeadersOptions = {
  'app-lang'?: string,
}

export type DataType = {
  [key: string]:unknown
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface AxiosRequest {
  baseURL?: string
  url?: string
  data?: DataType
  params?: unknown
  method?: Method
  headers?: HeadersOptions
  timeout?: number
  responseType?: ResponseType
}

class Abstract {

  protected baseURL = ''

  private apiAxios<T>({ baseURL, headers, method, url, data, params, responseType, timeout }: AxiosRequest): Promise<T> {

    return new Promise((resolve, reject) => {
      instance({
        baseURL: baseURL ? baseURL : this.baseURL,
        headers,
        method,
        url,
        params,
        data,
        responseType,
        timeout,
      }).then((response) => {
        const res = response.data
        return resolve(res)
      }).catch((err) => {
        const code = err?.data?.code || err?.code || -1
        const message = err?.data?.message || err?.message || (url + '请求失败')
        reject({ code, message, data: null })
      })
    })
  }

  /**
   * GET类型的网络请求
   */
  protected getReq<T>({ baseURL, headers, url, data, params, responseType, timeout }: AxiosRequest): Promise<T> {
    return this.apiAxios({ baseURL, headers, method: 'GET', url, data, params, responseType, timeout })
  }

  /**
   * POST类型的网络请求
   */
  protected postReq<T>({ baseURL, headers, url, data, params, responseType, timeout }: AxiosRequest): Promise<T> {
    return this.apiAxios({ baseURL, headers, method: 'POST', url, data, params, responseType, timeout })
  }

  /**
   * PUT类型的网络请求
   */
  protected putReq<T>({ baseURL, headers, url, data, params, responseType, timeout }: AxiosRequest): Promise<T> {
    return this.apiAxios({ baseURL, headers, method: 'PUT', url, data, params, responseType, timeout })
  }

  /**
   * DELETE类型的网络请求
   */
  protected deleteReq<T>({ baseURL, headers, url, data, params, responseType, timeout }: AxiosRequest): Promise<T> {
    return this.apiAxios({ baseURL, headers, method: 'DELETE', url, data, params, responseType, timeout })
  }
}

export default Abstract