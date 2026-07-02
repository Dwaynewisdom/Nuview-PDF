import React, { useEffect, useRef, useState } from 'react'

const OUTPUT_FORMATS = [
  { value: 'docx', label: 'Word (DOCX)' },
  { value: 'pptx', label: 'PowerPoint (PPTX)' },
  { value: 'xlsx', label: 'Excel (XLSX)' },
]

function resolveConvertApiFileUrl(result) {
  const candidates = [
    result?.Files?.[0],
    result?.files?.[0],
    result?.File,
    result?.file,
  ].filter(Boolean)

  for (const fileInfo of candidates) {
    const url =
      fileInfo?.Url ||
      fileInfo?.url ||
      fileInfo?.FileUrl ||
      fileInfo?.fileUrl ||
      fileInfo?.DownloadUrl ||
      fileInfo?.downloadUrl
    if (url) return url
  }

  const findUrl = (value) => {
    if (!value || typeof value !== 'object') return null
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findUrl(item)
        if (found) return found
      }
      return null
    }

    for (const [key, val] of Object.entries(value)) {
      if (typeof val === 'string' && /url$/i.test(key) && val.startsWith('http')) {
        return val
      }
      const nested = findUrl(val)
      if (nested) return nested
    }
    return null
  }

  return findUrl(result)
}

