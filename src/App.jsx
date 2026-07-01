import React from "react"
import { Link } from 'react-router-dom'
function App() {
const services = [
  {
    name: "Merge PDF",
    image: "https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@18d69184f3c3c7c3b3ff233523205c9cd15df725/Images/merge.png",
    text: "Combine multiple PDF documents into a single, perfectly ordered file in seconds.",
    id: "organizing",
    link:"/merge"
  },
  {
    name: "Image to PDF",
    image: "https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@18d69184f3c3c7c3b3ff233523205c9cd15df725/Images/png-file.png",
    text: "Convert JPG, PNG, and other image formats into clean, professional PDF layouts.",
    id: "organizing",
    link:"/Image" 
  },
  {
    name: "PDF to Office",
    image: "https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@18d69184f3c3c7c3b3ff233523205c9cd15df725/Images/pdf-file.png",
    text: "Seamlessly export your PDF data into fully editable Word, Excel, or PowerPoint documents.",
    id: "organizing" ,
    link:"/PDFtooffice"
  },
  {
    name: "Watermark",
    image: "https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@18d69184f3c3c7c3b3ff233523205c9cd15df725/Images/stamp.png",
    text: "Add custom text to protect, brand, and secure your files.",
    id: "organizing",
    link:"/PdfWatermarker"
  },
  {
    name: "Edit PDF",
    image: "https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@8ba4dfe353b3e5a8e349fa9fb4818e5c52af1e58/Images/edit-file.png",
    text: "Edit existing PDF text, add new content, and save your changes instantly.",
    id: "editing",
    link: "/editpdf"
  }
];

  const links = [{

  }]
  return (
    <>
      <section className="m-5 flex " style={{fontFamily:'Poppins'}}>
        <div>
          <h2 className="font-bold ml-5 text-[23px] text-center">All your essential PDF tools, right at your fingertips.</h2>
          <p className="text-center text-[19px]">Stop wrestling with restrictive document software. Enjoy completely free, unlimited access to elite tools built to modify, compress, convert, and secure your PDFs instantly. No complications, no hidden catch.</p>
        </div>
      </section>
      <section>
        
      </section>
      <section id="services" className="m-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <article
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200/10 bg-white/3 transition-transform transform hover:scale-105 duration-200 shadow-xl"
            >
            <Link to= {s.link}>
              <div className="w-25 h-12 flex items-center justify-center rounded-lg bg-white text-white font-semibold">
                <img src={s.image} className="w-15 h-15 p-2"/>
              </div>
              <div>
                <h3 className="text-lg font-medium ">{s.name}</h3>
                <p className="text-sm ">{s.text || 'Quick and easy'}</p>
              </div>
            </Link>
            </article>
          ))}
        </div>
      </section>

    </>

  )
}

export default App;