import { render, screen } from '@testing-library/react'
import App from '../App'

describe('Component: App', () => {
  it('displays returned users on successful fetch', async () => {
    render(<App />)

    const displayedUsers = await screen.findAllByTestId(/user-id-\d+/)
    expect(displayedUsers).toHaveLength(10)
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Patricia Lebsack')).toBeInTheDocument()
  })
})
