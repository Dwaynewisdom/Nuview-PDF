import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './navbar.jsx'
import App from './App.jsx'
import Merge from './Pages/merge.jsx'
import Image from './Pages/Image.jsx'
import PDFtooffice from './Pages/PDFtooffice.jsx'
import PdfWatermarker from './Pages/watermark.jsx'
import PdfEditor from './Pages/editpdf.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/merge" element={<Merge />} />
            <Route path="/Image" element={<Image/>} />
            <Route path="/PDFtooffice" element={<PDFtooffice/>} />
            <Route path="/PdfWatermarker" element={<PdfWatermarker/>} />
            <Route path="/editpdf" element={<PdfEditor/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </StrictMode>,
)