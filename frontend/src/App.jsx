import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import  CorneliaSpeech  from './component/corneliaSpeech'
import './App'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CorneliaSpeech/>
    </>
  )
}

export default App
