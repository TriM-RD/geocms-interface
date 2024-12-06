import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  //withCredentials: false,
  //credentials: "include",
  headers: { "Content-Type": "application/json" },
})

export function updateHeaders(): void {
  apiClient.defaults.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
  /*apiClient.defaults.headers['X-Firm'] = localStorage.getItem('firm')
  apiClient.defaults.headers['X-Lang'] = localStorage.getItem('lang')*/
}

export default apiClient
