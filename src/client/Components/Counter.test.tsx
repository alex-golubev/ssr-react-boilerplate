import { render, fireEvent } from '@testing-library/react'
import { Counter } from './Counter'

describe('Counter component', () => {
  // Test that initial state of counter is 0
  it('initial state is 0', () => {
    const { getByText } = render(<Counter />)
    expect(getByText('0')).toBeInTheDocument()
  })

  // Test that the counter correctly increments when the button is clicked
  it('increments counter on button click', () => {
    const { getByText } = render(<Counter />)
    fireEvent.click(getByText('Increment'))
    expect(getByText('1')).toBeInTheDocument()
  })
})
