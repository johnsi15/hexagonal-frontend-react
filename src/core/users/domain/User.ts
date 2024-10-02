export type User = {
  name: string
  email: string
  age: number
}

export interface UserRepository {
  getUsers(): Promise<User[]>
}
