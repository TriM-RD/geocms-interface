import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  // withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})

export default apiClient
