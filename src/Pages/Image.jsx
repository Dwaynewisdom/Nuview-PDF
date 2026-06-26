import React, { useState, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'

function Image() {
    const [items, setItems] = useState([]) 
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    function onFiles(e) {
        const files = Array.from(e.target.files || [])
        addFiles(files)

        e.target.value = ''
    }

    function addFiles(files) {
        if (!files || files.length === 0) return
        const newItems = files.map(f => ({ file: f, url: URL.createObjectURL(f) }))
        setItems(prev => [...prev, ...newItems])
    }

    function handleDrop(e) {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files || [])
        addFiles(files)
    }

    function removeAll() {
        items.forEach(i => URL.revokeObjectURL(i.url))
        setItems([])
    }

    function removeAt(index) {
        const toRemove = items[index]
        if (toRemove) URL.revokeObjectURL(toRemove.url)
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    async function generatePdf() {
        if (items.length === 0) return
        const pdfDoc = await PDFDocument.create()

        for (const it of items) {
            const arrayBuffer = await it.file.arrayBuffer()
            const uint8 = new Uint8Array(arrayBuffer)
            let img
            try {
                if (it.file.type === 'image/png') {
                    img = await pdfDoc.embedPng(uint8)
                } else {
                    
                    img = await pdfDoc.embedJpg(uint8)
                }
            } catch (err) {
                
                try {
                    img = await pdfDoc.embedJpg(uint8)
                } catch (err2) {
                    img = await pdfDoc.embedPng(uint8)
                }
            }

            const { width, height } = img.scale(1)
            const page = pdfDoc.addPage([width, height])
            page.drawImage(img, { x: 0, y: 0, width, height })
        }

        const bytes = await pdfDoc.save()
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'images-to-pdf.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="mx-auto my-8 max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className='text-3xl font-bold text-gray-900 text-center'>Images → PDF</h2>
                <p className='mt-2 text-gray-600 text-center'>Upload images and generate a single PDF. Drag & drop or click to select.</p>

                <div className="mt-8">
                    <div
                        className={`w-full rounded-3xl border-2 border-dashed p-6 text-center transition ${isDragging ? 'bg-gray-50 border-blue-300' : 'bg-white border-gray-200'} cursor-pointer`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current && inputRef.current.click()}
                    >
                    {/*Image selection*/}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onFiles}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4a4 4 0 018 0v4m-5-4v4m0 0H5m6 0h6" />
                            </svg>
                            <p className="mt-2 text-xl font-semibold text-gray-700">Drop images here, or click to select</p>
                            <p className="mt-1 text-sm text-gray-400">{items.length} selected</p>
                        </div>
                    </div>

                    <div className='mt-6 flex gap-4 items-center'>
                        <button onClick={generatePdf} disabled={items.length === 0} className='inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-white font-semibold hover:bg-orange-600 disabled:opacity-50'>
                            Generate PDF ({items.length})
                        </button>
                        <button onClick={removeAll} disabled={items.length === 0} className='inline-flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-red-700 font-semibold disabled:opacity-50'>
                            Remove All
                        </button>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4">
                        {items.map((it, idx) => (
                            <div key={idx} className="w-36 border rounded shadow-sm p-2 relative bg-white">
                                <button
                                    onClick={() => removeAt(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                                    title="Remove"
                                >
                                    ×
                                </button>
                                <div className="h-24 flex items-center justify-center overflow-hidden">
                                    <img src={it.url} alt={it.file.name} className="max-w-full max-h-24" />
                                </div>
                                <div className="text-xs mt-2">{it.file.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Image;