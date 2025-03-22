import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import  CorneliaSpeech  from './component/corneliaSpeech'
import AudioList from './component/ListAudio/AudioList';
import './App'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CorneliaSpeech />} />
        <Route path="/audio-list" element={<AudioList />} />
      </Routes>
    </Router>
  )
}

export default App
