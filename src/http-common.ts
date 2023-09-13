import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  // withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'X-Firm': localStorage.getItem('firm')
  }
})

export function updateHeaders () : void {
  apiClient.defaults.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
  apiClient.defaults.headers['X-Firm'] = localStorage.getItem('firm')
}

export default apiClient
