import axios from 'axios'

export class APIClient {
  private readonly baseUrl: string

  constructor(baseUrl: string = import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com') {
    this.baseUrl = baseUrl
  }

  async get<T>(path: string): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}${path}`)
    return response.data
  }

  // more methods
}
