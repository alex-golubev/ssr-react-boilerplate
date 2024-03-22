import { render } from '@testing-library/react'
import { App } from './App'

// Describe what is being tested
describe('App function', () => {
  // Test a single use case
  it('renders App component', () => {
    const { getByText } = render(<App />)
    expect(getByText('Counter')).toBeInTheDocument()
  })
})
