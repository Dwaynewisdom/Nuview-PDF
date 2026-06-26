import React, { useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function Merge() {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [merging, setMerging] = useState(false)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  function handlePick() {
    inputRef.current?.click()
  }

  function handleFilesChange(e) {
    setError(null)
    const list = Array.from(e.target.files || [])
    const pdfs = list.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    setFiles(prev => [...prev, ...pdfs])
  }

  function handleDropFiles(e) {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    const list = Array.from(e.dataTransfer.files || [])
    const pdfs = list.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    if (pdfs.length === 0) {
      setError('No PDF files detected in drop.')
      return
    }
    setFiles(prev => [...prev, ...pdfs])
  }

  function handleClear() {
    setFiles([])
    setError(null)
  }

  function handleDragStart(e, index) {
    try { e.dataTransfer.setData('text/plain', String(index)) } catch (err) { /* ignore */ }
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e, index) {
    e.preventDefault()
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (Number.isNaN(from)) return
    setFiles(prev => {
      const arr = [...prev]
      const [moved] = arr.splice(from, 1)
      arr.splice(index, 0, moved)
      return arr
    })
  }

  function moveItem(i, to) {
    if (to < 0 || to >= files.length) return
    setFiles(prev => {
      const arr = [...prev]
      const [item] = arr.splice(i, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  async function handleMerge() {
    setError(null)
    if (files.length < 2) {
      setError('Select at least two PDF files to merge.')
      return
    }

    try {
      setMerging(true)
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach(p => mergedPdf.addPage(p))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setError('Failed to merge PDFs. See console for details.')
    } finally {
      setMerging(false)
    }
  }

  return (
    <div className="mx-auto my-8 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className='text-3xl font-bold text-gray-900'>Merge PDF Files</h1>
        <p className='mt-2 text-gray-600'>Upload multiple PDFs, reorder them and merge into a single document.</p>

        <div className="mt-8">
          <input
            ref={inputRef}
            type='file'
            accept='application/pdf'
            multiple
            className='hidden'
            onChange={handleFilesChange}
          />

          <div
            className={`w-full rounded-3xl border-2 border-dashed p-6 text-center transition ${isDragging ? 'bg-gray-50 border-blue-300' : 'bg-white border-gray-200'} cursor-pointer`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDropFiles}
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            <p className='text-sm text-gray-600'>Drag & drop PDF files here, or click to select</p>
            <p className='text-xs text-gray-400 mt-1'>{files.length} selected</p>
          </div>

          <div className='flex gap-4 mt-6'>
            <button onClick={handlePick} className='inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-2xl font-semibold shadow hover:bg-orange-600'>
              Select PDFs
            </button>

            <button onClick={handleMerge} disabled={merging || files.length < 2} className='inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-2xl font-semibold shadow disabled:opacity-50'>
              {merging ? 'Merging…' : 'Merge & Download'}
            </button>

            <button onClick={handleClear} disabled={files.length === 0} className='inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-2xl font-semibold shadow disabled:opacity-50'>
              Clear
            </button>
          </div>

          {error && <p className='text-sm text-red-500 mt-4'>{error}</p>}

          <div className='mt-6'>
            {files.length === 0 ? (
              <p className='text-center text-sm text-gray-500'>No PDFs selected</p>
            ) : (
              <ul className='space-y-2'>
                {files.map((f, i) => (
                  <li
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, i)}
                    className='flex items-center justify-between p-3 bg-white rounded-lg border'
                  >
                    <div>
                      <p className='text-sm font-medium'>{f.name}</p>
                      <p className='text-xs text-gray-400'>{(f.size / 1024).toFixed(1)} KB</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button onClick={() => moveItem(i, i - 1)} className='text-lg bg-amber-600 text-white px-2 py-1 rounded' aria-label='Move up'>↑</button>
                      <button onClick={() => moveItem(i, i + 1)} className='text-lg bg-amber-600 text-white px-2 py-1 rounded' aria-label='Move down'>↓</button>
                      <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className='text-sm text-red-500'>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}