function FileDropZone({ fileName, onFileSelect, error, setError }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files) {
    const selected = Array.from(files).find((file) => file.type === 'application/pdf') || files[0]
    if (!selected) {
      setError('Only PDF files are supported. Please drop a PDF file.')
      return
    }
    setError('')
    onFileSelect(selected)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div>
      <label className="block text-lg font-semibold mb-3">Upload PDF</label>
      <div
        className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        } cursor-pointer`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-xl font-semibold text-gray-700">Drag and drop a PDF file here</p>
        <p className="mt-2 text-sm text-gray-500">Or click to browse files</p>
        <p className="mt-4 text-sm text-gray-500">{fileName || 'No file selected yet'}</p>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function FormatSelector({ format, setFormat }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Export format</label>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="rounded-xl border border-gray-300 px-4 py-3 bg-white"
      >
        {OUTPUT_FORMATS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function FileSummary({ file, onRemove }) {
  if (!file) return null

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between gap-4">
      <div>
        <div className="font-semibold">Selected file</div>
        <div className="text-sm text-gray-600">{file.name}</div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
      >
        Remove
      </button>
    </div>
  )
}

function ConvertPanel({ disabled, loading, onConvert, downloadUrl }) {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={onConvert}
        className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-white font-semibold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
      >
        {loading ? 'Converting…' : 'Convert to Office'}
      </button>
      {downloadUrl && (
        <a
          href={downloadUrl.url}
          download={downloadUrl.name}
          className="inline-flex items-center justify-center rounded-2xl border border-blue-500 px-6 py-3 text-blue-700 font-semibold hover:bg-blue-50"
        >
          Download {downloadUrl.name}
        </a>
      )}
    </div>
  )
}

function FooterNote() {
  return (
   <>
   </>
  )
}

export default function PDFtooffice() {
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState('docx')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [conversionUsed, setConversionUsed] = useState(false)
  const [nextResetTime, setNextResetTime] = useState(null)

  // Check if daily conversion limit has been used
  useEffect(() => {
    const storedData = localStorage.getItem('pdfConversionLimit')
    if (storedData) {
      const { date, used, resetTime } = JSON.parse(storedData)
      const today = new Date().toDateString()
      
      if (date === today) {
        setConversionUsed(used)
        setNextResetTime(resetTime)
      } else {
        // New day, reset the limit
        localStorage.removeItem('pdfConversionLimit')
        setConversionUsed(false)
        setNextResetTime(null)
      }
    }
  }, [])

  // Calculate time until reset
  useEffect(() => {
    if (!nextResetTime) return
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const timeLeft = nextResetTime - now
      
      if (timeLeft <= 0) {
        localStorage.removeItem('pdfConversionLimit')
        setConversionUsed(false)
        setNextResetTime(null)
        setStatusMessage('')
        clearInterval(timer)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [nextResetTime])

  useEffect(() => {
    return () => {
      if (downloadUrl?.url) {
        URL.revokeObjectURL(downloadUrl.url)
      }
    }
  }, [downloadUrl])

  function handleFileSelect(selectedFile) {
    setError('')
    setStatusMessage('')
    setDownloadUrl(null)
    setFile(selectedFile)
  }

  function clearFile() {
    setFile(null)
    setError('')
    setStatusMessage('')
    setDownloadUrl(null)
  }

  async function handleConvert() {
    // Check daily limit
    if (conversionUsed) {
      const timeLeft = nextResetTime - new Date().getTime()
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      setError(`🔒 Free daily conversion used. Next conversion available in ${hours}h ${minutes}m. Upgrade to convert more.`)
      return
    }

    if (!file) {
      setError('Select a PDF file first.')
      return
    }

    const secret = import.meta.env.VITE_CONVERTAPI_SECRET
    if (!secret) {
      setError('Missing VITE_CONVERTAPI_SECRET in .env.')
      return
    }

    setError('')
    setLoading(true)
    setStatusMessage('Uploading file and converting...')
    setDownloadUrl(null)

    try {
      const formData = new FormData()
      formData.append('File', file)

      const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/${format}?Secret=${secret}`, {
        method: 'POST',
        body: formData,
      })

      const responseText = await response.text()
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Conversion failed: invalid JSON response from ConvertAPI. Response text: ${responseText}`)
      }

      if (!response.ok) {
        const errorMessage = result?.Message || result?.Error || result?.error || JSON.stringify(result)
        throw new Error(`Conversion failed: ${response.status} ${errorMessage}`)
      }

      const fileCandidates = [result?.Files?.[0], result?.files?.[0], result?.File, result?.file].filter(Boolean)
      const fileInfo = fileCandidates[0] || null

      const fileUrl = resolveConvertApiFileUrl(result)

      if (fileUrl) {
        const downloadResponse = await fetch(fileUrl)
        if (!downloadResponse.ok) {
          throw new Error('Failed to download converted file.')
        }

        const blob = await downloadResponse.blob()
        const objectUrl = URL.createObjectURL(blob)
        setDownloadUrl({ url: objectUrl, name: `${file.name.replace(/\.pdf$/i, '')}.${format}` })
        setStatusMessage('Conversion complete. Download your file below.')
        
        // Mark conversion as used for today
        const resetTime = new Date().getTime() + (24 * 60 * 60 * 1000)
        localStorage.setItem('pdfConversionLimit', JSON.stringify({
          date: new Date().toDateString(),
          used: true,
          resetTime
        }))
        setConversionUsed(true)
        setNextResetTime(resetTime)
      } else if (fileInfo?.FileData) {
        // ConvertAPI returned the file inline as base64 in FileData
        try {
          const base64 = fileInfo.FileData
          const binaryString = atob(base64)
          const len = binaryString.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          const blob = new Blob([bytes], { type: 'application/octet-stream' })
          const objectUrl = URL.createObjectURL(blob)
          const name = fileInfo.FileName || `${file.name.replace(/\.pdf$/i, '')}.${fileInfo.FileExt || format}`
          setDownloadUrl({ url: objectUrl, name })
          setStatusMessage('Conversion complete. Download your file below.')
          
          // Mark conversion as used for today
          const resetTime = new Date().getTime() + (24 * 60 * 60 * 1000)
          localStorage.setItem('pdfConversionLimit', JSON.stringify({
            date: new Date().toDateString(),
            used: true,
            resetTime
          }))
          setConversionUsed(true)
          setNextResetTime(resetTime)
        } catch (err) {
          console.error('Failed to decode FileData from ConvertAPI:', err)
          console.error('ConvertAPI fileInfo:', fileInfo)
          throw new Error('Conversion returned inline file data but failed to decode it.')
        }
      } else {
        console.error('ConvertAPI response object:', result)
        console.error('ConvertAPI response stringify:', JSON.stringify(result, null, 2))
        console.error('ConvertAPI file candidates:', fileCandidates)
        throw new Error(
          'No output file URL or inline file data returned by ConvertAPI. Inspect browser console for the full response object.'
        )
      }
    } catch (error_) {
      setError(error_.message || 'Conversion failed. Please try again.')
      setStatusMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto my-8 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">PDF to Microsoft Office</h1>
        <p className="mt-2 text-gray-600">Convert PDFs into editable Word, Excel, or PowerPoint files with drag-and-drop upload.</p>
        <p className='mt-2 text-gray-600'>Made With ConvertAPI</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="space-y-8">
            <FileDropZone
              fileName={file?.name}
              onFileSelect={handleFileSelect}
              error={error}
              setError={setError}
            />
            <FileSummary file={file} onRemove={clearFile} />
            <FooterNote />
          </div>

          <div className="space-y-6 rounded-[28px] border border-gray-200 bg-gray-50 p-6">
            <FormatSelector format={format} setFormat={setFormat} />
            <ConvertPanel
              disabled={!file || loading || conversionUsed}
              loading={loading}
              onConvert={handleConvert}
              downloadUrl={downloadUrl}
            />
            {conversionUsed && !downloadUrl && (
              <div className="text-sm text-orange-600 font-semibold">
                🔒 Daily free conversion used. Upgrade to convert more.
              </div>
            )}
            {statusMessage && <div className="text-sm text-gray-700">{statusMessage}</div>}
            {error && !downloadUrl && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}