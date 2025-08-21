import React             from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageHome }      from './pages'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PageHome />} />
      </Routes>
    </div>
  );
}

export default App