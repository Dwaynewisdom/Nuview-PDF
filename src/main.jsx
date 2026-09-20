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
import PdfEditor from './Pages/Editpdf.jsx'
import DocumentToMarkdown from "./Pages/DoctoMD.jsx"
import Loginandsign from './Pages/Loginandsign.jsx'
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Auth0ProviderWithHistory>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/merge" element={<Merge />} />
              <Route path="/Image" element={<Image/>} />
              {/* <Route path="/PDFtooffice" element={<PDFtooffice/>} /> */}
              <Route path="/PdfWatermarker" element={<PdfWatermarker/>} />
              <Route path="/editpdf" element={<PdfEditor/>}/>
              <Route path="/DoctoMD" element ={<DocumentToMarkdown/>}/>
              <Route path="/Loginandsign" element={<Loginandsign/>}/>
            </Routes>
          </main>
        </div>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
)