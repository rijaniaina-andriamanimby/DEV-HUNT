import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  CorneliaSpeech  from './component/corneliaSpeech'
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CorneliaSpeech />} />
      </Routes>
    </Router>
  )
}

export default App
