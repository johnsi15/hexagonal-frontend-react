import { render, screen } from '@testing-library/react'
import { usersHandlerException } from '../api-mocks/handlers'
import { mswServer, http, HttpResponse } from '../api-mocks/msw-server'
import App from '../App'

describe('Component: App', () => {
  it('displays returned users on successful fetch', async () => {
    render(<App />)

    const displayedUsers = await screen.findAllByTestId(/user-id-\d+/)
    expect(displayedUsers).toHaveLength(2)
    expect(screen.getByText('John Serrano')).toBeInTheDocument()
    expect(screen.getByText('Andrey Caselles')).toBeInTheDocument()
  })

  it('displays returned users on successful fetch', async () => {
    createGetSuccessResponse('/users', [
      {
        name: 'Name 01',
        email: 'name01@email.com',
        age: 20,
      },
      {
        name: 'Name 02',
        email: 'name02@email.com',
        age: 27,
      },
    ])

    render(<App />)

    const displayedUsers = await screen.findAllByTestId(/user-id-\d+/)
    expect(displayedUsers).toHaveLength(2)
    expect(screen.getByText('Name 01')).toBeInTheDocument()
    expect(screen.getByText('Name 02')).toBeInTheDocument()
  })

  // en caso de que quisiera testear un error
  it.skip('displays error message when fetching users raises error', async () => {
    mswServer.use(usersHandlerException)
    render(<App />)

    const errorDisplay = await screen.findByText('Failed to fetch users')
    expect(errorDisplay).toBeInTheDocument()
    const displayedUsers = screen.queryAllByTestId(/user-id-\d+/)
    expect(displayedUsers).toEqual([])
  })
})

function createGetSuccessResponse(path: string, response: Record<string, unknown> | Record<string, unknown>[]) {
  const usersHandler = http.get(`https://jsonplaceholder.typicode.com${path}`, async () => HttpResponse.json(response))

  mswServer.use(usersHandler)
}
