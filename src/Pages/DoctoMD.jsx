import React, { useEffect, useRef, useState } from 'react';

function FileDropZone({ fileName, onFileSelect, error, setError }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files) {
    const selected = files[0];
    if (!selected) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    const isValidExtension = selected.name.match(/\.(pdf|docx|doc)$/i);

    if (!validTypes.includes(selected.type) && !isValidExtension) {
      setError('Only PDF and DOCX files are supported. Please drop a valid document.');
      return;
    }
    setError('');
    onFileSelect(selected);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div>
      <label className="block text-lg font-semibold mb-3">Upload Document</label>
      <div
        className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        } cursor-pointer`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-xl font-semibold text-gray-700">Drag and drop a PDF or DOCX here</p>
        <p className="mt-2 text-sm text-gray-500">Or click to browse files</p>
        <p className="mt-4 text-sm text-gray-500">{fileName || 'No file selected yet'}</p>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-sm text-gray-600">
        Please ensure to use PDF OR DOCX containing text. If necessary, you can convert your file to a word document and then return to convert it into Markdown.
      </p>
    </div>
  );
}

function FileSummary({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between gap-4">
      <div>
        <div className="font-semibold text-gray-800">Selected file</div>
        <div className="text-sm text-gray-600 truncate max-w-200px sm:max-w-xs">{file.name}</div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

function ConvertPanel({ disabled, loading, onConvert, downloadUrl, markdown }) {
  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(markdown);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = markdown;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={onConvert}
        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? 'Converting…' : 'Convert to Markdown'}
      </button>
      
      {downloadUrl && (
        <>
          <a
            href={downloadUrl.url}
            download={downloadUrl.name}
            className="inline-flex items-center justify-center rounded-2xl border border-blue-500 px-6 py-3 text-blue-700 font-semibold hover:bg-blue-50 transition"
          >
            Download .md
          </a>
          <button
            type="button"
            onClick={copyToClipboard}
            className="inline-flex items-center justify-center rounded-2xl bg-gray-200 px-6 py-3 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Copy Text
          </button>
        </>
      )}
    </div>
  );
}

export default function DocumentToMarkdown() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (downloadUrl?.url) {
        URL.revokeObjectURL(downloadUrl.url);
      }
    };
  }, [downloadUrl]);

  function handleFileSelect(selectedFile) {
    setError('');
    setStatusMessage('');
    setDownloadUrl(null);
    setMarkdown('');
    setFile(selectedFile);
  }

  function clearFile() {
    setFile(null);
    setError('');
    setStatusMessage('');
    setDownloadUrl(null);
    setMarkdown('');
  }

  async function handleConvert() {
    if (!file) {
      setError('Select a document first.');
      return;
    }

    setError('');
    setLoading(true);
    setStatusMessage('Parsing document structure...');
    setDownloadUrl(null);
    setMarkdown('');

    try {
      const formData = new FormData();
      formData.append('document', file); 

      // Check for a live URL in Vite environment variables, otherwise use local computer
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

      const response = await fetch(`${backendUrl}/api/convert`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Conversion failed: ${response.status}`);
      }

      setMarkdown(data.markdown);
      
      const blob = new Blob([data.markdown], { type: 'text/markdown' });
      const objectUrl = URL.createObjectURL(blob);
      setDownloadUrl({ url: objectUrl, name: `${file.name.replace(/\.(pdf|docx|doc)$/i, '')}.md` });
      
      setStatusMessage('Conversion complete! Preview or download your Markdown below.');

    } catch (error_) {
      console.error(error_);
      setError(error_.message || 'Conversion failed. Please try again.');
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto my-8 max-w-5xl px-4 sm:px-6 lg:px-8 font-sans">
      <div className="border border-gray-200 bg-white p-8 shadow-sm rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Document to Markdown</h1>
        <p className="mt-2 text-gray-600">Extract clean, semantic Markdown from PDFs and Word documents for AI processing.</p>
        <p className='mt-2 text-gray-400 text-sm font-medium'>Powered by Node.js Backend</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
          {/* Left Column: Upload & Summary */}
          <div className="space-y-6">
            <FileDropZone
              fileName={file?.name}
              onFileSelect={handleFileSelect}
              error={error}
              setError={setError}
            />
            <FileSummary file={file} onRemove={clearFile} />
          </div>

          {/* Right Column: Actions & Preview */}
          <div className="space-y-6 rounded-[28px] border border-gray-200 bg-gray-50 p-6 flex flex-col">
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Actions</h3>
              <ConvertPanel
                disabled={!file || loading}
                loading={loading}
                onConvert={handleConvert}
                downloadUrl={downloadUrl}
                markdown={markdown}
              />
              {statusMessage && <div className="mt-3 text-sm text-green-700 font-medium">{statusMessage}</div>}
              {error && !downloadUrl && <div className="mt-3 text-sm text-red-600 font-medium">{error}</div>}
            </div>

            {/* Markdown Preview Area */}
            <div className="flex-1 flex flex-col mt-4 min-h-250px">
              <label className="font-semibold text-gray-800 mb-2">Markdown Preview</label>
              <div className="flex-1 w-full rounded-xl border border-gray-300 bg-gray-900 p-4 overflow-hidden relative">
                {markdown ? (
                  <pre className="w-full h-full text-gray-100 text-sm font-mono whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                    {markdown}
                  </pre>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-sm">
                    {loading ? 'Converting document...' : 'Converted markdown will appear here.'}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}