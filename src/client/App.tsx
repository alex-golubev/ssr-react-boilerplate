import type { JSX } from 'react'
import { Counter } from './Components/Counter'

export const App = (): JSX.Element => {
  return (
    <main className="flex items-center flex-col justify-between h-screen">
      <Counter />
    </main>
  )
}
