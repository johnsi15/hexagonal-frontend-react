import axios from 'axios'
import { type User, UserRepository } from '../domain/User'

class HttpUserRepository implements UserRepository {
  constructor(private readonly apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl
  }

  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${this.apiBaseUrl}/users`)
    return response.data
  }
}

export default HttpUserRepository
