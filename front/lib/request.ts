type Primitive = string | number | boolean | null | undefined

// Record<K, T> 是一个实用工具类型，用于创建具有特定键类型和值类型的对象类型。它是构建类型安全字典、映射和配置对象的强大工具。
// 它接受两个类型参数：K 是键的类型，T 是值的类型。
// Record<K, T> 表示一个对象，其中每个键都是 K 类型，对应的值都是 T 类型。
// 这使得我们可以在编译时确保对象的键值对符合预期的类型，从而提高代码的类型安全性。

// 请求参数类型
export type RequestParams = Record<string, Primitive | Primitive[]>

// 请求配置类型
export type RequestConfig = {
  baseURL?: string
  headers?: HeadersInit
  timeout?: number
  credentials?: RequestCredentials
  cache?: RequestCache
  redirect?: RequestRedirect
  mode?: RequestMode
  signal?: AbortSignal
}

// 请求选项类型
export type RequestOptions = RequestConfig & {
  params?: RequestParams
  method?: string
  body?: unknown
}

// HTTP 错误类型
export type HttpError = {
  name: string
  status: number
  message: string
  data?: unknown
}


// 默认基础 URL
const defaultBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

function toSearchParams(params?: RequestParams): string {
  if (!params) return ""
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v === undefined || v === null) return
        usp.append(key, String(v))
      })
    } else {
      usp.set(key, String(value))
    }
  })
  const s = usp.toString()
  return s ? `?${s}` : ""
}

function buildURL(path: string, baseURL?: string, params?: RequestParams): string {
  const prefix = (baseURL ?? defaultBaseURL) || ""
  const url = prefix && !/^https?:\/\//i.test(path) && !path.startsWith("/")
    ? `${prefix.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
    : `${prefix}${path}`
  return `${url}${toSearchParams(params)}`
}

function withTimeout(timeout?: number, externalSignal?: AbortSignal): AbortSignal | undefined {
  if (!timeout && !externalSignal) return externalSignal
  const controller = new AbortController()
  const signals: AbortSignal[] = []
  if (externalSignal) signals.push(externalSignal)
  signals.forEach(s => {
    s.addEventListener("abort", () => controller.abort())
  })
  if (timeout && timeout > 0) {
    setTimeout(() => controller.abort(), timeout)
  }
  return controller.signal
}

async function parseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || ""
  if (ct.includes("application/json")) return res.json()
  if (ct.includes("text/")) return res.text()
  const blob = await res.blob()
  return blob
}

export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    baseURL,
    headers,
    timeout,
    credentials,
    cache,
    redirect,
    mode,
    signal,
    params,
    method = "GET",
    body,
    ...rest
  } = options

  // 添加 Authorization header
  const authHeaders: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = buildURL(path, baseURL, params)
  const reqSignal = withTimeout(timeout, signal)

  const reqInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(headers as Record<string, string>),
    },
    credentials,
    cache,
    redirect,
    mode,
    signal: reqSignal,
    ...rest
  }

  if (body) {
    reqInit.body = JSON.stringify(body)
  }

  try {
    const res = await fetch(url, reqInit)
    const data = await parseBody(res)

    if (!res.ok) {
      // 处理 401 未授权
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw {
        name: "HttpError",
        status: res.status,
        message: (data as any)?.message || res.statusText,
        data
      } as HttpError
    }

    return data as T
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw { name: "TimeoutError", status: 408, message: "Request Timeout" }
    }
    throw err
  }
}

export function get<T = unknown>(path: string, config: RequestConfig & { params?: RequestParams } = {}) {
  return request<T>(path, { ...config, method: "GET" })
}

export function post<T = unknown>(path: string, body?: unknown, config: RequestConfig & { params?: RequestParams } = {}) {
  return request<T>(path, { ...config, method: "POST", body })
}

export function put<T = unknown>(path: string, body?: unknown, config: RequestConfig & { params?: RequestParams } = {}) {
  return request<T>(path, { ...config, method: "PUT", body })
}

export function patch<T = unknown>(path: string, body?: unknown, config: RequestConfig & { params?: RequestParams } = {}) {
  return request<T>(path, { ...config, method: "PATCH", body })
}

export function del<T = unknown>(path: string, config: RequestConfig & { params?: RequestParams } = {}) {
  return request<T>(path, { ...config, method: "DELETE" })
}

export const http = { request, get, post, put, patch, del }

