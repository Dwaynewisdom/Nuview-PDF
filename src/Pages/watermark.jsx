import React, { useRef, useState } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export default function PdfWatermarker() {
  const inputRef = useRef(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  function handlePick() {
    inputRef.current?.click();
  }

  function handleFileChange(e) {
    setError(null);
    cleanupDownloadUrl();
    const list = Array.from(e.target.files || []);
    const pdf = list.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdf) setFile(pdf);
  }

  function handleDropFiles(e) {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    cleanupDownloadUrl();
    const list = Array.from(e.dataTransfer.files || []);
    const pdf = list.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (!pdf) {
      setError('No PDF file detected in drop.');
      return;
    }
    setFile(pdf);
  }

  function handleClear() {
    setFile(null);
    setError(null);
    cleanupDownloadUrl();
  }

  function cleanupDownloadUrl() {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }

  async function handleWatermark() {
    setError(null);
    if (!file) {
      setError('Please select or drag a PDF file first.');
      return;
    }
    if (!watermarkText.trim()) {
      setError('Please enter watermark text before processing.');
      return;
    }

    try {
      setProcessing(true);
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: 100,
          color: rgb(0.75, 0.75, 0.75),
          opacity: 0.4,
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);


      const a = document.createElement('a');
      a.href = url;
      a.download = `${watermarkText.trim().replace(/\s+/g, '_')}_watermarked.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      setError('Failed to apply watermark. See console for details.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto my-8 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className='text-3xl font-bold text-gray-900'>Watermark PDF File</h1>
        <p className='mt-2 text-gray-600'>Enter your custom text, drag in a PDF, and instantly apply an overlaid watermark across every page.</p>

        <div className="mt-8 space-y-6">
      
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Watermark Text</label>
            <input 
              type="text" 
              placeholder="e.g., CONFIDENTIAL, DRAFT, COPY ONLY" 
              value={watermarkText}
              onChange={(e) => { setError(null); setWatermarkText(e.target.value); }}
              className='w-full max-w-md p-3 border border-gray-300 rounded-xl shadow-sm focus:border-orange-500 focus:ring-orange-500'
            />
          </div>

          {/* Hidden File Input */}
          <input
            ref={inputRef}
            type='file'
            accept='application/pdf'
            className='hidden'
            onChange={handleFileChange}
          />

          {/* Drag and Drop Zone */}
          <div
            className={`w-full rounded-3xl border-2 border-dashed p-6 text-center transition ${isDragging ? 'bg-gray-50 border-blue-300' : 'bg-white border-gray-200'} cursor-pointer`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDropFiles}
            onClick={handlePick}
          >
            <p className='text-sm text-gray-600'>Drag & drop a PDF file here, or click to select</p>
            <p className='text-xs text-gray-400 mt-1'>{file ? '1 file selected' : 'No file selected'}</p>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 mt-6'>
            <button onClick={handlePick} className='inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-2xl font-semibold shadow hover:bg-orange-600'>
              Select PDF
            </button>

            <button 
              onClick={handleWatermark} 
              disabled={processing || !file || !watermarkText.trim()} 
              className='inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-2xl font-semibold shadow disabled:opacity-50 hover:bg-orange-600'
            >
              {processing ? 'Processing…' : 'Apply & Download'}
            </button>

            <button onClick={handleClear} disabled={!file && !watermarkText} className='inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-2xl font-semibold shadow disabled:opacity-50 hover:bg-red-100'>
              Clear
            </button>
          </div>

          {error && <p className='text-sm text-red-500 mt-4'>{error}</p>}

          {/* Selected File Details Row */}
          <div className='mt-6'>
            {file ? (
              <div className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{file.name}</p>
                  <p className='text-xs text-gray-400'>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={handleClear} className='text-sm text-red-500 hover:text-red-700 font-medium'>Remove</button>
              </div>
            ) : (
              <p className='text-center text-sm text-gray-500'>No PDF file selected yet</p>
            )}
          </div>

          {/* Persistent Download Link alternative */}
          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
              <p className="text-sm text-green-800 mb-2 font-medium">Your document is ready!</p>
              <a href={downloadUrl} download={`${watermarkText.trim().replace(/\s+/g, '_')}_watermarked.pdf`} className='inline-block text-sm text-blue-600 hover:text-blue-800 font-bold underline'>
                Click here if your download didn't start automatically
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}