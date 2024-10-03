import { useEffect, useState } from 'react'
// import { APIClient } from './core/api-client'
import ListUsers from './core/users/application/ListUsers'
import { User } from './core/users/domain/User'
import './styles/App.css'

function App() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const listUsers = new ListUsers()
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
              <p>Email: {user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
