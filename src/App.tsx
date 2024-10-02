import { useEffect, useState } from 'react'
import ListUsers, { type ProductDTO } from './core/users/application/ListUsers'
import './App.css'
import HttpUserRepository from './core/users/adapters/HttpUserRepository'

function App() {
  const [users, setUsers] = useState<ProductDTO[]>([])

  useEffect(() => {
    const userRepository = new HttpUserRepository('https://api.codium.team')
    const listUsers = new ListUsers(userRepository)

    listUsers.getUsers().then(setUsers)
  }, [])

  return (
    <main>
      <h1>Lista de usuarios</h1>
      <ul>
        {users.map((user, index) => (
          <li key={user.name} data-testid={'user-id-' + index}>
            <div>
              <h3>{user.name}</h3>
              <p>Email: ${user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
