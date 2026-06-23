import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './navbar.jsx'
import App from './App.jsx'
import Merge from './Pages/merge.jsx'
import Image from './Pages/Image.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/Image" element={<Image/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)