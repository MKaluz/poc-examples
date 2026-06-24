import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

// Shared axios instance – configured once and used by both the hand-written
// API client and the orval-generated client (via the mutator override in
// orval.config.ts).
export const axiosInstance = axios.create({ baseURL: '/' })

// Mutator signature expected by orval when using a custom axios instance.
export function axiosCustomInstance<T>(config: AxiosRequestConfig): Promise<T> {
  return axiosInstance(config).then((r) => r.data)
}
