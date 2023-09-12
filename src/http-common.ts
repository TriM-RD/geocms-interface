import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  // withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'X-Firm': localStorage.getItem('firm')
  }
})

export default apiClient
