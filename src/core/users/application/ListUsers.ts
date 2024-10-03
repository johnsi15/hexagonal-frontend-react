import { APIClient } from '../../api-client'
import { type User } from '../domain/User'

class ListUsers {
  private readonly apiClient: APIClient

  constructor() {
    this.apiClient = new APIClient()
  }

  async getUsers(): Promise<User[]> {
    const users = await this.apiClient.get<User[]>('/users')
    return users
  }
}

export default ListUsers
