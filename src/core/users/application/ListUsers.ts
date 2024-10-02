import { type User, UserRepository } from '../domain/User'

export type ProductDTO = {
  name: string
  email: string
  age: number
}

class ListUsers {
  constructor(private userRepository: UserRepository) {}

  async getUsers(): Promise<ProductDTO[]> {
    const users = await this.userRepository.getUsers()
    return users.map(product => this.convertToUserDTO(product))
  }

  private convertToUserDTO(user: User): ProductDTO {
    return {
      name: user.name,
      email: user.email,
      age: user.age,
    }
  }
}

export default ListUsers
