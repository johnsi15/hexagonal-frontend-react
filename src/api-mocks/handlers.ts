import { http, HttpResponse } from 'msw'
import { User } from '../core/users/domain/User'

const mockUsers: User[] = [
  {
    name: 'John Serrano',
    email: 'john@example.com',
    age: 25,
  },
  {
    name: 'Andrey Caselles',
    email: 'andrey@example.com',
    age: 30,
  },
]

const API_URL = import.meta.env.API_URL || 'https://jsonplaceholder.typicode.com'

// { request, params, requestId } -> https://mswjs.io/docs/concepts/response-resolver#respond-with-a-mocked-response
const usersHandler = http.get(`${API_URL}/users`, async () => HttpResponse.json(mockUsers, { status: 200 }))

export const handlers = [usersHandler]

// exporto en caso quiera crear test de una exception
export const usersHandlerException = http.get(`${API_URL}/users`, async () =>
  HttpResponse.json({ message: 'Deliberately broken request' }, { status: 500 })
)
