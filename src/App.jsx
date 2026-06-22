// src/App.jsx
function App() {
const services = [
  {
    name: "Merge PDF",
    image: "",
    text: "Combine multiple PDF documents into a single, perfectly ordered file in seconds.",
    id: "organizing"
  },
  {
    name: "PDF Compress",
    image: "",
    text: "Reduce your file size while preserving maximum visual and text quality.",
    id: "organizing"
  },
  {
    name: "Image to PDF",
    image: "",
    text: "Convert JPG, PNG, and other image formats into clean, professional PDF layouts.",
    id: "organizing" 
  },
  {
    name: "PDF to Office",
    image: "",
    text: "Seamlessly export your PDF data into fully editable Word, Excel, or PowerPoint documents.",
    id: "organizing" 
  },
  {
    name: "Edit PDF",
    image: "",
    text: "Modify text, tweak layouts, and update content directly inside your browser.",
    id: "organizing"
  },
  {
    name: "Watermark",
    image: "",
    text: "Add custom text or image overlays to protect, brand, and secure your files.",
    id: "organizing"
  },
  {
    name: "Rearrange Pages",
    image: "",
    text: "Drag, drop, rotate, or delete individual pages to organize your document your way.",
    id: "organizing"
  }
];

  const links = [{

  }]
  return (
    <>
      <section className="m-5 border-2 bg-orange-700 border-gray-300 shadow-lg shadow-black/20 rounded-2xl p-6 flex items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>NuView PDF</h1>
          <p className="text-lg text-white/90 mt-1">Your PDFs, through a NU lens.</p>
        </div>

        <div className="ml-auto flex gap-3">
          <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200">Login</a>
          <a href="#" className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200">Sign Up</a>
        </div>
      </section>
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
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-amber-600 text-white font-semibold">
                {s.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <h3 className="text-lg font-medium ">{s.name}</h3>
                <p className="text-sm ">{s.text || 'Quick and easy'}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </>

  )
}

export default App;