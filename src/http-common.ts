import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  // withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'X-Firm': localStorage.getItem('firm'),
    'X-Lang': localStorage.getItem('lang')
  }
})

export function updateHeaders () : void {
  apiClient.defaults.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
  apiClient.defaults.headers['X-Firm'] = localStorage.getItem('firm')
  apiClient.defaults.headers['X-Lang'] = localStorage.getItem('lang')
}

export default apiClient
